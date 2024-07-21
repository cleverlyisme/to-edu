const express = require("express")
const auth = require("../middlewares/auth")

const { authAdmin, authAdminTeacher, authTeacher } = auth

const router = express.Router()

const controller = require("../controllers/information.controller")

router.get("/getAllClass", authAdmin, controller.getAllClass)

router.get("/getAllSubject", authAdmin, controller.getAllSubject)

router.get("/schedule/:classRoom", controller.getClassSchedule)

router.get("/transcript/:studentId", controller.getStudentTranscript)

router.get("/teacher/:classRoom", controller.getTeacherOfClass)

router.get(
    "/teacher/schedule/:teacherId",
    authAdminTeacher,
    controller.getTeacherSchedule
)

router.get("/semester", controller.getSemester)

router.post(
    "/createOrUpdateSchedule",
    authAdmin,
    controller.createOrUpdateSchedule
)

router.get("/adminReport", authAdmin, controller.getAdminReport)

router.get("/adminChart", authAdmin, controller.getAdminChart)

router.post("/createOrUpdateEvent", authAdmin, controller.createOrUpdateEvent)

router.get("/event", authAdmin, controller.getEvent)

router.delete("/event/:id", authAdmin, controller.deleteEvent)

router.post("/markoff", authTeacher, controller.markOff)

router.get("/studentOff", authTeacher, controller.teacherGetStudentOff)

router.get(
    "/getClassTranscript/:classRoom/:subject",
    authTeacher,
    controller.getClassTranscript
)

router.get(
    "/getClassTranscript/:classRoom/",
    authTeacher,
    controller.getClassTranscript
)

module.exports = router
