const express = require("express")
const auth = require("../middlewares/auth")

const { authAdmin } = auth

const router = express.Router()

const controller = require("../controllers/grade.controller")

router.get("/getAllGrade", authAdmin, controller.getAllGrade)

router.get(
    "/getAllGradeWithMainTeacher",
    authAdmin,
    controller.getAllGradeWithMainTeacher
)

router.get(
    "/getAllClassOfGrade/:grade",
    authAdmin,
    controller.getAllClassOfGrade
)

module.exports = router
