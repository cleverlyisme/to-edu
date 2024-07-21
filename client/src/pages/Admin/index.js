import React from "react"
import { Col, Row } from "reactstrap"
import AdminReport from "../../components/Admin/AdminReport"
import AdminChart from "../../components/Admin/AdminChart"
import LastestHighlightOrEvent from "../../components/LastestHighlightOrEvent"
import Calendar from "../../components/Admin/Calendar"

export default function (props) {
    return (
        <>
            <AdminReport />
            <AdminChart />
            <Row>
                <Col md={12} xl={4} className="mb-4">
                    <Calendar />
                </Col>

                <Col md={6} xl={4} className="mb-4">
                    <LastestHighlightOrEvent isHighlight />
                </Col>

                <Col md={6} xl={4} className="mb-4">
                    <LastestHighlightOrEvent />
                </Col>
            </Row>
        </>
    )
}
