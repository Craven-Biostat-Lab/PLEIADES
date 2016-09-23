#!/usr/bin/env python
# -*- coding: utf-8 -*-

from bottle import Bottle, run
from bottle import template
from bottle import get, post, request, response, static_file
from bottle import error
from bottle import redirect
import logging
import logging.config
from pprint import pprint
from pymongo import MongoClient
import pymongo
import uuid
import json
import Access_MongoDB
import os
import pickle, datetime
import fileinput
import sys;
reload(sys)
sys.setdefaultencoding("utf-8")
from random import shuffle


def create_dict(client_ip, log_assay, log_change, log_subject, log_trtmnt, my_dict):
    my_dict["Query"] = {}
    my_dict["Query"]["Client_IP"] = client_ip
    my_dict["Query"]["Assay"] = log_assay
    my_dict["Query"]["Subject"] = log_change
    my_dict["Query"]["Treatment"] = log_trtmnt
    my_dict["Query"]["Change"] = log_change


def rank_articles(pmcid_details, rankby):
    if rankby == "expected":
        pmcid_details = sorted(pmcid_details, key=lambda k: k["Uniq_Datums"], reverse=True)        
    elif rankby == "uncertainty":
        shuffle(pmcid_details)
    return pmcid_details


def update_cssfile(pmcid):
    # selected_datums is a global variable assigned within the method: process_formdata
    datum_xmlpathid = pickle.load( open( "datum_xmlpathid_dict.p", "rb" ) )
    cssfile = os.path.join("./static/articles", pmcid, "jats-preview.css")  
    xml_pathids = list(set([xmlpath for datum_id in selected_datums[pmcid] for xmlpath in datum_xmlpathid[datum_id]]))           
    css_str = "\n" + '#d' + ", #d".join( xml_pathids) + " { background-color: #FFFF00; }"
    for line in fileinput.input(cssfile, inplace=1):
        if ': #FFFF00; }' in line.strip():
            continue 
        print line,     # The , is necessary for not including newlines between every line in the file            
        if line.strip().endswith('#f8f8f8 }'):
            print css_str,

#app = application = Bottle()
app = Bottle()

@app.route('/')     # http://localhost:8080/
def main_index():
    global fold_path    
    if not request.get_cookie("Visited"):   # If cookie is not created at client end, then create it        
        unique_id = str(uuid.uuid4())
        response.set_cookie("Visited", unique_id)
        currdate = str(datetime.datetime.date(datetime.datetime.now()))
        response.set_cookie("Time", currdate)         
    else: 
        unique_id = request.get_cookie("Visited"); 
        currdate = request.get_cookie("Time");
    fold_name = currdate + "_" + unique_id;
    fold_path = os.path.join("./feedback",fold_name);                      
    return template('Web_UI')


@app.post('/feedback')
def get_feedback():
    jsonstring = request.forms.get('jstring')
    json_cliobj = json.loads(jsonstring)
    
    if not fold_path:
        return "False"
        redirect("404")
    try:
        if not os.path.exists(fold_path):
            os.makedirs(fold_path)   
    except:
        return "False"
        redirect("404")
 
    try: 
        pmcid = "PMC" + json_cliobj["PMCID"].strip()
        pmcid_path = os.path.join(fold_path, pmcid)
        if not os.path.exists(pmcid_path):
                os.makedirs(pmcid_path)
        for datum in json_cliobj["Datums"]:
            if datum["New"] == "No":
                datum["Datum_Id"] = srno_datumid[json_cliobj["PMCID"].strip()][datum["sr_no"].strip()]
            else:
                datum["Datum_Id"] = []
        json_cliobj.update(search_dict)
        ts_fname = datetime.datetime.now().strftime("%Y%m%d-%H%M%S") + ".json"
        write_path = os.path.join(pmcid_path, ts_fname)
        json_fn = open(write_path, 'w')
        json.dump(json_cliobj, json_fn, indent=4, ensure_ascii=False)
        return "True"
    except:
        return "False"


@app.error(404)
def error404(error):
    return 'Something bad happened. You may try again if you feel adventurous. If not, please contact the webadmin!'


