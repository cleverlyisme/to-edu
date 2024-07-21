import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Table, Row, Col, Alert, Button, Input } from "reactstrap"
import { connect } from "react-redux"
import moment from "moment"
import history from "../../config/history"

import SearchBox from "../../components/common/SearchBox"
import GradeSelected from "../../components/selecteds/GradeSelected"
import FilterSelected from "../../components/selecteds/FilterSelected"
import CreateBtnBig from "../../components/buttons/CreateBtnBig"
import DeleteBtn from "../../components/buttons/DeleteBtn"
import EditBtn from "../../components/buttons/EditBtn"
import BackBtn from "../../components/buttons/BackBtn"
import NewTabLink from "../../components/common/NewTabLink"
import Pagination from "../../components/common/Pagination"
import ViewModal from "../../components/modal/ViewModal"

import getAllUser from "../../redux/action/getAllUser"
import teacherGetAllStudent from "../../redux/action/teacherGetAllStudent"
import teacherGetStudentOff from "../../redux/action/teacherGetStudentOff"
import updateStudentNote from "../../redux/action/updateStudentNote"
import setModal from "../../redux/action/setModal"
import { deleteUser } from "../../utils/api/fetchData"
import renderNoti from "../../utils/renderNoti"
import { markOffStudent } from "../../utils/api/fetchData"
import subjectName from "../../utils/subjectName"

