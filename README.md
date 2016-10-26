PLEIADES Extracted Datum Browser
================================

Documentation still to write
------------------------
- Add a requirements.txt file listing all Python package dependencies.
- Write some documentation about the database



Installation
-------------------
- Install node.js (latest version, Ubuntu repository version is too old.).
- CD to angular-frontend folder, and run "npm install" to install required node.js packages.
- Copy article HTML files into the "articles" folder.  For the article PMC4055262, the HTML file should be in articles/PMC4055262/PMC4055262.html


About the angular2 frontend
---------------------------
When writing code for the front-end, don't modify the .js files in the 'app' folder!  They are automatically generated from the .ts files with the same names, and they will get overwritten.

Take a look at this quickstart and tutorial to learn about angular2:
https://angular.io/docs/ts/latest/quickstart.html
https://angular.io/docs/ts/latest/tutorial/
