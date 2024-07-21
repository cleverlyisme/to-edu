import React, { useState, useEffect } from "react"
import { connect } from "react-redux"
import { Row, Col, Table, Button } from "reactstrap"
import _ from "lodash"

import history from "../../config/history"
import ViewModal from "../../components/modal/ViewModal"
import BackBtn from "../../components/buttons/BackBtn"
import EditBtn from "../../components/buttons/EditBtn"
import FilterSelected from "../../components/selecteds/FilterSelected"
import getClassTranscript from "../../redux/action/getClassTranscript"
import studentName from "../../utils/subjectName"
import renderNoti from "../../utils/renderNoti"
import {
    updateTranscript,
    finalMark,
    updateConduct,
} from "../../utils/api/fetchData"
import subjectName from "../../utils/subjectName"

const conductOptions = [
    { value: "Tốt", label: "Tốt" },
    { value: "Khá", label: "Khá" },
    { value: "Trung bình", label: "Trung bình" },
    { value: "Yếu", label: "Yếu" },
]

const ConfirmTranscript = (props) => {
    const {
        match: {
            params: { classRoom, subject },
        },
    } = props

    const [data, setData] = useState([])
    const [isOverSubject, setOverSubject] = useState(false)
    const [isOverScore, setOverScore] = useState(false)
    const [isOverYear, setOverYear] = useState(false)

    const [currentScore, setCurrentScore] = useState({})
    const [isOpen, toggle] = useState(false)

    const [isOpenFinal, toggleFinal] = useState(false)

    const [isOpenConduct, toggleConduct] = useState(false)

    const [student, setStudent] = useState({})
    const [conduct, setConduct] = useState(null)

    useEffect(() => {
        getData()
    }, [])

    const getData = () => {
        props.getClassTranscript({ classRoom, subject }).then((data) => {
            setData(data)
            if (
                subject &&
                data[0].score.medium &&
                data[0].score.medium !== -1
            ) {
                setOverSubject(true)
            }

            if (!subject && data[0].finalScore && data[0].finalScore !== -1) {
                setOverScore(true)
            }

            if (data[0].totalScore && data[0].totalScore !== -1) {
                setOverYear(true)
            }
        })
    }

    const editTranscript = (x, index, e) => {
        const { value } = e.target
        if (Number(value) < 0 || Number(value) > 10) {
            e.target.value = e.target.value.slice(0, -1)
            return
        }

        const transcript = _.cloneDeep(currentScore)
        transcript[x][index] = value.trim() ? Number(value) : -1

        setCurrentScore(transcript)
    }

    const updateStudentTranscript = async () => {
        // send request to api to update transcript of this student
        try {
            toggle(!isOpen)

            const subject = {
                name: currentScore?.name,
                subject: currentScore?.subject,
                score: {
                    x1: currentScore?.x1,
                    x2: currentScore?.x2,
                    x3: currentScore?.x3,
                },
            }

            const data = { studentId: student._id, subject }
            await updateTranscript(data)

            getData()
            renderNoti({
                type: "success",
                title: "Thành công",
                message: "Đã cập nhật bảng điểm",
            })
        } catch (err) {
            renderNoti({
                type: "danger",
                title: "Lỗi",
                message: "Lỗi trong khi cập nhật bảng điểm",
            })
        }
    }

    const renderModal = () => (
        <ViewModal
            isOpen={isOpen}
            toggle={() => toggle(!isOpen)}
            title={`Cập nhật bảng điểm`}
            onConfirm={() => updateStudentTranscript()}
        >
            <Row>
                <Col md={12}>Học sinh: {student?.studentName}</Col>
                <Col md={12}>Lớp: {classRoom}</Col>
                <Col md={12}>
                    Năm học: {props.time.year}-{props.time.year + 1} || Học kỳ:{" "}
                    {props.time.semester}
                </Col>
                <Col md={12} className="mb-2">
                    Môn học: {currentScore.subject}
                </Col>
                <Col md={12} className="mb-2">
                    HS 1:
                    {currentScore?.x1?.map((item, index) => (
                        <input
                            className="mx-2 text-center"
                            style={{ width: "27px" }}
                            key={index}
                            type="number"
                            defaultValue={item > -1 ? item : null}
                            maxLength={2}
                            onChange={(e) => {
                                editTranscript("x1", index, e)
                            }}
                        />
                    ))}
                </Col>

                <Col md={12} className="mb-2">
                    HS 2:
                    {currentScore?.x2?.map((item, index) => (
                        <input
                            className="mx-2 text-center"
                            style={{ width: "27px" }}
                            key={index}
                            maxLength={2}
                            defaultValue={item > -1 ? item : null}
                            onChange={(e) => {
                                editTranscript("x2", index, e)
                            }}
                        />
                    ))}
                </Col>

                <Col md={12} className="mb-2">
                    HS 3:
                    {currentScore?.x3?.map((item, index) => (
                        <input
                            className="mx-2 text-center"
                            style={{ width: "27px" }}
                            key={index}
                            maxLength={2}
                            defaultValue={item > -1 ? item : null}
                            onChange={(e) => {
                                editTranscript("x3", index, e)
                            }}
                        />
                    ))}
                </Col>
            </Row>
        </ViewModal>
    )

    const onConfirmFinalMark = () => {
        toggleFinal(!isOpenFinal)
        finalMark({ subject, classRoom })
            .then((res) => {
                if (res.data.error) throw new Error(res.data.error)

                getData()

                renderNoti({
                    type: "success",
                    title: "Thành công",
                    message: "Đã cập nhật bảng điểm",
                })
            })
            .catch((err) => {
                renderNoti({
                    type: "danger",
                    title: "Lỗi",
                    message: err.message,
                })
            })
    }

    const renderModalFinal = () => (
        <ViewModal
            isOpen={isOpenFinal}
            toggle={() => toggleFinal(!isOpenFinal)}
            title="Tổng kết điểm"
            onConfirm={() => onConfirmFinalMark()}
        >
            <p>
                Bạn có chắc chắn muốn tổng kết{" "}
                {subject ? "điểm" : "điểm và hạnh kiểm"} ?
            </p>
            <p className="text-danger">
                {subject ? "Điểm" : "Điểm và hạnh kiểm"} sau khi tổng kết sẽ
                không thể thay đổi.
            </p>
        </ViewModal>
    )

    const onUpdateConduct = () => {
        toggleConduct(!isOpenConduct)
        updateConduct({ studentId: student._id, conduct })
            .then((res) => {
                getData()

                renderNoti({
                    type: "success",
                    title: "Thành công",
                    message: "Đã cập nhật hạnh kiểm",
                })
            })
            .catch((err) => {
                renderNoti({
                    type: "danger",
                    title: "Lỗi",
                    message: "Lỗi trong khi cập nhật hạnh kiểm",
                })
            })
    }

    const renderModalConduct = () => {
        return (
            <ViewModal
                isOpen={isOpenConduct}
                toggle={() => toggleConduct(!isOpenConduct)}
                title="Cập nhật hạnh kiểm"
                onConfirm={() => onUpdateConduct()}
            >
                <Col md={12}>Học sinh: {student?.studentName}</Col>
                <Col md={12}>Lớp: {classRoom}</Col>
                <Col md={12} className="mb-2">
                    Năm học: {props.time.year}-{props.time.year + 1} | Học kỳ:{" "}
                    {props.time.semester}
                </Col>
                <Col md={12}>Hạnh kiểm:</Col>
                <Col md={6}>
                    <FilterSelected
                        options={conductOptions}
                        value={{ label: conduct, label: conduct }}
                        onChange={(e) => setConduct(e.value)}
                    />
                </Col>
            </ViewModal>
        )
    }

    const singleMark = (score) => (
        <>
            <p>
                <span className="mr-2 font-weight-bold">HS1:</span>
                {score.x1
                    .filter((item) => item !== -1)
                    .map((item, index) => (
                        <span key={index} className="mr-2">
                            {item}
                        </span>
                    ))}
            </p>
            <p>
                <span className="mr-2 font-weight-bold">HS2:</span>
                {score.x2
                    .filter((item) => item !== -1)
                    .map((item, index) => (
                        <span key={index} className="mr-2">
                            {item}
                        </span>
                    ))}
            </p>
            <p>
                <span className="mr-2 font-weight-bold">HS3:</span>
                {score.x3
                    .filter((item) => item !== -1)
                    .map((item, index) => (
                        <span key={index} className="mr-2">
                            {item}
                        </span>
                    ))}
            </p>
        </>
    )

    return (
        <>
            <Row className="mb-2">
                {renderModalFinal()}
                {renderModalConduct()}
                <Col md={subject ? 8 : 12} className="d-flex align-items-start">
                    <div className="flex-grow-1">
                        <h5>
                            BẢNG ĐIỂM LỚP {classRoom}{" "}
                            {subject &&
                                `MÔN ${studentName(
                                    null,
                                    subject
                                ).toUpperCase()}`}
                        </h5>
                        <p className="mb-0">
                            Năm học: {props.time.year}-{props.time.year + 1} |
                            Học kỳ: {props.time.semester}
                        </p>
                    </div>
                    <BackBtn
                        title="trang chủ"
                        onClick={() => history.push("/")}
                    />
                </Col>
            </Row>
            {data && data.length > 0 && (
                <Row className="mb-2">
                    <Col md={subject ? 8 : 12} className="text-right mb-2">
                        <b>Tổng số học sinh: {data.length}</b>
                    </Col>
                    {!subject && (
                        <Col md={12} className="mb-2">
                            <Table bordered striped hover size="sm" responsive>
                                <thead>
                                    {isOverScore ? (
                                        <tr>
                                            {[
                                                "Số thứ tự",
                                                "Tên học sinh",
                                                "Điểm trung bình học kỳ",
                                                "Hạnh kiểm học kỳ",
                                                "Xếp loại học kỳ",
                                            ].map((item, index) => (
                                                <th
                                                    key={index}
                                                    className="align-top"
                                                >
                                                    {item}
                                                </th>
                                            ))}
                                            {isOverYear && (
                                                <>
                                                    {[
                                                        "Điểm trung bình cả năm",
                                                        "Hạnh kiểm cả năm",
                                                        "Xếp loại cả năm",
                                                    ].map((item, index) => (
                                                        <th
                                                            key={index}
                                                            className="align-top"
                                                        >
                                                            {item}
                                                        </th>
                                                    ))}
                                                </>
                                            )}
                                        </tr>
                                    ) : (
                                        <tr>
                                            {[
                                                "Số thứ tự",
                                                "Tên học sinh",
                                                "Toán",
                                                "Văn",
                                                "Anh",
                                                "Vật lý",
                                                "Hóa học",
                                                "Sinh học",
                                                "Địa",
                                                "Sử",
                                                "GDCD",
                                                "Âm nhạc",
                                                "Mỹ thuật",
                                                "Thể dục",
                                                "Hạnh kiểm",
                                            ].map((item, index) => (
                                                <th
                                                    key={index}
                                                    className="align-top"
                                                >
                                                    {item}
                                                </th>
                                            ))}
                                        </tr>
                                    )}
                                </thead>
                                <tbody>
                                    {data.map((student, index) => (
                                        <>
                                            {isOverScore ? (
                                                <tr key={student._id}>
                                                    <td
                                                        style={{
                                                            width: "96px",
                                                        }}
                                                    >
                                                        {index + 1}
                                                    </td>
                                                    <td>
                                                        {student.studentName}
                                                    </td>
                                                    <td>
                                                        {student.finalScore}
                                                    </td>
                                                    <td>{student.conduct}</td>
                                                    <td>{student.result}</td>
                                                    {isOverYear && (
                                                        <>
                                                            <td>
                                                                {
                                                                    student.totalScore
                                                                }
                                                            </td>
                                                            <td>
                                                                {
                                                                    student.totalConduct
                                                                }
                                                            </td>
                                                            <td>
                                                                {
                                                                    student.totalResult
                                                                }
                                                            </td>
                                                        </>
                                                    )}
                                                </tr>
                                            ) : (
                                                <tr key={student._id}>
                                                    <td>{index + 1}</td>
                                                    <td>
                                                        {student.studentName}
                                                    </td>
                                                    {Object.values(
                                                        student.score
                                                    ).map((item, index) => (
                                                        <td key={index}>
                                                            {item.medium &&
                                                            item.medium !== -1
                                                                ? item.medium
                                                                : singleMark(
                                                                      item
                                                                  )}
                                                        </td>
                                                    ))}
                                                    <td className="text-center font-weight-bold">
                                                        {student.conduct}{" "}
                                                        {!isOverScore && (
                                                            <EditBtn
                                                                title="Cập nhật hạnh kiểm"
                                                                onClick={() => {
                                                                    setStudent({
                                                                        _id:
                                                                            student._id,
                                                                        studentName:
                                                                            student.studentName,
                                                                    })
                                                                    setConduct(
                                                                        student.conduct
                                                                    )
                                                                    toggleConduct(
                                                                        !isOpenConduct
                                                                    )
                                                                }}
                                                            />
                                                        )}
                                                    </td>
                                                </tr>
                                            )}
                                        </>
                                    ))}
                                </tbody>
                            </Table>
                        </Col>
                    )}

                    {subject && (
                        <Col md={8} className="mb-2">
                            {renderModal()}
                            <Table bordered striped hover size="sm" responsive>
                                <thead>
                                    <tr>
                                        {[
                                            "STT",
                                            "Tên học sinh",
                                            "Hệ số 1",
                                            "Hệ số 2",
                                            "Hệ số 3",
                                        ].map((item, index) => (
                                            <th
                                                key={index}
                                                className="align-top"
                                            >
                                                {item}
                                            </th>
                                        ))}
                                        {!isOverSubject && !isOverYear && (
                                            <th></th>
                                        )}
                                        {isOverSubject && (
                                            <th className="align-top">
                                                Điểm trung bình học kỳ
                                            </th>
                                        )}
                                        {isOverYear && (
                                            <th className="align-top">
                                                Điểm trung bình cả năm
                                            </th>
                                        )}
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.map((student, index) => (
                                        <tr key={student._id}>
                                            <td>{index + 1}</td>
                                            <td>{student.studentName}</td>
                                            {Object.values(student.score).map(
                                                (item, index) => {
                                                    if (Array.isArray(item)) {
                                                        return (
                                                            <td key={index}>
                                                                {item
                                                                    .filter(
                                                                        (
                                                                            number
                                                                        ) =>
                                                                            number !==
                                                                            -1
                                                                    )
                                                                    .join(", ")}
                                                            </td>
                                                        )
                                                    }

                                                    return null
                                                }
                                            )}

                                            <td
                                                className={
                                                    !isOverSubject &&
                                                    "text-center"
                                                }
                                            >
                                                {!isOverSubject ? (
                                                    <EditBtn
                                                        title="Cập nhật điểm"
                                                        onClick={() => {
                                                            setStudent({
                                                                _id:
                                                                    student._id,
                                                                studentName:
                                                                    student.studentName,
                                                            })
                                                            setCurrentScore({
                                                                ...student.score,
                                                                name: subject,
                                                                subject: subjectName(
                                                                    null,
                                                                    subject
                                                                ),
                                                            })
                                                            toggle(!isOpen)
                                                        }}
                                                    />
                                                ) : (
                                                    student.score.medium
                                                )}
                                            </td>
                                            {isOverYear && (
                                                <td>{student.totalScore}</td>
                                            )}
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Col>
                    )}

                    {!isOverSubject && !isOverScore && (
                        <Col md={12}>
                            <Button
                                color="success"
                                onClick={() => toggleFinal(!isOpenFinal)}
                            >
                                Tổng kết{" "}
                                {subject ? "điểm" : "điểm và hạnh kiểm"}
                            </Button>
                        </Col>
                    )}
                </Row>
            )}
        </>
    )
}

const mapStateToProps = (state) => ({
    time: state.time,
})

const mapDispatchToProps = {
    getClassTranscript,
}

export default connect(mapStateToProps, mapDispatchToProps)(ConfirmTranscript)
