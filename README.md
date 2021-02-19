### a simple admin plugin for nodejs expressjs and mongodb to work with react-admin

### works with json server provider from ra-data-json-server
### NOTE: getManyReference is not yet properly implemented 
### NOTE: will be implementing proper handling of reference objects in mongoose later

```javascript
const mongoose = require("mongoose");
const express = require("express");
const cors = require('cors');

// import your models
const { model1,model2 } = require("< PATH TO YOUR MODELS >");

require("dotenv").config();

const { createAdminCRUD } = require("ra-expressjs-mongodb-scaffold"); // import the library
const PORT = /* SET PORT */

mongoose.connect(process.env.MONGO_URI,{
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(async _ => {
        const app = express();

        app.use(cors());
        app.use(express.json());
        app.use(express.urlencoded({extended:false}));
        
        app.use("< ADMIN URL ENDPOINT e.g. '/admin' >",createAdminCRUD()); // plug it in just like any other middleware

        app.listen(PORT,() => {
            console.log(`Server started at port: ${PORT}`)
        })

    })
    .catch(console.error);
```

```javascript
// react admin configuration
// App.js
import React from 'react';
import { Admin,Resource, ListGuesser,EditGuesser } from 'react-admin';
import jsonServerProvider from 'ra-data-json-server';

const dataProvider = jsonServerProvider('< URL POINTING TO YOUR ADMIN ENDPOINT >');

const App = () => {
  return (
    <Admin dashboard={Dashboard} dataProvider={dataProvider}>
        {/* sample usage with a user resource in the admin */}
      <Resource name="user" list={ListGuesser} edit={EditGuesser}/> 
    </Admin>
  );
}

export default App;
```

### issues

getManyReference of the ra-data-json-server is not yet implemented properly
the library does not handle references well in mongoose still