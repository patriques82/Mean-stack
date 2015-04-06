### Overview

The Single-Page-Application. Here lies the main application structure. During
compilation the contents of this directory is compiled to `mean-stack/public/js/main.js`

### Overall Directory Structure

```
src/
  |- common/
  |  |- services/
  |  |- directives/
  |  |- common.js
  |- less/
  |  |- main.less
  |- modules/
  |  |- <module>/
  |  |  |- services/
  |  |  |- controllers/
  |  |  |- directives/
  |  |  |- partials/
  |  |  |- <module>.js
  |  |  |- <module>.less
  |- app.js
  |- templates.js
```

- `common/` - shared services and directives through the angular app. The entry
  point is the common.js file.
- `less/` - main less file. This file should only hold `import` statements.
- `modules` - modules for all aspects, logic units and parts of the angular app.
  Each module can has its own separation of concerns. The entry point for each
  module is its `<module>.js` file in the root of the module folder.
- `app.js` - main app file. This file inlcudes all entry points for each module
  and common services and directives.
- `templates.js` - holds the html compiled too javascript.
