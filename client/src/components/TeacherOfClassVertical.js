import React, { useState, useEffect } from "react"

import { Link } from "react-router-dom"
import { Table, Row, Col, Label } from "reactstrap"

import { getTeacherOfClass } from "../utils/api/fetchData"
import AdminBlock from "./Admin/AdminBlock"
import ViewModal from "./modal/ViewModal"

export default ({ classRoom }) => {
    const [data, setData] = useState({})
    const [isOpen, toggle] = useState(false)
    const [currentTeacher, setCurrentTeacher] = useState({})

    useEffect(() => {
        if (classRoom) {
            getTeacherOfClass(classRoom).then((res) => setData(res.data))
        }
    }, [classRoom])

    const renderModal = () => {
        if (!currentTeacher || Object.keys(currentTeacher).length === 0) {
            return null
        }

        const {
            name,
            yearOfBirth,
            email,
            phoneNumber,
            subject,
        } = currentTeacher

        return (
            <ViewModal
                isOpen={isOpen}
                toggle={() => toggle(!isOpen)}
                title={`${subject} teacher of class ${classRoom}`}
                viewOnly
            >
                <p>Tên: {name || ""}</p>
                <p>Năm sinh: {yearOfBirth || ""}</p>
                <p>Số điện thoại: {phoneNumber || ""}</p>
                <p>Email: {email || ""}</p>
            </ViewModal>
        )
    }
    return (
        <AdminBlock
            title="Danh sách giáo viên"
            icon="fas fa-clipboard-list"
            className="mb-sm-4 mb-md-0"
        >
            {renderModal()}
            {data && Object.keys(data).length > 0 && (
                <Table bordered striped hover size="sm" responsive>
                    <thead>
                        <tr>
                            {["Giáo viên", "Tên giáo viên"].map(
                                (item, index) => (
                                    <th key={index} className="align-top">
                                        {item}
                                    </th>
                                )
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Chủ nhiệm</td>
                            <td>
                                <Link
                                    onClick={() => {
                                        setCurrentTeacher(data.mainTeacher)
                                        toggle(!isOpen)
                                    }}
                                >
                                    {data.mainTeacher?.name}
                                </Link>
                            </td>
                        </tr>
                        {data.subjectTeacher?.map((teacher, index) => (
                            <tr key={index}>
                                <td>{teacher?.subject}</td>
                                <td>
                                    <Link
                                        onClick={() => {
                                            setCurrentTeacher(teacher)
                                            toggle(!isOpen)
                                        }}
                                    >
                                        {teacher?.name}
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </AdminBlock>
    )
}
