import React from "react"
import moment from "moment"
import { Row, Col } from "reactstrap"

export default ({ data }) => {
    const { title, time, content } = data

    return (
        <Row className="mb-2">
            <Col md={12}>
                <h5>{title}</h5>
                <p style={{ fontSize: "0.7rem" }}>
                    Cập nhật lần cuối lúc{" "}
                    {time ? moment(time).format("HH:mm DD/MM/YYYY") : ""}
                </p>
                <div dangerouslySetInnerHTML={{ __html: content }} />
            </Col>
        </Row>
    )
}
