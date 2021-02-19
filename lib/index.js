const router = require("express").Router();
const mongoose = require("mongoose");

const { generateCRUD } = require("./crud.js");

const createAdminCRUD = () => {
    const mongooseModels = mongoose.modelNames();

    mongooseModels.forEach(currentModel => {
        let model = mongoose.model(currentModel);
        generateCRUD(router,currentModel,model);
    })
    return router;
}

module.exports = {
    createAdminCRUD
}
