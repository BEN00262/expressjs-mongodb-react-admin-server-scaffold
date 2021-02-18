### a simple admin plugin for nodejs expressjs and mongodb to work with react-admin

### works with json server provider from ra-data-json-server
### NOTE: getManyReference is not yet properly implemented 
### NOTE: will be implementing proper handling of reference objects in mongoose later

```javascript
const mongoose = require("mongoose");
const express = require("express");
const cors = require('cors');

const { userModel,bookModel } = require("./models");

require("dotenv").config();

const { createAdminCRUD } = require("../lib"); // import the library
const PORT = process.env.PORT || 3400;

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
        
        app.use('/admin',createAdminCRUD()); // plug it in just like any other middleware

        app.listen(PORT,() => {
            console.log(`Server started at port: ${PORT}`)
        })

    })
    .catch(console.error);
```

### issues

getManyReference of the ra-data-json-server is not yet implemented properly
the library does not handle references well in mongoose still