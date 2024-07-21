import Home from "../pages/Home"
import Profile from "../pages/Profile"
import CreateUser from "../pages/Admin/CreateUser"
import GradeAndClass from "../pages/Admin/GradeAndClass"
import StudentList from "../pages/Admin/StudentList"
import TeacherList from "../pages/Admin/TeacherList"
import CreateHighlight from "../pages/CreateHighlight"
import Transcript from "../pages/Transcript"
import TimeInfo from "../pages/Admin/TimeInfo"
import EditSchedule from "../pages/Admin/EditSchedule"
import Highlight from "../pages/Hightlight"
import StudentOffToday from "../pages/Admin/StudentOffToday"
import ForgetPassword from "../pages/ForgetPassword"
import ResetPassword from "../pages/ResetPassword"
import ConfirmTranscript from "../pages/Teacher/ConfirmTranscript"

export default [
    { path: "/", component: Home },
    { path: "/profile", component: Profile, roles: ["teacher", "parent"] },
    { path: "/user/:role/create", component: CreateUser, roles: ["admin"] },
    { path: "/user/:role/edit/:id", component: CreateUser, roles: "admin" },
    { path: "/gradeAndClass", component: GradeAndClass, roles: ["admin"] },
    { path: "/students", component: StudentList, roles: ["admin", "teacher"] },
    { path: "/teachers", component: TeacherList, roles: ["admin"] },
    { path: "/highlights", component: Highlight },
    { path: "/highlight/edit/:id", component: CreateHighlight },
    { path: "/highlight/create", component: CreateHighlight, roles: ["admin"] },
    {
        path: "/student/transcript/:studentId",
        component: Transcript,
        roles: ["admin", "teacher"],
    },
    {
        path: "/timeInfo",
        component: TimeInfo,
        roles: ["admin"],
    },
    {
        path: "/updateSchedule/:classRoom",
        component: EditSchedule,
        roles: ["admin"],
    },
    {
        path: "/studentOffToday",
        component: StudentOffToday,
        roles: ["admin"],
    },
    {
        path: "/forgetPassword",
        component: ForgetPassword,
    },
    {
        path: "/resetPassword/:secretKey",
        component: ResetPassword,
    },
    {
        path: "/confirmTranscript/:classRoom/",
        component: ConfirmTranscript,
        roles: ["teacher"],
    },
    {
        path: "/confirmTranscript/:classRoom/:subject",
        component: ConfirmTranscript,
        roles: ["teacher"],
    },
]
