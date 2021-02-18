const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    age:{
        type: Number,
        default: 0
    },
    books: [{ type: mongoose.Types.ObjectId, ref:'book' }]
})

module.exports = mongoose.model('user',userSchema);