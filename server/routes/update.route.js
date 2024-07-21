const express = require("express")

const router = express.Router()

const controller = require("../controllers/update.controller")

router.get("/", controller.getUpdateStatus)

module.exports = router
