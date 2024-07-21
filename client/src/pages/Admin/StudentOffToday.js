import React, { useEffect } from "react"
import { connect } from "react-redux"
import { Row, Col, Table, Alert } from "reactstrap"
import moment from "moment"

import history from "../../config/history"
import NewTabLink from "../../components/common/NewTabLink"
import BackBtn from "../../components/buttons/BackBtn"
import getAdminReport from "../../redux/action/getAdminReport"

const StudentOffToday = (props) => {
    useEffect(() => {
        if (!props.studentOff || props.studentOff.length === 0) {
            props.getAdminReport()
        }
    }, [])

    return (
        <Row className="mb-4">
            <Col md={8} className="d-flex mb-2">
                <h5 className="flex-grow-1">
                    HỌC SINH NGHỈ HỌC NGÀY {moment().format("DD/MM/YYYY")}
                </h5>
                <div className="flex-grow-1 text-right">
                    <BackBtn
                        title="trang chủ"
                        onClick={() => history.push("/")}
                    />
                </div>
            </Col>
            <Col md={8}>
                {props.studentOff?.length > 0 ? (
                    <Table bordered striped hover size="sm" responsive>
                        <thead>
                            <tr>
                                <th>Tên</th>
                                <th>Lớp</th>
                                <th>Có phép</th>
                            </tr>
                        </thead>
                        <tbody>
                            {props.studentOff?.map((item, index) => (
                                <tr key={index}>
                                    <td>
                                        <NewTabLink
                                            to={`/user/student/edit/${item.student.id}`}
                                            title={item.student.name}
                                        />
                                    </td>
                                    <td>{item.student.classRoom}</td>
                                    <td className="text-center">
                                        {item.student.permission ? (
                                            <i className="fas fa-check text-success" />
                                        ) : (
                                            <i className="fas fa-times text-danger" />
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                ) : (
                    <Alert color="primary">
                        Không có học sinh nghỉ học hôm nay
                    </Alert>
                )}
            </Col>
        </Row>
    )
}

const mapStateToProps = (state) => ({
    studentOff: state.studentOff.studentOff,
})

const mapDispatchToProps = {
    getAdminReport,
}

export default connect(mapStateToProps, mapDispatchToProps)(StudentOffToday)
