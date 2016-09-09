# ScratchX extensions

Develop ScratchX extensions for courses and lab @NCTU.  
This branch contains ScratchX extension javascript files and some examples ScratchX project.
If you look for websocket server to serve ScratchX extension, go to [master branch](https://github.com/sunset1995/ScratchX-ext).  


## Extensions
- [DA](extensions/iottalkDA-scratch.js) (non stable)
- [chatroom](extensions/chatroom.js)


## Build

### Prerequirement
* Make sure [Node.js](https://nodejs.org/en/) and [npm](https://www.npmjs.com/)(nodejs package manager)  are installed
* Update nodejs and npm version. [reference here](https://nodejs.org/en/download/package-manager/)
* Type `npm install --save` to install dependency package
* Type `npm install -g gulp` to install gulp to global


### Directory & Code
* All extension source codes are under `src/`
* File in `src/__*` format won't be directly built
* Source code will be built to `extensions/`

Souce code are built with preprocessor: 
* [browserify](http://browserify.org/) 
* [babel](https://babeljs.io/) with [ES2015](https://github.com/lukehoban/es6features#readme)


### How to Build
Under the project top directory, type `gulp` or `gulp debug`.
