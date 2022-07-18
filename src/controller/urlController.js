const urlModel = require("../model/urlModel")
const validUrl = require('valid-url')
const shortid = require('shortid')

const isValid = function (value) {
    if (typeof value === "undefined" || value === null) return false;
    if (typeof value === "string" && value.trim().length === 0) return false;
    return true;
};

const isValidRequestBody = function (requestBody) {
    return Object.keys(requestBody).length == 1;
};

const createUrl = async function (req, res) {
    try {
        const requestBody = req.body
        
        if (!isValidRequestBody(requestBody)) {
            return res.status(400).send({ status: false, message: "Please provide data or provide longurl" })
        }
        const longUrl = requestBody.longUrl;

        if (!isValid(longUrl)) {
            return res.status(400).send({ status: false, message: "Please provide longUrl" })
        }

        if (!validUrl.isUri(longUrl)) {
            return res.status(400).send({ status: false, messege: 'Invalid  URL' })
        }

        const isAlreadyGen = await urlModel.findOne({longUrl:longUrl}).select({longUrl:1,shortUrl:1,urlCode:1,_id:0})
       // console.log(isAlreadyGen)
        if(isAlreadyGen){
            return res.status(400).send({status:true,message:"Short link already generated for this url",data:isAlreadyGen})
        }

            const baseUrl = 'http://localhost:3000'
            let urlCode = shortid.generate(longUrl)
    
            let checkUrlCode = await urlModel.findOne({ urlCode: urlCode });
            if (checkUrlCode) {
                return res.status(400)
                    .send({
                        status: false,
                        message: `URL data already generated`,
                    })
            }

            let requiredUrl = baseUrl + "/" + urlCode
            obj = {
                longUrl: longUrl,
                urlCode: urlCode,
                shortUrl: requiredUrl
            }
            let data = await urlModel.create(obj)
            let createdData = await urlModel.findOne({data:data}).select({longUrl:1,shortUrl:1,urlCode:1,_id:0})
            res.status(200).send({ status:true,data: createdData })


        } catch (error) {
            console.log(error)
            res.status(500).send({ status: false, msg: error.message })
        }
    }


     const getUrl = async function(req,res){
        try {
          const  urlCode= req.params.urlCode
            const url = await urlModel.findOne({urlCode:urlCode})
            if (url) {

                return res.status(302).send({status:true}).redirect(url.longUrl)
            } else {

                return res.status(404).send({status:false,message:'No URL Found'})
            }
    
        
        }catch (err) {
            console.error(err)
            res.status(500).send({ status: false, msg: error.message })
        }


     
    }
module.exports.createUrl = createUrl;
module.exports.getUrl = getUrl;