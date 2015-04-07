Mean-stack is a startup-template for anybody who wants to have a head start
developing a MEAN application. Mean-stack is based on:

# [Node](http://nodejs.org/download/) | [Angular](https://angularjs.org/) | [MongoDB](http://www.mongodb.org/downloads) | [Bootstrap](http://getbootstrap.com/2.3.2/)

***

## Quick Start

Here is a quick guide on how to setup your project and get going quickly.

### Workflow

```sh
$ git clone https://github.com/patriques82/Mean-stack.git
$ cd Mean-stack
$ npm -g install grunt-cli bower
$ npm install
$ mongod
$ grunt develop

Code...
Check that everything works...

$ grunt deploy
$ git add <changed/added files>
$ git commit -m "Specific description of work..."
$ git pull
Eventually fix conflicts...
$ git push

Eat and sleep...

$ git pull
$ npm install
$ mongod
$ grunt develop

Code...
Check that everything works...
```

Open `http://localhost:5000` in your browser...

Happy hacking!

### Overall Directory Structure

```
mean-stack/
  |- api/
  |  |- <api logic + database>
  |- node_modules/
  |- public/
  |  |- assets/
  |  |  |- <static files>
  |  |- css/
  |  |  |- <compiled css>
  |  |- js/
  |  |  |- <compiled js>
  |  |- lib/
  |  |  |- <vendor js & css>
  |- src/
  |  |- less/
  |  |  |- main.less
  |  |- modules/
  |  |  |- <app logic>
  |  |- app.js
  |- views/
  |  |- header.ejs
  |  |- footer.ejs
  |  |- index.ejs
  |- bower.json
  |- config.app.js
  |- Gruntfile.js
  |- package.json
  |- server.js
```

- `api/` - backend code. [Read more &raquo;](api/README.md)
- `public` - compiled code which is actually used by index.html
- `src/` - application sources. [Read more &raquo;](src/README.md)
- `views/` - rendered as index.html by express (the entry point of the SPA)
- `public/lib` - third-party libraries. [Bower](http://bower.io) will install
  packages here.
- `bower.json` - this is our project configuration for Bower and it contains the
  list of Bower dependencies we need.
- `Gruntfile.js` - our build script.
- `package.json` - metadata about the app, used by NPM and our build script. Our
   NPM dependencies are listed here.

