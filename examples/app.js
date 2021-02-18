const mongoose = require("mongoose");
const express = require("express");
const cors = require('cors');

const { userModel,bookModel } = require("./models");

require("dotenv").config();

const { createAdminCRUD } = require("../lib");
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
        
        app.use('/admin',createAdminCRUD());

        app.listen(PORT,() => {
            console.log(`Server started at port: ${PORT}`)
        })

    })
    .catch(console.error);