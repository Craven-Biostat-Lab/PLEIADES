#!/usr/bin/env python
# -*- coding: utf-8 -*-

from bottle import Bottle, run
from bottle import get, put, request, response, static_file
from bottle import error
import logging
import logging.config
from pymongo import MongoClient
import pymongo
import json
import os
import os.path
import sys;
reload(sys)
sys.setdefaultencoding("utf-8")
from bson import json_util



#app = application = Bottle()
app = Bottle()


# Use 'debug mode' if the 1st command-line argument is 'debug'
from sys import argv
debug = len(argv) > 1 and argv[1] == 'debug'

# Use the URL prefix 'v1' if in debug mode.  (In deployment, this will be already done by the server.)
url_prefix = '/v1' if debug else ''

# Path to the front-end repository in debug-mode/development.  (This isn't used in deployment.)
debug_frontend_path = os.path.join(os.path.dirname(os.path.realpath(__file__)), '..', 'PLEIADES-frontend')



@app.error(404)
def error404(error):
    return 'Something bad happened. You may try again if you feel adventurous. If not, please contact the webadmin!'



@app.get(url_prefix + '/articles')
def get_articles():
    """
    Return the first 30 articles from the database as JSON.
    
    This resource is used for the screen showing a list of articles.  If we decide
    to change which articles are shown on the page, we will need to change the query
    made against the database.
    """


    # Query the database for the first 10 articles in the collection called 'articles'.
    # Exclude the 'datums' field for each article.
    top_articles = database.articles.find(limit=30, projection={'Datums':False})
    
    # Set headers to tell the browser that this response has JSON.
    response.headers['Content-Type'] = 'application/json'
    response.headers['Cache-Control'] = 'no-cache'
    
    # Convert the query results into a JSON string, and return it as the response.
    return json_util.dumps({'articles': list(top_articles)})




@app.get(url_prefix + '/articles/<PMCID>')
def get_article(PMCID):
    """
    Return an article from the database with the given PMID, including its datums.
    """

    # Lookup the article from the database
    article = database.articles.find_one({'PMCID':PMCID})
    
    meta = {}
    if not article:
        meta = {'error': 'article not found'}
    else:
    
        # group the datums for the article by treatment entity
        article['treatmentEntities'] = group_by_entity(article['Datums'])
        del article['Datums']

    # Set headers to tell the browser that this response has JSON.
    response.headers['Content-Type'] = 'application/json'
    response.headers['Cache-Control'] = 'no-cache'
    
    # Convert the query results into a JSON string, and return it as the response.
    return json_util.dumps({'article': article, 'meta':meta})






def group_by_entity(datums):
    """
    We need to show the datums on the page grouped by their treatment entity, 
    so this function iterates through the datums in an article from the database, a
    nd groups them by treatment entity.  Returns a list, with each element structured 
    like a dict element in the comments below.
    """


    """
    Group datums together by entity.
    Dict items look like this:

    uniprotID : {
        'TreatmentEntity': {...},
        'TreatmentTypes': [
            {
                'datum_id': "..."
                'confidence': "..."
                'Text': "...",
                'Hilights': [...],
                'Entity_string': string,
            },
            ...
        ],
        'TreatmentTests': [
            {
                'datum_id': "..."
                'confidence': "..."
                'Text': "...",
                'Hilights': [...],
                'Entity_string': string,
            },
            ...
        ],
    }    
    
    """
    treatmentEntities = dict()



    for datum in datums:
        
        TreatmentEntity = datum['map']['TreatmentEntity']['Entity']
        UniprotId = TreatmentEntity['UniprotId'][0]


        # Do we already have a group for this treatment entity?
        if UniprotId not in treatmentEntities:
            treatmentEntities[UniprotId] = {
                'TreatmentEntity': TreatmentEntity,
                'TreatmentTypes': [],
                'TreatmentTests': [],
            }


        # If this datum has a TreatmentType, add it to the TreatmentTypes list for this entity.
        if 'TreatmentType' in datum['map']:
        
            TreatmentType = datum['map']['TreatmentType']
            TreatmentType['datum_id'] = datum['datum_id']
            TreatmentType['confidence'] = datum['confidence']
            TreatmentType['Entity_string'] = TreatmentEntity['strings']
        
            treatmentEntities[UniprotId]['TreatmentTypes'].append(TreatmentType)
            
        # If this datum has a TreatmentTest, add it to the TreatmentTests list for this entity.
        if 'TreatmentTest' in datum['map']:
        
            TreatmentTest = datum['map']['TreatmentTest']
            TreatmentTest['datum_id'] = datum['datum_id']
            TreatmentTest['confidence'] = datum['confidence']
            TreatmentTest['Entity_string'] = TreatmentEntity['strings']
        
            treatmentEntities[UniprotId]['TreatmentTests'].append(TreatmentTest)
            

    for entity in treatmentEntities.values():
        entity['TreatmentTypes'].sort()
        entity['TreatmentTests'].sort()

    # convert from dict to list (get rid of UniprotId keys)
    return treatmentEntities.values()








