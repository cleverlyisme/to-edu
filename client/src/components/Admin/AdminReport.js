import React, { useEffect, useState } from "react"
import { connect } from "react-redux"
import { Row, Col } from "reactstrap"

import history from "../../config/history"
import AdminCard from "./AdminCard"
import getAdminReport from "../../redux/action/getAdminReport"
import Tooltip from "../common/Tooltip"

const renderTooltipPermission = () => (
    <Tooltip key="permission" id="permission">
        <p className="mb-2">Học sinh nghỉ có phép</p>
    </Tooltip>
)

const renderTooltipNoPermission = () => (
    <Tooltip key="noPermission" id="noPermission">
        <p className="mb-2">Học sinh nghỉ không có phép</p>
    </Tooltip>
)

const AdminReport = (props) => {
    const [reports, setReports] = useState({})

    useEffect(() => {
        props.getAdminReport().then((data) => setReports(data))
    }, [])

    return (
        <Row>
            {renderTooltipPermission()}
            {renderTooltipNoPermission()}
            <Col md={6} lg={3} className="mb-4">
                <AdminCard
                    color="primary"
                    detail="Xem danh sách"
                    onDetailClick={() => history.push("/students")}
                >
                    <i className="fas fa-users" /> Tổng số học sinh:{" "}
                    {reports.numberOfStudents}
                </AdminCard>
            </Col>
            <Col md={6} lg={3} className="mb-4">
                <AdminCard
                    color="success"
                    detail="Xem danh sách"
                    onDetailClick={() => history.push("/teachers")}
                >
                    <i className="fas fa-chalkboard-teacher" /> Tổng số giáo
                    viên: {reports.numberOfTeachers}
                </AdminCard>
            </Col>
            <Col md={6} lg={3} className="mb-4">
                <AdminCard
                    color="warning"
                    detail="Xem danh sách"
                    onDetailClick={() => history.push("/gradeAndClass")}
                >
                    <i className="fas fa-school" /> Lớp học:{" "}
                    {reports.numberOfClasses}
                </AdminCard>
            </Col>
            <Col md={6} lg={3} className="mb-4">
                <AdminCard
                    color="danger"
                    onDetailClick={() => history.push("/studentOffToday")}
                >
                    <i className="fas fa-user-times mr-2" />
                    <span className="mr-4">Học sinh nghỉ học:</span>
                    {
                        reports.studentOff?.filter(
                            (item) => item.student.permission,
                        ).length
                    }{" "}
                    <i
                        className="fas fa-user-plus mr-4"
                        data-tip="permission"
                        data-for="permission"
                    />
                    {
                        reports.studentOff?.filter(
                            (item) => !item.student.permission,
                        ).length
                    }{" "}
                    <i
                        className="fas fa-user-minus"
                        data-tip="noPermission"
                        data-for="noPermission"
                    />
                </AdminCard>
            </Col>
        </Row>
    )
}

const mapDispatchToProps = {
    getAdminReport,
}

export default connect(null, mapDispatchToProps)(AdminReport)
