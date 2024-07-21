import React from "react"
import { Row, Col } from "reactstrap"
import moment from "moment"

import AdminBlock from "../components/Admin/AdminBlock"
import AdminCard from "../components/Admin/AdminCard"
import Tooltip from "../components/common/Tooltip"

export default (props) => {
    const permission = props.dayOff.filter((day) => day.permission)
    const noPermission = props.dayOff.filter((day) => !day.permission)

    const renderTooltipPermission = () => {
        if (permission.length > 0) {
            return (
                <Tooltip key="permission" id="permission">
                    {permission.map((item, index) => (
                        <p key={index} className="mb-2">
                            {moment(item.day).format("DD/MM/YYYY")}
                        </p>
                    ))}
                </Tooltip>
            )
        }
    }

    const renderTooltipNoPermission = () => {
        if (noPermission.length > 0) {
            return (
                <Tooltip key="noPermission" id="noPermission">
                    {noPermission.map((item, index) => (
                        <p key={index} className="mb-2">
                            {moment(item.day).format("DD/MM/YYYY")}
                        </p>
                    ))}
                </Tooltip>
            )
        }
    }

    return (
        <AdminBlock
            title="Số ngày nghỉ trong học kỳ"
            icon="fas fa-times"
            className="flex-grow-1 mb-4"
        >
            {renderTooltipPermission()}
            {renderTooltipNoPermission()}
            <Row>
                <Col md={12} className="mb-4">
                    <div data-tip="permission" data-for="permission">
                        <AdminCard color="primary" viewOnly>
                            <i className="fas fa-user-plus mr-2" />
                            Có phép: {permission.length}
                        </AdminCard>
                    </div>
                </Col>

                <Col md={12}>
                    <div data-tip="noPermission" data-for="noPermission">
                        <AdminCard color="danger" viewOnly>
                            <i className="fas fa-user-minus mr-2" />
                            Không phép: {noPermission.length}
                        </AdminCard>
                    </div>
                </Col>
            </Row>
        </AdminBlock>
    )
}
