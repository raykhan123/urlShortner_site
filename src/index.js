const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const route = require('./route/route')
const validUrl = require('valid-url');
const ids = require('short-id');

const app = express()
app.use(bodyParser.json())


mongoose.connect("mongodb+srv://chetan1297:9JBxn4iQEY3rMnB@cluster0.gi2f1j9.mongodb.net/group27Database?retryWrites=true&w=majority", {
        useNewUrlParser: true
    })
    .then(() => console.log("mongoDB is connected"))
    .catch((error) => console.log(error))


app.use('/', route)

app.listen(process.env.PORT || 3000, function() {
    console.log("express app is running on PORT " + (process.env.PORT || 3000))
});