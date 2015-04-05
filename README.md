Mean-stack is a startup-template for anybody who wants to have a head start
developing a MEAN application. Mean-stack is based on:

# [Node](http://nodejs.org/download/) | [Angular](https://angularjs.org/) | [MongoDB](http://www.mongodb.org/downloads) | [Bootstrap](http://getbootstrap.com/2.3.2/)

***

## Quick Start

Här följer en beskrivning av arbetssätt med projektet och en snabb genomgång av
strukturen i projektet. Det är särskilt viktigt att arbetssättet följs för att
allt ska fungera.

### Workflow

```sh
$ git clone https://pnygren@bitbucket.org/pnygren/oviu.git
$ cd oviu
$ npm -g install grunt-cli bower
$ npm install
$ grunt develop

Koda...
Kolla att allt fungerar...

$ grunt deploy
$ git add <changed/added files>
$ git commit -m "Specific description of work..."
$ git pull
Eventuellt fixa konflikter och committa dessa...
$ git push

Ät och vila...

$ git pull
$ grunt develop

Koda..
Kolla att allt fungerar, osv...
```

Öppna `http://localhost:5000` i din browser...

Happy hacking!

### Overall Directory Structure

```
oviu/
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
  |  |- index.ejs
  |- .bowerrc
  |- bower.json
  |- config.app.js
  |- Gruntfile.js
  |- package.json
  |- post_install.sh
  |- Procfile
  |- server.js
```

- `src/` - application sources. [Read more &raquo;](src/README.md)
- `views/index.ejs` - rendered as index.html by express (the entry point of app)
- `public` - compiled code which is actually used in index.html
- `public/lib` - third-party libraries. [Bower](http://bower.io) will install
  packages here. Anything added to this directory will need to be manually added
  to `build.config.js` and `karma/karma-unit.js` to be picked up by the build
  system.
- `.bowerrc` - the Bower configuration file. This tells Bower to install
  components into the `vendor/` directory.
- `bower.json` - this is our project configuration for Bower and it contains the
  list of Bower dependencies we need.
- `build.config.js` - our customizable build settings; see "The Build System"
  below.
- `Gruntfile.js` - our build script; see "The Build System" below.
- `package.json` - metadata about the app, used by NPM and our build script. Our
  NPM dependencies are listed here.

