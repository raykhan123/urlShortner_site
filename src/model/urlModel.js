const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema({
    urlCode: {
        type: String,
        require: true,
        trim: true,
        lowercase: true
    },
    longUrl: {
        type: String,
        trim: true,
        unique: true
    },
    shortUrl: {
        type: String,
        require: true,
    }

}, { timestamps: true });

//........................................Export Schema..................................//
module.exports = mongoose.model("Url", urlSchema); //provides an interface to the database like CRUD operation