PLEIADES Extracted Datum Browser
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

Create an empty collection called 'user_edits', where data submissions from the client will be recorded.



Installation
-------------------
- Install node.js (latest version, Ubuntu repository version is too old.).
- CD to angular-frontend folder, and run "npm install" to install required node.js packages.
- Copy article HTML files into the "articles" folder.  For the article PMC4055262, the HTML file should be in articles/PMC4055262/PMC4055262.html

Look for articles in this folder:
/ua/ml-group/big-mechanism-project/PLEIADES/Sep2016_SMA/downloaded_articles


Development
-----------------
To run the development server, run "python Datum_Extraction.py debug"


Deployment
----------------
Before deployment, CD to angular-frontend and run 'npm tsc' to compile TypeScript files.  (This is done automatically by the development server.)



About the angular2 frontend
---------------------------
When writing code for the front-end, don't modify the .js files in the 'app' folder!  They are automatically generated from the .ts files with the same names, and they will get overwritten.

Take a look at this quickstart and tutorial to learn about angular2:
https://angular.io/docs/ts/latest/quickstart.html
https://angular.io/docs/ts/latest/tutorial/
