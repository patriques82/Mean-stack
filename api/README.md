### Overview

API code. Here is where we put the database logic and the router. This code
could obviously be replaced by any REST-backend that you prefer, and only small
modifications need to be made in `server.js` to detach the client completely.

### Overall Directory Structure

```
api/
  |- controllers/
  |  |- <resource controller>
  |- models/
  |  |- <database schemas>
  |- config.backend.js
  |- routes.js
```

- `controllers/` - controllers for each database resource and logic unit.
- `models/` - schemas for each database resource.
- `config.backend.js` - configuration of backend.
- `routes.js` - public and private (restricted) routes for api. All routes are
  handled by a specific controller and controllermethod
