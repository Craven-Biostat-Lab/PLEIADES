PLEIADES Back-end
================================

Documentation still to write
------------------------
- Add a requirements.txt file listing all Python package dependencies.  (I think all we need is python/mongo connector and bottle.)
- Write some documentation about the database



Mongo Database setup
----------------------
Create a db Big_Mechanism

Dump this file into a collection called 'articles':
/ua/ml-group/big-mechanism-project/PLEIADES/Sep2016_SMA/Datums_MongoDB_OpenAccess.json

Like so:
mongoimport --db Big_Mechanism --collection articles --file Datums_MongoDB_OpenAccess.json --maintainInsertionOrder --jsonArray


Create an 2 collections called 'user_edits' and 'user_edits_incremental', where data submissions from the client will be recorded.

(in mongo shell)
```
use Big_Mechanism;
db.createCollection('user_edits');
db.createCollection('user_edits_incremental');
```



Update the database
--------------------------
If you need to update the articles and datums in the database, make sure the structure of the new JSON file is the same as the old file, otherwise you'll have to edit the front-end and back-end code.

To update the articles table:
- In the mongo shell, call "use Big_Mehanism;', and then 'db.articles.drop();'
- From the UNIX shell, run "mongoimport --db Big_Mechanism --collection articles --file <NEW_ARTICLES_FILE_NAME.json> --maintainInsertionOrder --jsonArray"

After updating the database, you may want to empty the tables that collect user input.  To refresh the user data, run this in the mongo shell:
```
use Big_Mechanism;
db.user_edits.drop();
db.user_edits_incremental.drop();
db.createCollection('user_edits');
db.createCollection('user_edits_incremental');
```




Separate front-end repository
-------------------------------
The front-end of this app is in a separate repository, which you can find here:
https://github.com/Craven-Biostat-Lab/PLEIADES-frontend.git

For development, clone the repository into a folder called "PLEIADES-frontend" one level up from Datum_Extraction.py, like so:
# From the root directory of the back-end repository, the same folder with Datum_Extraction.py
git clone https://github.com/Craven-Biostat-Lab/PLEIADES-frontend.git ../PLEIADES-frontend

The bottle server will serve static files from the front-end in debug mode.  

For deployment, you have to set up the static files to be served from the web server.  Put the front-end repository wherever your heart desires.




Installation
-------------------
Here are common steps for both development and deployment.  See the sections below for more specific instructions for each case.

- Clone the front-end and back-end repositories (see above)
```
git clone https://github.com/Craven-Biostat-Lab/PLEIADES-backend
git clone https://github.com/Craven-Biostat-Lab/PLEIADES-frontend
```

- Install node.js and npm (latest version, Ubuntu repository version is too old.).
- CD to the frontend folder, and run "npm install" to install required node.js packages.

- Copy article HTML files into the "articles" folder.  (See below.)




HTML articles
-------------------
The front-end displays HTML articles pulled from PubMed Central, which are loaded as static files into an iframe.

The back-end repository has a folder called "articles" in the root directory, the contents of which are set to be ignored by git.  Copy the articles into this folder.  For the article PMC4055262, the HTML file should be in articles/PMC4055262/PMC4055262.html.  

Look for the HTML articles in this folder:
/ua/ml-group/big-mechanism-project/PLEIADES/Sep2016_SMA/downloaded_articles

(For deployment, the HTML articles can go anywhere, not neccesarily into this directory, as long as the route is set correctly by the web server.  See the 'routes' section below.)



Development server
-----------------
To run the development server, run "python Datum_Extraction.py debug"




Deployment
----------------
Before deployment, CD to the front-end repo and run 'npm run tsc' to compile TypeScript files.  (This is done automatically when using the development server, but not in deployment mode.)

Calls to the back-end API are prefixed with the version number 'api/v01/'.  Direct traffic previxed with 'v1/' to the bottle application.




Updating code on the web server
------------------------------
TODO: Have to finish this section, once we figure out where the application is on the server and how to restart NGINX.

To update code on the server
- Git-pull the front-end
- Git-pull the back-end
- In the folder of the front-end git repository, run 'npm install' in case the dependencies have changed, and run 'npm run tsc' to transpile the front-end code.
- Might possibly have to restart NGINX.




Routes
----------------
In debug mode, static routes are handled by the bottle script.  In deployment, they have to be handled by the webserver.  

- /api/v01     goes to the bottle app.  (Bottle should still see this prefix in the request URL's that it gets.)
- /article-text    serves static files from the 'articles' folder.  (This route is only known to the front-end, the back-end doesn't do anything with it.)
- /    root should serve static files from the root of the front-end
- (catchall) any routes not matching any files in the front-end should serve index.html



Here is the NGINX configuration for the routes, for deployment:
```
 location /api/v01 {
                proxy_pass http://127.0.0.1:8080;
        }
        location /article-text {
                alias /var/www/html/articles;
                try_files $uri  =404;
        }

        location / {
                try_files $uri /index.html;

        }
```



Gotchas
-----------
Because of the way the development virtual machine is set up, the .gitignore file for this repo uses a whitelist instead of a blacklist.  If git is not automatically tracking your new files, this is why.  (No need to scold me about this, Chris, I'm already sufficiently ashamed.)




About the angular2 frontend
---------------------------
When writing code for the front-end, don't modify the .js files in the 'app' folder!  They are automatically generated from the .ts files with the same names, and they will get overwritten.

Take a look at this quickstart and tutorial to learn about angular2:
https://angular.io/docs/ts/latest/quickstart.html
https://angular.io/docs/ts/latest/tutorial/