@app.post('/datum') # or @route('/login', method='POST')
def process_formdata():
    global srno_datumid; global search_dict;
    srno_datumid = {}; search_dict = {};
    query = {}; query2 = {}
    client_ip = request.environ.get('REMOTE_ADDR')

    # Rank
    rankby = request.forms.get('rank_by')
    #print rankby

    # Change
    change_inc = request.forms.get('change_inc')
    change_dec = request.forms.get('change_dec')
    change_unc = request.forms.get('change_unc')
    change_detunc = request.forms.get('change_detunc')
    change_det = request.forms.get('change_det')
    change_undet = request.forms.get('change_undet')
    if change_inc == None and change_dec == None and change_unc == None and change_detunc == None and change_det == None and change_undet == None:
        no_change = True; log_change = ""
    else:
        change_list = []
        if change_inc != None: change_list.append(change_inc)
        if change_dec != None: change_list.append(change_dec)
        if change_unc != None: change_list.append(change_unc)
        if change_detunc != None: change_list.append(change_detunc)
        if change_det != None: change_list.append(change_det)
        if change_undet != None: change_list.append(change_undet) 
        no_change = False; #print change_list
        query["map.change.Text"] = { "$in": change_list }
        query2["Datums.map.change.Text"] = { "$in": change_list }
        log_change = ", ".join(change_list)

    # Subject
    subject = request.forms.get('subject')
    if subject.strip() == "":         
        no_subj = True; log_subject = ""
    else:
        subj_ids, subj_syn = mongodb_obj.get_uniprot_ids(subject.lower().strip())
        if len(subj_ids) == 0:
            subj_ids.append(subject.lower().strip())
            query["map.subject.Entity.strings"] = { "$in": subj_ids }
            query2["Datums.map.subject.Entity.strings"] = { "$in": subj_ids }
        else:
            query["map.subject.Entity"] = { "$or": [{"strings": {"$in": subj_syn }}, {"uniprotSym": {"$in": subj_ids }}]}
            query2["Datums.map.subject.Entity"] = { "$or": [{"strings": {"$in": subj_syn }}, {"uniprotSym": {"$in": subj_ids }}]}
        no_subj = False; #print subj_ids
        log_subject = ", ".join(subj_ids)

    # Treatment
    treatment = request.forms.get('treatment')
    if treatment.strip() == "": 
        no_trtmnt = True; log_trtmnt = ""
    else:
        trtmnt_ids, trtmnt_syn = mongodb_obj.get_uniprot_ids(treatment.lower().strip())
        if len(trtmnt_ids) == 0:
            trtmnt_ids.append(treatment.lower().strip())
            query["map.treatment.Entity.strings"] = { "$in": trtmnt_ids }
            query2["Datums.map.treatment.Entity.strings"] = { "$in": trtmnt_ids }
        else:
            query["map.treatment.Entity"] = { "$or": [{"strings": {"$in": trtmnt_syn }}, {"uniprotSym": {"$in": trtmnt_ids }}]} 
            query2["Datums.map.treatment.Entity"] = { "$or": [{"strings": {"$in": trtmnt_syn }}, {"uniprotSym": {"$in": trtmnt_ids }}]}
        no_trtmnt = False; #print trtmnt_ids, "Saswati"
        log_trtmnt = ", ".join(trtmnt_ids)

    # Assay 
    assay_phos = request.forms.get('assay_phos')
    assay_copp = request.forms.get('assay_copp')
    assay_ubiq = request.forms.get('assay_ubiq')
    assay_gtp = request.forms.get('assay_gtp')
    if assay_phos == None and assay_copp == None and assay_ubiq == None and assay_gtp == None:
        no_assay = True; log_assay = ""       
    else:
        assay_list = []
        if assay_phos != None: assay_list.append(assay_phos)
        if assay_copp != None: assay_list.append(assay_copp)
        if assay_ubiq != None: assay_list.append(assay_ubiq)
        if assay_gtp != None: assay_list.append(assay_gtp)
        no_assay = False; #print assay_list
        query["map.assay.Text"] = { "$in": assay_list }
        query2["Datums.map.assay.Text"] = { "$in": assay_list }
        log_assay = ", ".join(assay_list)

    if no_subj and no_assay and no_change and no_trtmnt:
        return 'You have not made any selections. Please try again!'
  
    #return template('The subject is {{sub}}, the treatment is {{trt}}', sub=assay_phos, trt=change_detunc)
    create_dict(client_ip, log_assay, log_change, log_subject, log_trtmnt, search_dict)
    log_message = "\n" + client_ip + ":: " + "Assay: " + log_assay + "\t Change: " + log_change + "\t Subject: " + log_subject + "\t Treatment: " + log_trtmnt
    logger.info(log_message)
    pmcid_details = mongodb_obj.get_PMCID_datums(query, query2, srno_datumid)  # TODO: Analyze whether selected_datums can be replaced by srno_datumid in update_cssfile(pmid)    

    if len(pmcid_details) == 0:
        return 'Your selections did not match any datums. Please try again!'
    else:   
        ranked_articles = rank_articles(pmcid_details, rankby)
        return template('Search_Results', dict(pmcid_det=ranked_articles))
        
    #return template('The subject is {{sub}}, the treatment is {{trt}}', sub=assay_phos, trt=change_detunc)



@app.get('/articles/<pmc:re:PMC[0-9]*>/<filename>')
def html_article(pmc, filename):    
    #update_cssfile(pmc)
    rootdir = os.path.join(os.getcwd(), 'static/articles', pmc)
    return static_file(filename, root=rootdir)
    

@app.get('/<filename:re:.*\.js>')
def javascripts(filename):
    return static_file(filename, root='static/js')


@app.get('/<filename:re:.*\.css>')
def stylesheets(filename):
    return static_file(filename, root='static/css')


@app.get('/<filename:re:.*\.(jpg|png|gif|ico)>')
def images(filename):    
    return static_file(filename, root='static/img')


connection_string = "mongodb://localhost"
connection = MongoClient(connection_string)
database = connection.Big_Mechanism
mongodb_obj = Access_MongoDB.Big_Mech(database)

logging.config.fileConfig("./logs/logging.conf", disable_existing_loggers=False)
logger = logging.getLogger(__name__)


run(app, reloader=True, host='localhost', port=8080, debug=True)

