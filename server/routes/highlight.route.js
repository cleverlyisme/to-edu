const express = require("express")

const { authAdmin } = require("../middlewares/auth")

const router = express.Router()

const controller = require("../controllers/highlight.controller")

router.get("/", controller.getAllHighlight)

router.get("/lastestHighlight", controller.getLastestHighlight)

router.get("/:id", controller.getHighlight)

router.delete("/:id", authAdmin, controller.deleteHighlight)

router.post("/create-update", authAdmin, controller.createOrUpdateHighlight)

module.exports = router
