import React, { useState, useEffect } from "react"
import { connect } from "react-redux"
import { Row, Col, Button, Input, Label, Table } from "reactstrap"

import history from "../../config/history"
import getSemesterResult from "../../redux/action/getSemesterResult"
import upgradeSemester from "../../redux/action/upgradeSemester"
import ViewModal from "../../components/modal/ViewModal"
import Feedback from "../../components/common/Feedback"

import renderNoti from "../../utils/renderNoti"

const TimeInfo = ({ time, getSemesterResult, upgradeSemester }) => {
    const [data, setData] = useState(null)
    const [isDone, setDone] = useState(false)

    const isOverYear = time.semester === 2

    useEffect(() => {
        getSemesterResult()
            .then((data) => {
                setData(
                    data.filter(
                        (item) => item.classRooms && item.classRooms.length > 0
                    )
                )
                if (
                    data.every((grade) =>
                        grade.classRooms.every((classRoom) => classRoom.isDone)
                    )
                ) {
                    setDone(true)
                }
            })
            .catch((err) =>
                renderNoti({
                    type: "danger",
                    title: "Lỗi",
                    message: "Lỗi trong khi tải kết quả học tập",
                })
            )
    }, [])

    const [isOpen, toggle] = useState(false)
    const [password, setPassword] = useState("")
    const [checkPassword, setCheckPassword] = useState(false)

    const upgrade = () => {
        setCheckPassword(true)
        if (password && password.trim() && password.length >= 8) {
            upgradeSemester({ password })
                .then((data) => {
                    if (!data) throw new Error("Lỗi trong khi cập nhật học kỳ")
                    renderNoti({
                        type: "success",
                        title: "Thông báo",
                        message: data,
                    })
                    toggle(!isOpen)
                    localStorage.removeItem("access_token")
                    history.push("/updating")
                })
                .catch((err) =>
                    renderNoti({
                        type: "danger",
                        title: "Lỗi",
                        message: err.message,
                    })
                )
        }
    }

    const renderModal = () => {
        return (
            <ViewModal
                isOpen={isOpen}
                toggle={() => toggle(!isOpen)}
                title="Xác nhận hoàn thành năm học"
                onConfirm={upgrade}
            >
                <p className="text-danger">
                    Sau khi xác nhận dữ liệu sẽ không thể phục hồi.
                </p>
                <Label>Điền mật khẩu để tiếp tục</Label>
                <Input
                    type="password"
                    placeholder="Mật khẩu"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onBlur={() => setCheckPassword(true)}
                    style={{
                        border:
                            checkPassword && !password.trim()
                                ? "1px solid #dc3545"
                                : "",
                    }}
                    minLength={8}
                />
                {checkPassword && !password.trim() && (
                    <Feedback>Mật khẩu không được bỏ trống</Feedback>
                )}
            </ViewModal>
        )
    }

    return (
        <>
            <Row className="mb-2">
                {renderModal()}
                <Col md={12}>
                    <h5>THÔNG TIN NĂM HỌC</h5>
                </Col>
                <Col md={12}>
                    <b>Năm học hiện tại: {`${time?.year}-${time?.year + 1}`}</b>
                </Col>
                <Col md={12}>
                    <b>Học kỳ hiện tại: {time?.semester}</b>
                </Col>
            </Row>
            {data && data.length > 0 && (
                <Row className="mb-2">
                    <Col md={10}>
                        <Table bordered responsive>
                            <thead>
                                <tr>
                                    <th className="align-top">Khối học</th>
                                    <th className="align-top">Lớp học</th>
                                    <th className="align-top">
                                        Tổng số học sinh
                                    </th>
                                    <th className="align-top">
                                        Học sinh giỏi
                                        {isOverYear && (
                                            <p className="mb-0">
                                                (học kỳ 2/cả năm)
                                            </p>
                                        )}
                                    </th>
                                    <th className="align-top">
                                        Học sinh tiên tiến{" "}
                                        {isOverYear && (
                                            <p className="mb-0">
                                                (học kỳ 2/cả năm)
                                            </p>
                                        )}
                                    </th>
                                    <th className="align-top">
                                        Học sinh trung bình{" "}
                                        {isOverYear && (
                                            <p className="mb-0">
                                                (học kỳ 2/cả năm)
                                            </p>
                                        )}
                                    </th>
                                    <th className="align-top">
                                        Học sinh yếu{" "}
                                        {isOverYear && (
                                            <p className="mb-0">
                                                (học kỳ 2/cả năm)
                                            </p>
                                        )}
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {data &&
                                    data.map((grade, index) => (
                                        <React.Fragment key={index}>
                                            <tr>
                                                <th
                                                    rowSpan={
                                                        grade.classRooms.length
                                                    }
                                                >
                                                    {grade.grade}
                                                </th>
                                                <td>
                                                    {
                                                        grade.classRooms[0]
                                                            .classRoom
                                                    }
                                                </td>
                                                <td>
                                                    {
                                                        grade.classRooms[0]
                                                            .numberOfStudent
                                                    }
                                                </td>
                                                {grade.classRooms[0].isDone ? (
                                                    <>
                                                        <td>
                                                            {`${
                                                                grade
                                                                    .classRooms[0]
                                                                    .goodStudents
                                                                    .length
                                                            } ${
                                                                isOverYear
                                                                    ? `/${grade.classRooms[0].totalGoodStudents.length}`
                                                                    : ""
                                                            }`}
                                                        </td>
                                                        <td>
                                                            {`${
                                                                grade
                                                                    .classRooms[0]
                                                                    .mediumStudents
                                                                    .length
                                                            } ${
                                                                isOverYear
                                                                    ? `/${grade.classRooms[0].totalMediumStudents.length}`
                                                                    : ""
                                                            }`}
                                                        </td>
                                                        <td>
                                                            {`${
                                                                grade
                                                                    .classRooms[0]
                                                                    .badStudents
                                                                    .length
                                                            } ${
                                                                isOverYear
                                                                    ? `/${grade.classRooms[0].totalBadStudents.length}`
                                                                    : ""
                                                            }`}
                                                        </td>
                                                        <td>
                                                            {`${
                                                                grade
                                                                    .classRooms[0]
                                                                    .veryBadStudents
                                                                    .length
                                                            } ${
                                                                isOverYear
                                                                    ? `/${grade.classRooms[0].totalVeryBadStudents.length}`
                                                                    : ""
                                                            }`}
                                                        </td>
                                                    </>
                                                ) : (
                                                    <td colSpan={4}>
                                                        Chưa tổng kết
                                                    </td>
                                                )}
                                            </tr>
                                            {grade.classRooms.map(
                                                (classRoom, i) =>
                                                    i > 0 ? (
                                                        <tr key={i}>
                                                            <td>
                                                                {
                                                                    classRoom.classRoom
                                                                }
                                                            </td>
                                                            <td>
                                                                {
                                                                    classRoom.numberOfStudent
                                                                }
                                                            </td>
                                                            {classRoom.isDone ? (
                                                                <>
                                                                    <td>
                                                                        {`
                                                                           ${
                                                                               classRoom
                                                                                   .goodStudents
                                                                                   .length
                                                                           } ${
                                                                            isOverYear
                                                                                ? `/${classRoom.totalGoodStudents.length}`
                                                                                : ""
                                                                        }`}
                                                                    </td>
                                                                    <td>
                                                                        {`
                                                                           ${
                                                                               classRoom
                                                                                   .mediumStudents
                                                                                   .length
                                                                           } ${
                                                                            isOverYear
                                                                                ? `/${classRoom.totalMediumStudents.length}`
                                                                                : ""
                                                                        }`}
                                                                    </td>
                                                                    <td>
                                                                        {`
                                                                           ${
                                                                               classRoom
                                                                                   .badStudents
                                                                                   .length
                                                                           } ${
                                                                            isOverYear
                                                                                ? `/${classRoom.totalBadStudents.length}`
                                                                                : ""
                                                                        }`}
                                                                    </td>
                                                                    <td>
                                                                        {`
                                                                           ${
                                                                               classRoom
                                                                                   .veryBadStudents
                                                                                   .length
                                                                           } ${
                                                                            isOverYear
                                                                                ? `/${classRoom.totalVeryBadStudents.length}`
                                                                                : ""
                                                                        }`}
                                                                    </td>
                                                                </>
                                                            ) : (
                                                                <td colSpan={4}>
                                                                    Chưa tổng
                                                                    kết
                                                                </td>
                                                            )}
                                                        </tr>
                                                    ) : null
                                            )}
                                        </React.Fragment>
                                    ))}
                            </tbody>
                        </Table>
                    </Col>
                </Row>
            )}
            {isDone && (
                <Row>
                    <Col md={12}>
                        <Button color="primary" onClick={() => toggle(!isOpen)}>
                            Hoàn thành
                        </Button>
                    </Col>
                </Row>
            )}
        </>
    )
}

const mapStateToProps = (state) => ({
    time: state.time,
})

const mapDispatchToProps = {
    getSemesterResult,
    upgradeSemester,
}

export default connect(mapStateToProps, mapDispatchToProps)(TimeInfo)
