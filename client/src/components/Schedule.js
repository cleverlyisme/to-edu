import React, { useState, useEffect } from "react"
import { connect } from "react-redux"
import { Table, Row, Col, Label, Alert, Button } from "reactstrap"

import history from "../config/history"
import { getClassSchedule, getTeacherSchedule } from "../utils/api/fetchData"
import NewTabLink from "./common/NewTabLink"

const Schedule = ({ classRoom, role, teacherId, time, isComponent }) => {
    const [data, setData] = useState({})

    useEffect(() => {
        getData()
    }, [classRoom])

    const getData = () => {
        if (classRoom && !teacherId) {
            getClassSchedule(classRoom).then((res) => setData(res.data))
        }
        if (teacherId) {
            getTeacherSchedule(teacherId).then((res) => setData(res.data))
        }
    }

    return (
        <div className="mb-2">
            <Row>
                <Col md={12}>
                    {!isComponent && (
                        <>
                            {!teacherId ? (
                                <Label>
                                    Thời khóa biểu lớp {classRoom}{" "}
                                    {time.year &&
                                        time.semester &&
                                        `${time.year}-${time.year + 1} ${
                                            time.semester
                                        }`}{" "}
                                    {}
                                </Label>
                            ) : (
                                <Label>
                                    Thời khóa biểu giáo viên {data.name}{" "}
                                    {time.year &&
                                        time.semester &&
                                        `${time.year}-${time.year + 1} ${
                                            time.semester
                                        }`}
                                </Label>
                            )}
                        </>
                    )}

                    {data &&
                    data.schedule &&
                    Object.keys(data.schedule).length > 0 ? (
                        <>
                            <Table bordered striped hover size="sm" responsive>
                                <thead>
                                    <tr>
                                        {[
                                            "Thứ hai",
                                            "Thứ ba",
                                            "Thứ tư",
                                            "Thứ năm",
                                            "Thứ sáu",
                                        ].map((day, index) => (
                                            <th key={index}>{day}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {[0, 1, 2, 3, 4].map((number) => (
                                        <tr key={number}>
                                            {[
                                                "mon",
                                                "tue",
                                                "wed",
                                                "thu",
                                                "fri",
                                            ].map((item, index) => (
                                                <td
                                                    key={index}
                                                    style={{
                                                        height: "33.33px",
                                                    }}
                                                >
                                                    {
                                                        data.schedule[item][
                                                            number
                                                        ]
                                                    }
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                            {!teacherId && (
                                <NewTabLink
                                    title="Chỉnh sửa"
                                    to={`/updateSchedule/${classRoom}`}
                                />
                            )}
                        </>
                    ) : (
                        <>
                            {!teacherId && (
                                <Alert color="primary">
                                    Lớp học này chưa có thời khóa biểu
                                </Alert>
                            )}
                            {role === "admin" && !teacherId && (
                                <Button
                                    color="success"
                                    onClick={() =>
                                        history.push(
                                            `/updateSchedule/${classRoom}`
                                        )
                                    }
                                >
                                    Tạo mới
                                </Button>
                            )}
                        </>
                    )}
                </Col>
            </Row>
        </div>
    )
}

const mapStateToProps = (state) => ({
    role: state.user.userInformation.role,
    time: state.time,
})

export default connect(mapStateToProps, null)(Schedule)
