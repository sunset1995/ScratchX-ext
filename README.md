# ScratchX extension experiment

Search ScratchX extension for course snp in NCTU.


## Before start
* Make sure [Node.js](https://nodejs.org/en/) and [npm](https://www.npmjs.com/)(nodejs package manager)  are installed
* Update nodejs and npm version. [reference here](https://nodejs.org/en/download/package-manager/)
* Type `npm install --save` to install dependency package
* Type `npm install -g gulp` to install gulp to global


## Directory & Code
* All source code are inside `src/*.js`
* All subdirectory under `src/` or filename start with `__` won't be built.
* The ScratchX extention are built to `extensions/`

Souce code are built with preprocessor: 
* [browserify](http://browserify.org/) 
* [babel](https://babeljs.io/) with [ES2015](https://github.com/lukehoban/es6features#readme)


## Build
Under the project top directory, type `gulp` or `gulp debug`.
