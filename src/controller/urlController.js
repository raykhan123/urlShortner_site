const urlModel = require("../model/urlModel")
const validUrl = require('valid-url')
const shortid = require('shortid')
const redis = require("redis");

const { promisify } = require("util");


const isValid = function(value) {
    if (typeof value === "undefined" || value === null || typeof value === 'number') return false;
    if (typeof value === "string" && value.trim().length === 0) return false;
    return true;
};

const isValidRequestBody = function(requestBody) {
    return Object.keys(requestBody).length == 1;
};

//Connect to redis
const redisClient = redis.createClient(
    18787,
    // "redis-13190.c301.ap-south-1-1.ec2.cloud.redislabs.com",
    "redis-18787.c301.ap-south-1-1.ec2.cloud.redislabs.com", { no_ready_check: true }
);
redisClient.auth("CBouv7eqipQQFOWH0sscDpYsyzRcfLH0", function(err) {
    if (err) throw err;
});

redisClient.on("connect", async function() {
    console.log("Connected to Redis..");
});
//1. connect to the server
//2. use the commands :

//Connection setup for redis

const SET_ASYNC = promisify(redisClient.SETEX).bind(redisClient);
const GET_ASYNC = promisify(redisClient.GET).bind(redisClient);



const createUrl = async function(req, res) {
    try {
        const requestBody = req.body

        if (!isValidRequestBody(requestBody)) {
            return res.status(400).send({ status: false, message: "Please provide data or provide longurl" })
        }
        const longUrl = requestBody.longUrl;

        if (!isValid(longUrl)) {
            return res.status(400).send({ status: false, message: "Please provide a valid longUrl" })
        }

        if (!validUrl.isUri(longUrl)) {
            return res.status(400).send({ status: false, messege: 'Invalid  URL' })
        }
        let cachedUrlData = await GET_ASYNC(`${req.body.longUrl}`)

        if (cachedUrlData) {
            return res.status(200).send({ status: true, message: "Short link (cache) already generated for this url", data: JSON.parse(cachedUrlData) })
        }

        const isAlreadyGen = await urlModel.findOne({ longUrl: longUrl }).select({ longUrl: 1, shortUrl: 1, urlCode: 1, _id: 0 })
            // console.log(isAlreadyGen)
        if (isAlreadyGen) {
            await SET_ASYNC(`${req.body.longUrl}`, 10, JSON.stringify(isAlreadyGen))
            return res.status(400).send({ status: false, message: "Short link already generated for this url", data: isAlreadyGen })
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
        let createdData = await urlModel.findOne(data).select({ longUrl: 1, shortUrl: 1, urlCode: 1, _id: 0 })
        await SET_ASYNC(`${req.body.longUrl}`, 10, JSON.stringify(createdData))
        res.status(201).send({ status: true, data: createdData })


    } catch (error) {
        console.log(error)
        res.status(500).send({ status: false, msg: error.message })
    }
}








const getUrl = async function(req, res) {
    try {
        const urlCode = req.params.urlCode
        let cachedUrlData = await GET_ASYNC(`${req.params.urlCode}`)
        if (cachedUrlData) {

            return res.status(302).redirect(cachedUrlData)
        } else {
            const url = await urlModel.findOne({ urlCode: urlCode })
            if (url) {
                console.log(url)
                await SET_ASYNC(`${req.params.urlCode}`, 10, JSON.stringify(url.longUrl))
                return res.status(302).redirect(url.longUrl)
            } else {

                return res.status(404).send({ status: false, message: 'Short URL not Found' })
            }
        }


    } catch (err) {
        console.error(err)
        res.status(500).send({ status: false, msg: err.message })
    }
}



module.exports.createUrl = createUrl;
module.exports.getUrl = getUrl;
