import React, { useState, useEffect } from "react"
import { connect } from "react-redux"
import { Table, Row, Col, Button, Label } from "reactstrap"

import setModal from "../../redux/action/setModal"
import getAllGradeWithMainTeacher from "../../redux/action/getAllGradeWithMainTeacher"
import {
    getAllNoMainTeacher,
    createClassRoom,
    deleteClassRoom,
} from "../../utils/api/fetchData"
import renderNoti from "../../utils/renderNoti"
import history from "../../config/history"

import NewTabLink from "../../components/common/NewTabLink"
import BackBtn from "../../components/buttons/BackBtn"
import DeleteBtn from "../../components/buttons/DeleteBtn"
import ViewModal from "../../components/modal/ViewModal"
import Schedule from "../../components/Schedule"
import GradeSelected from "../../components/selecteds/GradeSelected"
import FilterSelected from "../../components/selecteds/FilterSelected"

const btnStyle = {
    cursor: "pointer",
}

function GradeAndClass(props) {
    const [grades, setGrades] = useState([])

    const [isOpen, toggle] = useState(false)
    const [isOpenCreateClass, toggleCreateClass] = useState(false)

    const [currentClass, setCurrentClass] = useState(null)
    const [teacherOptions, setTeacherOptions] = useState([])

    const [grade, setGrade] = useState(null)
    const [teacherId, setTeacherId] = useState(null)

    const [isPhone, setIsPhone] = useState(window.innerWidth <= 768)
    window.addEventListener("resize", () =>
        setIsPhone(window.innerWidth <= 768)
    )

    useEffect(() => {
        getData()
    }, [])

    const getData = () => {
        props
            .getAllGradeWithMainTeacher()
            .then((data) => setGrades(data))
            .catch((err) =>
                renderNoti({
                    type: "danger",
                    title: "Lỗi",
                    message: "Lỗi trong khi lấy dữ liệu",
                })
            )

        getAllNoMainTeacher().then((res) =>
            setTeacherOptions(
                res.data.map((teacher) => ({
                    label: teacher.name,
                    value: teacher._id,
                }))
            )
        )
    }

    const deleteClass = (classRoom) => {
        const removeClass = () =>
            deleteClassRoom({ classRoom })
                .then((res) => {
                    if (res.data.err) throw new Error(res.data.err)

                    renderNoti({
                        type: "success",
                        title: "Thành công",
                        message: "Đã xóa lớp học",
                    })
                    getData()
                })
                .catch((err) => {
                    renderNoti({
                        type: "danger",
                        title: "Lỗi",
                        message: err.message,
                    })
                })

        props.setModal({
            isOpen: true,
            type: "warning",
            message: `Bạn có chắc chắn muốn xóa lớp học này`,
            onConfirm: removeClass,
        })
    }

    const createClass = () => {
        if (!grade || !teacherId) {
            props.setModal({
                isOpen: true,
                type: "danger",
                message: "Vui lòng chọn đầy đủ khối học và giáo viên chủ nhiệm",
            })

            return
        }

        toggleCreateClass(!isOpenCreateClass)

        createClassRoom({ grade, teacherId })
            .then(() => {
                renderNoti({
                    type: "success",
                    title: "Thành công",
                    message: "Đã tạo lớp học",
                })
                getData()
            })
            .catch(() => {
                renderNoti({
                    type: "danger",
                    title: "Lỗi",
                    message: "Lỗi trong khi tạo lớp học",
                })
            })
    }

    const renderModalCreateClass = () => (
        <ViewModal
            isOpen={isOpenCreateClass}
            toggle={() => toggleCreateClass(!isOpenCreateClass)}
            title="Tạo lớp học"
            onConfirm={() => createClass()}
        >
            <Row>
                <Col md={6}>
                    <Label>Chọn khối học</Label>
                    <GradeSelected
                        placeholder="Chọn khối học"
                        onChange={(e) => setGrade(e.value)}
                    />
                </Col>
                <Col md={6}>
                    <Label>Chọn giáo viên chủ nhiệm</Label>
                    <FilterSelected
                        placeholder="Chọn giáo viên"
                        options={teacherOptions}
                        onChange={(e) => setTeacherId(e.value)}
                    />
                </Col>
            </Row>
        </ViewModal>
    )

    const renderScheduleModal = () => (
        <ViewModal
            isOpen={isOpen}
            toggle={() => toggle(!isOpen)}
            title={`Thời khóa biểu lớp ${currentClass}`}
            viewOnly
        >
            <Schedule classRoom={currentClass} />
        </ViewModal>
    )

    return (
        <div>
            {renderScheduleModal()}
            {renderModalCreateClass()}
            <Row className="mb-2">
                <Col md={!isPhone && 8} className="d-flex align-items-start">
                    <h5 className="flex-grow-1">
                        QUẢN LÝ LỚP HỌC{" "}
                        {props.year && `${props.year}-${props.year + 1}`}
                    </h5>
                    {!isPhone && (
                        <>
                            <Button
                                color="success"
                                className="mr-2"
                                onClick={() =>
                                    toggleCreateClass(!isOpenCreateClass)
                                }
                            >
                                Tạo lớp học
                            </Button>
                            <BackBtn
                                title="trang chủ"
                                onClick={() => history.push("/")}
                            />
                        </>
                    )}
                </Col>
                {isPhone && (
                    <Col md={12}>
                        <Button
                            color="success"
                            className="mr-2"
                            onClick={() =>
                                toggleCreateClass(!isOpenCreateClass)
                            }
                        >
                            Tạo lớp học
                        </Button>

                        <BackBtn
                            title="trang chủ"
                            onClick={() => history.push("/")}
                        />
                    </Col>
                )}
            </Row>
            {grades && grades.length > 0 && (
                <Row className="mb-2">
                    <Col md={!isPhone && 8}>
                        <Table bordered responsive>
                            <thead>
                                <tr>
                                    <th>Khối học</th>
                                    <th>Lớp học</th>
                                    <th>Giáo viên chủ nhiệm</th>
                                    <th></th>
                                    <th></th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {grades.map((grade, index) =>
                                    grade.classRoom &&
                                    grade.classRoom.length > 0 ? (
                                        <React.Fragment key={index}>
                                            <tr>
                                                <th
                                                    rowSpan={
                                                        grade.classRoom.length
                                                    }
                                                >
                                                    {grade.grade}
                                                </th>
                                                <td>
                                                    {grade.classRoom[0]?.room}
                                                </td>
                                                <td>
                                                    {grade.classRoom[0] &&
                                                    grade.classRoom[0]
                                                        .mainTeacher ? (
                                                        <NewTabLink
                                                            to={`/user/teacher/edit/${grade.classRoom[0].mainTeacher._id}`}
                                                            title={
                                                                grade
                                                                    .classRoom[0]
                                                                    .mainTeacher
                                                                    .name
                                                            }
                                                        />
                                                    ) : (
                                                        ""
                                                    )}
                                                </td>
                                                <td className="text-center">
                                                    <div
                                                        style={btnStyle}
                                                        title="Xem danh sách học sinh"
                                                        onClick={() =>
                                                            history.push(
                                                                "/students",
                                                                {
                                                                    optionClass:
                                                                        grade
                                                                            .classRoom[0]
                                                                            .room,
                                                                }
                                                            )
                                                        }
                                                    >
                                                        <i className="fas fa-users"></i>
                                                    </div>
                                                </td>
                                                <td className="text-center">
                                                    <div
                                                        style={btnStyle}
                                                        title="Xem thời khóa biểu"
                                                        onClick={() => {
                                                            setCurrentClass(
                                                                grade
                                                                    .classRoom[0]
                                                                    .room
                                                            )
                                                            toggle(!isOpen)
                                                        }}
                                                    >
                                                        <i className="fas fa-calendar-alt"></i>
                                                    </div>
                                                </td>
                                                <td>
                                                    <DeleteBtn
                                                        onClick={() => {
                                                            deleteClass(
                                                                grade
                                                                    .classRoom[0]
                                                                    .room
                                                            )
                                                        }}
                                                    />
                                                </td>
                                            </tr>
                                            {grade.classRoom.map((room, i) =>
                                                i > 0 ? (
                                                    <tr key={i}>
                                                        <td>{room.room}</td>
                                                        <td>
                                                            {room.mainTeacher ? (
                                                                <NewTabLink
                                                                    to={`/user/teacher/edit/${room.mainTeacher._id}`}
                                                                    title={
                                                                        room
                                                                            .mainTeacher
                                                                            .name
                                                                    }
                                                                />
                                                            ) : (
                                                                ""
                                                            )}
                                                        </td>
                                                        <td className="text-center">
                                                            <div
                                                                style={btnStyle}
                                                                title="Xem danh sách học sinh"
                                                                onClick={() =>
                                                                    history.push(
                                                                        "/students",
                                                                        {
                                                                            optionClass:
                                                                                room.room,
                                                                        }
                                                                    )
                                                                }
                                                            >
                                                                <i className="fas fa-users"></i>
                                                            </div>
                                                        </td>
                                                        <td className="text-center">
                                                            <div
                                                                style={btnStyle}
                                                                title="Xem thời khóa biểu"
                                                                onClick={() => {
                                                                    setCurrentClass(
                                                                        room.room
                                                                    )
                                                                    toggle(
                                                                        !isOpen
                                                                    )
                                                                }}
                                                            >
                                                                <i className="fas fa-calendar-alt"></i>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <DeleteBtn
                                                                onClick={() => {
                                                                    deleteClass(
                                                                        room.room
                                                                    )
                                                                }}
                                                            />
                                                        </td>
                                                    </tr>
                                                ) : null
                                            )}
                                        </React.Fragment>
                                    ) : null
                                )}
                            </tbody>
                        </Table>
                    </Col>
                </Row>
            )}
        </div>
    )
}

const mapStateToProps = (state) => ({
    year: state.time.year,
})

const mapDispatchToProps = {
    getAllGradeWithMainTeacher,
    setModal,
}

export default connect(mapStateToProps, mapDispatchToProps)(GradeAndClass)
