const urlModel = require("../model/urlModel")
const validUrl = require('valid-url')
const shortid = require('shortid')

const createUrl = async function (req, res) {
    try {

        const requestBody = req.body
        const longURL = requestBody.longUrl;
        if(!longURL){return res.status(400).send({msg:"plz provide the Url"})}
        if(checkingUrl){return res.status(400).send({msg:"already exist",data:checkingUrl})}
        const baseUrl = 'http://localhost:3000'
        let urlCode = shortid.generate(longURL)
       let  requiredUrl= baseUrl+"/"+urlCode 
       obj={
        LongURL:longURL,
        urlCode:urlCode,
        shortUrl:requiredUrl
       }
       res.status(200).send({data:obj})
      

    } catch (error) {
        console.log(error)
        res.status(500).send({ status: false, msg: error.message })
    }
}
module.exports.createUrl = createUrl;