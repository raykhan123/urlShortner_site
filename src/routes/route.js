const express = require('express');
const router = express.Router()
const controller = require("../controller/urlController")




router.post("/url/shorten",controller.createUrl)

router.get("/:urlCode",controller.getUrl)

router.all('/*', async function(req, res){
    res.status(404).send({status: false, msg: "Page Not Found!!!"})
})


module.exports = router
