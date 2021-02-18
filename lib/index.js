const router = require("express").Router();
const mongoose = require("mongoose");

const { generateCRUD } = require("./crud.js");

// you choose from the frontend what you want not from the backend
const createAdminCRUD = () => {
    const mongooseModels = mongoose.modelNames();

    // find a cleaner way of handling relations in mongoose
    mongooseModels.forEach(currentModel => {
        let model = mongoose.model(currentModel);
        generateCRUD(router,currentModel,model);
    })
    return router;
}

module.exports = {
    createAdminCRUD
}
