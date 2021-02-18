const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    userID: { 
        type: String, 
        required: true
    },
    user: { type: mongoose.Types.ObjectId, ref:'user' }
})

module.exports = mongoose.model('book',bookSchema);