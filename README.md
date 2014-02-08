# node Sauto API [![Build Status](https://travis-ci.org/ondrs/node-sauto-api.png?branch=master)](https://travis-ci.org/ondrs/node-sauto-api)

Node.js promise based wrapper over Sauto XML-RPC API.
All methods are implemented with the same name as the original XML-RPC API provides

## How to install
```
npm install sauto-api
```

## Setup

```javascript
var SautoApi = require('sauto-api')

var login = 'import',
  password = 'test',
  config = {
    "connection" : {
      "host": "import.sauto.cz",
        "port": 80,
        "path": "/RPC2"
    },
    "swKey": "testkey-571769"
  };

var api = new SautoApi(config, login, password);
```


## Example usage

```javascript
return api
  .login()
  .then(function() {
    return api.listOfCars()
  })
  .then(function(vehicles) {

    var exportedIds = [];

    vehicles.forEach(function(v) {
      exportedIds.push( parseInt(v.car_id) );
    });

    return selectVehiclesForDelete(exportedIds);
  })
  .then(function(ids) {
    return deleteVehicles(api, ids);
  })
  .then(function() {
    return selectVehiclesForExport();
  })
  .then(function(vehicles) {
    return exportVehicles(api, outputFormatter, vehicles);
  })
  .then(function() {
    return api.logout();
  });
```