@app.put(url_prefix + '/datums')
def put_datums():
    
    # Insert a record into the 'user_edits_incremental' collection
    insert_user_edits_incremental(request.json)

    # Update the flat 'user_edits' collection, which has the aggregate of all edits from all users.
    update_user_edits(request.json)
    

    # TODO: update the in-place database object that the website loads the highlights from

    
    return '200 OK'




def insert_user_edits_incremental(json):
    """
    Insert the user-submitted edits as a document in the 'user_edits_incremental' collection.
    
    Nest the hilights like:
    'treatments' -> treatment text -> protein/entity -> serialized highlight array.
    """
    
    
    treatments = {}
    
    for datum in json['datums']:
        
        if datum['Text'] not in treatments:
            treatments[datum['Text']] = {}
            
        treatments[datum['Text']][datum['Entity_string']] = datum['Highlight']
        
    database.user_edits_incremental.insert_one({
        'articleOpenTime': json['articleOpenTime'],
        'submitTime': json['submitTime'],
        'PMID': json['PMID'],
        'PMCID': json['PMCID'],
        'client_ip': request.environ.get('REMOTE_ADDR'),
        'treatments': treatments,
    })





def update_user_edits(json):
    """
    Update the user_edits collection, which keeps track of the aggregate of all edits made by the user.
    """

    for datum in json['datums']:
    
        database.user_edits.update(
            
            # Find matching element
            {
                json['PMID']: {
                    datum['Text']: {
                        datum['Entity_string'] : '$exists'
                    }
                }   
            },
            
            # Update hilight and timestamp
            {
                '$set': {
                    '{0}.{1}.{2}'.format(json['PMID'], datum['Text'], datum['Entity_string']) : {
                        'HighlightObject': datum['Highlight'],
                        'Timestamp': json['submitTime'],
                    }
                }
            },
            
            # Create a matching element if none exists already
            upsert=True
        )

    
#db.user_edits.update({'PMID123': {'RNAi': {'Protein1': '$exists'}}}, {'$set':{'PMID123.RNAi.Protein1': {'foo':1}}}, upsert=True)









# MongoDb connection details
connection_string = "mongodb://localhost"
connection = MongoClient(connection_string)
database = connection.Big_Mechanism

# Logging details
logging.config.fileConfig("./logs/logging.conf", disable_existing_loggers=False)
logger = logging.getLogger(__name__)





# In debug mode, compile the angular app, and watch for changes
# (Otherwise assume the angular app is already compiled.)
if debug:
    import subprocess
    subprocess.Popen('npm run start-noserver', cwd=debug_frontend_path, shell=True)



    # Static files, for node app
    # In deployment, this is handled by the server.

    @app.get('/node_modules/<filename:re:.*>')
    def static_node_modules(filename):
        return static_file(filename, root=os.path.join(debug_frontend_path,'node_modules'))

    @app.get('/app/<filename:re:.*>')
    def static_app(filename):
        return static_file(filename, root=os.path.join(debug_frontend_path, 'app'))

    @app.get('/systemjs.config.js')
    def static_bootstrapper():
        return static_file('systemjs.config.js', root=debug_frontend_path)

    @app.get('/article-text/<filename:re:.*>')
    def static_articles(filename):
        return static_file(filename, root='articles')

    @app.get('/static/<filename:re:.*>')
    def static_static(filename):    
        return static_file(filename, root=os.path.join(debug_frontend_path, 'static'))




    # Serve the index page for any URL that is not already designated for something else.
    # This is neccessary for our single-page-application, because there are some URL's that
    # are known only to the browser.

    # This has to be the last URL in this script.
    @app.get('/<url:re:.*>')
    def index_catchall(url):
        return static_file('index.html', root=debug_frontend_path)


    run(app, reloader=True, host='localhost', port=8080, debug=True)

    
