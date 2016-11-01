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
use Big_Mechanism;
db.createCollection('user_edits');
db.createCollection('user_edits_incremental');



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
- Clone the front-end repository (see above)
- Install node.js (latest version, Ubuntu repository version is too old.).
- CD to the frontend folder, and run "npm install" to install required node.js packages.
- Copy article HTML files into the "articles" folder.  For the article PMC4055262, the HTML file should be in articles/PMC4055262/PMC4055262.html.  (For deployment, the HTML articles can go anywhere, not neccesarily into this directory, as long as the route is set correctly by the web server.  See the 'routes' section below.)

Look for articles in this folder:
/ua/ml-group/big-mechanism-project/PLEIADES/Sep2016_SMA/downloaded_articles




Development
-----------------
To run the development server, run "python Datum_Extraction.py debug"



Deployment
----------------
Before deployment, CD to the front-end repo and run 'npm tsc' to compile TypeScript files.  (This is done automatically by the development server.)

Calls to the back-end API are prefixed with the version number 'v1/'.  Direct traffic previxed with 'v1/' to the bottle application.



Routes
----------------
In debug mode, static routes are handled by the bottle script.  In deployment, they have to be handled by the webserver.  

/v1     goes to the bottle app
/article-text    serves static files from the 'articles' folder.  (This route is only known to the front-end, the back-end doesn't do anything with it.)
/    root should serve static files from the root of the front-end
(catchall) any routes not matching any files in the front-end should serve index.html



Gotchas
-----------
Because of the way the development virtual machine is set up, the .gitignore file for this repo uses a whitelist instead of a blacklist.  If git is not automatically tracking your new files, this is why.  (No need to scold me about this, Chris, I'm already sufficiently ashamed.)




About the angular2 frontend
---------------------------
When writing code for the front-end, don't modify the .js files in the 'app' folder!  They are automatically generated from the .ts files with the same names, and they will get overwritten.

Take a look at this quickstart and tutorial to learn about angular2:
https://angular.io/docs/ts/latest/quickstart.html
https://angular.io/docs/ts/latest/tutorial/
