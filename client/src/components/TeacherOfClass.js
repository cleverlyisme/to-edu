import React, { useState, useEffect } from "react"
import { connect } from "react-redux"
import { Link } from "react-router-dom"
import { Table, Row, Col, Label } from "reactstrap"

import { getTeacherOfClass } from "../utils/api/fetchData"
import { subjects } from "../utils/constant"

import ViewModal from "../components/modal/ViewModal"

const TeacherOfClass = ({ classRoom, time, noLabel }) => {
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
        <div className="mb-2">
            {renderModal()}
            <Row>
                <Col md={12}>
                    {!noLabel && (
                        <Label>
                            Danh sách giáo viên lớp {classRoom}{" "}
                            {time.year &&
                                time.semester &&
                                `${time.year}-${time.year + 1} ${
                                    time.semester
                                }`}
                        </Label>
                    )}
                    {data && Object.keys(data).length > 0 && (
                        <Table bordered striped hover size="sm" responsive>
                            <thead>
                                <tr>
                                    {["GVCN", ...subjects].map(
                                        (item, index) => (
                                            <th
                                                key={index}
                                                className="align-top"
                                            >
                                                {item}
                                            </th>
                                        )
                                    )}
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        <Link
                                            onClick={() => {
                                                setCurrentTeacher(
                                                    data.mainTeacher
                                                )
                                                toggle(!isOpen)
                                            }}
                                        >
                                            {data.mainTeacher?.name}
                                        </Link>
                                    </td>
                                    {data.subjectTeacher?.map(
                                        (teacher, index) => (
                                            <td key={index}>
                                                <Link
                                                    onClick={() => {
                                                        setCurrentTeacher(
                                                            teacher
                                                        )
                                                        toggle(!isOpen)
                                                    }}
                                                >
                                                    {teacher?.name}
                                                </Link>
                                            </td>
                                        )
                                    )}
                                </tr>
                            </tbody>
                        </Table>
                    )}
                </Col>
            </Row>
        </div>
    )
}

const mapStateToProps = (state) => ({
    time: state.time,
})

export default connect(mapStateToProps, null)(TeacherOfClass)
