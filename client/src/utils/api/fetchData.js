import request from "./request"

const renderParams = (root, params) => {
    if (!params) {
        return root
    }

    let url = `${root}/?`

    for (let key of Object.keys(params)) {
        url += `${key}=${params[key]}&`
    }

    return url
}

export const getAllUser = (
    role,
    searchString = "",
    filterClass = "",
    filterGrade = "",
    filterSubject = "",
    currentPage = 0
) =>
    request.get(
        renderParams("user/getAllUser", {
            role,
            searchString,
            filterClass,
            filterGrade,
            filterSubject,
            currentPage,
        })
    )

export const teacherGetAllStudent = (
    searchString = "",
    filterClass = "",
    currentPage = 0
) =>
    request.get(
        renderParams("user/students", {
            searchString,
            filterClass,
            currentPage,
        })
    )

export const getAllClass = () => request.get("information/getAllClass")

export const getAllSubject = () => request.get("information/getAllSubject")

export const deleteUser = (role, id) => request.delete(`user/${role}/${id}`)

export const getStudentData = (id) => request.get(`user/student/${id}`)

export const getTeacherData = (id) => request.get(`user/teacher/${id}`)

export const createStudent = (data) => request.post("user/student/create", data)

export const createTeacher = (data) => request.post("user/teacher/create", data)

export const updateTeacher = (data, id) =>
    request.put(`user/teacher/${id}`, data)

export const updateStudent = (data, id) =>
    request.put(`user/student/${id}`, data)

export const updateProfile = (data, id, role) =>
    request.put(`user/profile/${role}/${id}`, data)

export const getAllClassOfGrade = (grade) =>
    request.get(`grade/getAllClassOfGrade/${grade}`)

export const getAllGrade = () => request.get("grade/getAllGrade")

export const getAllGradeWithMainTeacher = () =>
    request.get("grade/getAllGradeWithMainTeacher")

export const getAllHighlight = (searchString = "", currentPage = 0) =>
    request.get(
        renderParams("highlight", {
            searchString,
            currentPage,
        })
    )

export const getLastestHighlight = () =>
    request.get("highlight/lastestHighlight")

export const deleteHighlight = (id) => request.delete(`highlight/${id}`)

export const getHighlight = (id) => request.get(`highlight/${id}`)

export const createOrUpdateHighlight = (data) =>
    request.post(`highlight/create-update`, data)

export const getClassSchedule = (classRoom) =>
    request.get(`information/schedule/${classRoom}`)

export const getStudentTranscript = (studentId) =>
    request.get(`information/transcript/${studentId}`)

export const getTeacherOfClass = (classRoom) =>
    request.get(`information/teacher/${classRoom}`)

export const getTeacherSchedule = (teacherId) =>
    request.get(`information/teacher/schedule/${teacherId}`)

export const getSemester = () => request.get("information/semester")

export const updateTranscript = (data) =>
    request.post("user/student/transcript", data)

export const createOrUpdateSchedule = (data) =>
    request.post("information/createOrUpdateSchedule", data)

export const getAdminReport = () => request.get("information/adminReport")

export const getAdminChart = () => request.get("information/adminChart")

export const createOrUpdateEvent = (data) =>
    request.post("information/createOrUpdateEvent", data)

export const getEvent = () => request.get("information/event")

export const deleteEvent = (id) => request.delete(`information/event/${id}`)

export const markOffStudent = (data) =>
    request.post("information/markoff", data)

export const teacherGetStudentOff = () => request.get("information/studentOff")

export const sendMessageToMainTeacher = (data) =>
    request.post("user/student/sendMessageToMainTeacher", data)

export const forgetPassword = (data) =>
    request.post("login/forgetPassword", data)

export const resetPassword = (data) => request.post("login/resetPassword", data)

export const changePassword = (data) =>
    request.post("user/changePassword", data)

export const updateStudentNote = (data) =>
    request.post("user/updateStudentNote", data)

export const getClassTranscript = ({ classRoom, subject }) =>
    request.get(`information/getClassTranscript/${classRoom}/${subject || ""}`)

export const finalMark = (data) =>
    request.post("/user/finalTranscriptSubject", data)

export const updateConduct = (data) => request.post("user/updateConduct", data)

export const getSemesterResult = () => request.get("user/getSemesterResult")

export const upgradeSemester = (data) =>
    request.post("user/upgradeSemester", data)

export const checkUpdateStatus = () => request.get("updateStatus")

export const getAllNoMainTeacher = () => request.get("user/getAllNoMainTeacher")

export const createClassRoom = (data) =>
    request.post("user/createClassRoom", data)

export const deleteClassRoom = (data) =>
    request.post("user/deleteClassRoom", data)
