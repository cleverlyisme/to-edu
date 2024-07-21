const express = require("express")

const router = express.Router()

const controller = require("../controllers/logIn.controller")

router.post("/", controller.logIn)

router.get("/getUserInformation", controller.getUserInformation)

router.get(
    "/getUserInformationAndNewAccessToken",
    controller.getUserInformationAndNewAccessToken
)
router.post("/forgetPassword", controller.forgetPassword)

router.post("/resetPassword", controller.resetPassword)

module.exports = router