const StudentList = (props) => {
    const { user } = props
    const { role } = user

    const [searchString, setSearchString] = useState("")
    const [optionClass, setOptionClass] = useState(
        props.location?.state?.optionClass || props.classRoom || ""
    )
    const [optionGrade, setOptionGrade] = useState("")
    const [filterClassStudent, setFilterClassStudent] = useState([])
    const [data, setData] = useState([])

    const [currentPage, setCurrentPage] = useState(1)
    const [totalPage, setTotalPage] = useState(1)
    const [totalUser, setTotalUser] = useState(0)

    const [isOpen, toggle] = useState(false)
    const [parent, setParent] = useState({})

    const [isOpenMarkOff, toggleMarkOff] = useState(false)
    const [student, setStudent] = useState({})
    const [note, setNote] = useState("")
    const [isOpenNote, toggleNote] = useState(false)

    const now = new Date()

    const markOff = async (permission) => {
        try {
            toggleMarkOff(!isOpenMarkOff)

            await markOffStudent({
                studentId: student._id,
                permission,
                day: now.toString(),
            })

            getData()
            props.teacherGetStudentOff()

            renderNoti({
                type: "success",
                title: "Thành công",
                message: "Đã đánh dấu nghỉ học",
            })
        } catch {
            renderNoti({
                type: "danger",
                title: "Lỗi",
                message: "Lỗi trong khi đánh dấu nghỉ học",
            })
        }
    }

    const renderModalMarkOff = () => (
        <ViewModal
            isOpen={isOpenMarkOff}
            toggle={() => {
                toggleMarkOff(!isOpenMarkOff)
            }}
            title="Đánh dấu nghỉ học"
            onConfirm={() => console.log("confirm")}
            noFooter
        >
            <p>
                Đánh dấu học sinh {student.studentName} nghỉ học vào ngày{" "}
                {moment().format("DD/MM/YYYY")}
            </p>
            <div className="text-center">
                <Button
                    color="success"
                    className="mr-2"
                    onClick={() => markOff(true)}
                >
                    Có phép
                </Button>
                <Button color="danger" onClick={() => markOff(false)}>
                    Không phép
                </Button>
            </div>
        </ViewModal>
    )

    const onMarkOff = (student) => {
        const { dayOff } = student

        if (checkMarkOff(dayOff)) {
            setStudent(student)
            toggleMarkOff(!isOpen)
        }
    }

    const checkMarkOff = (dayOff) =>
        dayOff?.every(
            (item) =>
                moment(new Date(item.day)).format("DD/MM/YYYY") !==
                moment().format("DD/MM/YYYY")
        )

    const checkPermissionOff = (dayOff) => {
        const today = dayOff.find(
            (item) =>
                moment(new Date(item.day)).format("DD/MM/YYYY") ===
                moment().format("DD/MM/YYYY")
        )

        return today.permission
    }

    const getData = async () => {
        try {
            const res = await (role === "admin"
                ? props.getAllUser(
                      "student",
                      searchString,
                      optionClass,
                      optionGrade,
                      "",
                      currentPage
                  )
                : props.teacherGetAllStudent(
                      searchString,
                      optionClass,
                      currentPage
                  ))

            setData(res.data)
            setTotalPage(res.totalPage)
            setTotalUser(res.totalUser)
        } catch (err) {
            renderNoti({
                type: "danger",
                title: "Lỗi",
                message: "Lỗi trong khi tải danh sách học sinh",
            })
        }
    }

    const deleteStudent = (id) => {
        deleteUser("student", id)
            .then(() =>
                renderNoti({
                    title: "Thành công",
                    message: "Đã xóa học sinh",
                    type: "success",
                })
            )
            .then(() => getData())
            .catch((err) => {
                renderNoti({
                    type: "danger",
                    title: "Lỗi",
                    message: "Lỗi trong khi xóa học sinh",
                })
            })
    }

    const renderParent = (parent, position) => {
        if (!parent || Object.keys(parent).length === 0) return null
        return (
            <Link onClick={() => setParentInfoToModal(parent, position)}>
                {parent.name}
            </Link>
        )
    }

    useEffect(() => {
        if (role === "teacher") {
            let data = null
            if (user?.teacherOfClass.includes(user?.mainTeacherOfClass)) {
                data = user?.teacherOfClass
            } else {
                data = [...user?.teacherOfClass, user?.mainTeacherOfClass]
            }
            setFilterClassStudent(
                data.map((item) => ({
                    value: item,
                    label: item,
                }))
            )
        }
        getData()
        //eslint-disable-next-line
    }, [optionClass, optionGrade, currentPage])

    const onGradeSelected = (e) => {
        setCurrentPage(1)
        if (e) {
            setOptionGrade(e.value)
            const classArray = e.classRoom.map((item) => ({
                value: item,
                label: item,
            }))
            setFilterClassStudent(classArray)
        } else {
            setOptionGrade("")
            setFilterClassStudent([])
        }
        setOptionClass("")
    }

    const renderModal = () => {
        if (!parent || Object.keys(parent).length === 0) return null

        return (
            <ViewModal
                isOpen={isOpen}
                toggle={() => toggle(!isOpen)}
                title={`Thông tin ${
                    parent.position === "father" ? "bố" : "mẹ"
                }`}
                viewOnly
            >
                <p>Tên: {parent.name || ""}</p>
                <p>Năm sinh: {parent.yearOfBirth || ""}</p>
                <p>Số điện thoại: {parent.phoneNumber || ""}</p>
                <p>Ghi chú: {parent.note || ""}</p>
            </ViewModal>
        )
    }

    const setParentInfoToModal = (parent, position) => {
        setParent({
            position,
            ...parent,
        })
        toggle(true)
    }

    const updateNote = (data) =>
        props
            .updateStudentNote(data)
            .then((res) => {
                if (!res) throw new Error()

                renderNoti({
                    title: "Thành công",
                    message: "Đã cập nhật ghi chú",
                    type: "success",
                })
            })
            .then(() => {
                getData()
                toggleNote(!isOpenNote)
            })
            .catch((err) => {
                renderNoti({
                    type: "danger",
                    title: "Lỗi",
                    message: "Lỗi trong khi cập nhật ghi chú",
                })
            })

    const renderModalNote = () => {
        return (
            <ViewModal
                isOpen={isOpenNote}
                toggle={() => toggleNote(!isOpenNote)}
                title={`Cập nhật ghi chú học sinh ${student.studentName}`}
                onConfirm={() => updateNote({ studentId: student._id, note })}
            >
                <Input
                    type="textarea"
                    rows={7}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                />
            </ViewModal>
        )
    }

    return (
        <div>
            {renderModal()}
            {renderModalMarkOff()}
            {props.isMainTeacher && renderModalNote()}
            {!props.isComponent && (
                <Row className="mb-2">
                    <Col md={7}>
                        <h5>
                            DANH SÁCH HỌC SINH{" "}
                            {props.year && `${props.year}-${props.year + 1}`}
                        </h5>
                    </Col>
                    <Col md={5} className="text-md-right text-md-left">
                        {role === "admin" && (
                            <CreateBtnBig
                                title="học sinh"
                                className="mr-2"
                                onClick={() =>
                                    history.push("/user/student/create")
                                }
                            />
                        )}
                        <BackBtn
                            title="trang chủ"
                            onClick={() => history.push("/")}
                        />
                    </Col>
                </Row>
            )}
            <Row className="mb-2">
                <Col md={6}>
                    <SearchBox
                        onChange={(e) => setSearchString(e.target.value)}
                        onSearch={() => {
                            if (currentPage !== 1) {
                                setCurrentPage(1)
                            } else {
                                getData()
                            }
                        }}
                    />
                </Col>
                {props.isComponent && (
                    <Col md={6} className="text-right">
                        <b>Tổng số học sinh: {totalUser}</b>
                    </Col>
                )}
                {role === "admin" && (
                    <Col md={3}>
                        <GradeSelected
                            isClearable
                            className="mb-2"
                            placeholder="Lọc theo khối"
                            onChange={(e) => onGradeSelected(e)}
                        />
                    </Col>
                )}
                {!props.isComponent && (
                    <>
                        <Col md={3}>
                            <FilterSelected
                                isClearable
                                placeholder="Lọc theo lớp"
                                options={filterClassStudent}
                                onChange={(e) => {
                                    setCurrentPage(1)
                                    if (e) {
                                        setOptionClass(e.value)
                                    } else {
                                        setOptionClass("")
                                    }
                                }}
                                value={
                                    optionClass && {
                                        value: optionClass,
                                        label: optionClass,
                                    }
                                }
                                isDisabled={
                                    role === "admin" &&
                                    filterClassStudent.length === 0
                                }
                            />
                        </Col>
                        {optionClass && optionClass.trim() && (
                            <Col md={3}>
                                <Button
                                    color="success"
                                    onClick={() =>
                                        history.push(
                                            `/confirmTranscript/${optionClass}/${subjectName(
                                                user.subject
                                            )}`
                                        )
                                    }
                                >
                                    Bảng điểm lớp {optionClass}
                                </Button>
                            </Col>
                        )}
                    </>
                )}
            </Row>
            {!props.isComponent && (
                <Row className="mb-2">
                    <Col md={12} className="text-right">
                        <b>Tổng số học sinh: {totalUser}</b>
                    </Col>
                </Row>
            )}
            <Row>
                <Col md={12}>
                    {data && data.length > 0 ? (
                        <Table bordered striped hover size="sm" responsive>
                            <thead>
                                <tr>
                                    <th>Tên</th>
                                    <th>Giới tính</th>

                                    {!props.isComponent && (
                                        <>
                                            <th>Khối</th>
                                            <th>Lớp</th>
                                        </>
                                    )}

                                    <th>Ngày sinh</th>
                                    <th>Bố</th>
                                    <th>Mẹ</th>
                                    <th>Địa chỉ</th>
                                    <th>Ghi chú</th>
                                    {props.isMainTeacher && (
                                        <th>
                                            <div
                                                className="text-center"
                                                style={{ cursor: "pointer" }}
                                                title="Tổng kết điểm"
                                                onClick={() =>
                                                    history.push(
                                                        `/confirmTranscript/${props.classRoom}`
                                                    )
                                                }
                                            >
                                                <i className="fas fa-check text-success" />
                                            </div>
                                        </th>
                                    )}

                                    {(props.isComponent ||
                                        role === "admin") && <th></th>}
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((student, index) => (
                                    <tr key={index}>
                                        <td>
                                            {role === "admin" ? (
                                                <NewTabLink
                                                    title={student.studentName}
                                                    to={`/user/student/edit/${student._id}`}
                                                />
                                            ) : (
                                                student.studentName
                                            )}
                                        </td>
                                        <td>{student.gender ? "Nam" : "Nữ"}</td>

                                        {!props.isComponent && (
                                            <>
                                                <td>{student.grade}</td>
                                                <td>{student.classRoom}</td>
                                            </>
                                        )}

                                        <td>
                                            {moment(student.dateOfBirth).format(
                                                "DD/MM/YYYY"
                                            )}
                                        </td>
                                        <td>
                                            {renderParent(
                                                student.father,
                                                "father"
                                            )}
                                        </td>
                                        <td>
                                            {renderParent(
                                                student.mother,
                                                "mother"
                                            )}
                                        </td>
                                        <td>{student.address}</td>
                                        <td>
                                            {props.isMainTeacher && (
                                                <EditBtn
                                                    title="Cập nhật ghi chú"
                                                    onClick={() => {
                                                        setStudent(student)
                                                        setNote(student.note)
                                                        toggleNote(!isOpenNote)
                                                    }}
                                                />
                                            )}{" "}
                                            {student.note}
                                        </td>
                                        {(props.isMainTeacher ||
                                            role === "admin") && (
                                            <td className="text-center">
                                                {role === "admin" ? (
                                                    <DeleteBtn
                                                        onClick={() => {
                                                            props.setModal({
                                                                isOpen: true,
                                                                message:
                                                                    "Bạn có chắc muốn xóa học sinh này ?",
                                                                type: "warning",
                                                                onConfirm: () =>
                                                                    deleteStudent(
                                                                        student._id
                                                                    ),
                                                            })
                                                        }}
                                                    />
                                                ) : (
                                                    <NewTabLink
                                                        title={
                                                            <div title="Xem bảng điểm">
                                                                <i className="fas fa-table"></i>
                                                            </div>
                                                        }
                                                        to={`/student/transcript/${student._id}`}
                                                    />
                                                )}
                                            </td>
                                        )}

                                        {props.isComponent && (
                                            <td>
                                                <div
                                                    className="text-center"
                                                    title={
                                                        checkMarkOff(
                                                            student.dayOff
                                                        )
                                                            ? "Đánh dấu nghỉ học"
                                                            : checkPermissionOff(
                                                                  student.dayOff
                                                              )
                                                            ? "Nghỉ học có phép"
                                                            : "Nghỉ học không phép"
                                                    }
                                                    onClick={() =>
                                                        onMarkOff(student)
                                                    }
                                                >
                                                    {checkMarkOff(
                                                        student.dayOff
                                                    ) ? (
                                                        <i
                                                            className="far fa-hand-paper"
                                                            style={{
                                                                cursor:
                                                                    "pointer",
                                                            }}
                                                        />
                                                    ) : (
                                                        <i
                                                            className={`fas fa-times text-primary ${
                                                                !checkPermissionOff(
                                                                    student.dayOff
                                                                ) &&
                                                                "text-danger"
                                                            }`}
                                                        />
                                                    )}
                                                </div>
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    ) : (
                        <Alert color="primary">Không có học sinh</Alert>
                    )}
                </Col>
            </Row>
            {data && data.length > 0 && (
                <Pagination
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    totalPage={totalPage}
                />
            )}
        </div>
    )
}

const mapStateToProps = (state) => ({
    year: state.time.year,
    user: state.user.userInformation,
})

const mapDispatchToProps = {
    getAllUser,
    teacherGetAllStudent,
    teacherGetStudentOff,
    setModal,
    updateStudentNote,
}

export default connect(mapStateToProps, mapDispatchToProps)(StudentList)
