import React, { useState } from "react"

import AdminBlock from "./Admin/AdminBlock"
import StudentList from "../pages/Admin/StudentList"

export default (props) => {
    return (
        <AdminBlock
            title={`Danh sách học sinh lớp ${props.userInformation.mainTeacherOfClass}`}
            icon="fas fa-list"
        >
            <StudentList
                classRoom={props.userInformation.mainTeacherOfClass}
                isComponent
                isMainTeacher
            />
        </AdminBlock>
    )
}
