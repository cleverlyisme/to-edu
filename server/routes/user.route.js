const express = require("express")
const auth = require("../middlewares/auth")

const { authAdmin, authTeacherStudent, authTeacher } = auth

const router = express.Router()

const controller = require("../controllers/user.controller")

router.get("/getAllUser", authAdmin, controller.getAllUser)

router.delete("/:role/:id", authAdmin, controller.deleteUser)

router.post("/student/create", authAdmin, controller.createStudent)

router.get("/student/:id", controller.getStudent)

router.put("/student/:id", authAdmin, controller.updateStudent)

router.get("/teacher/:id", controller.getTeacher)

router.post("/teacher/create", authAdmin, controller.createTeacher)

router.put("/teacher/:id", authAdmin, controller.updateTeacher)

router.put("/profile/:role/:id", authTeacherStudent, controller.updateProfile)

router.get("/students", authTeacher, controller.teacherGetAllStudent)

router.post("/student/transcript", authTeacher, controller.updateTranscript)

router.post(
    "/student/sendMessageToMainTeacher",
    controller.sendMessageToMainTeacher
)

router.post("/changePassword", controller.changePassword)

router.post("/updateStudentNote", authTeacher, controller.updateStudentNote)

router.post(
    "/finalTranscriptSubject",
    authTeacher,
    controller.finalTransriptSubject
)

router.post("/updateConduct", authTeacher, controller.updateConduct)

router.get("/getSemesterResult", authAdmin, controller.getSemesterResult)

router.post("/upgradeSemester", authAdmin, controller.upgradeSemester)

router.get("/getAllNoMainTeacher", authAdmin, controller.getAllNoMainTeacher)

router.post("/createClassRoom", authAdmin, controller.createClassRoom)

router.post("/deleteClassRoom", authAdmin, controller.deleteClassRoom)

module.exports = router
