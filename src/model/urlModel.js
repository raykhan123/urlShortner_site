const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema({
    urlCode: {
        type: String,
        required: true,
        trim: true,
        unique:true,
        lowercase: true
    },
    longUrl: {
        type: String,
        trim: true,
        valid:true,
        required: true
    },
    shortUrl: {
        type: String,
        unique:true,
        required: true,
    }

}, { timestamps: true });

//........................................Export Schema..................................//
module.exports = mongoose.model("Url", urlSchema); //provides an interface to the database like CRUD operation