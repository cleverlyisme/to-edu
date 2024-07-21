import React, { useState } from "react"
import { connect } from "react-redux"
import moment from "moment"
import Calendar from "react-calendar"
import { Row, Col, Input, Label } from "reactstrap"

import LabelRequired from "../common/LabelRequired"
import Feedback from "../common/Feedback"
import AdminBlock from "../Admin/AdminBlock"
import ViewModal from "../../components/modal/ViewModal"
import { createOrUpdateEvent } from "../../utils/api/fetchData"
import getEvent from "../../redux/action/getEvent"
import renderNoti from "../../utils/renderNoti"

const CalendarContainer = (props) => {
    const [time, setTime] = useState(null)
    const [isOpen, toggle] = useState(false)
    const [content, setContent] = useState("")
    const [checkContent, setCheckContent] = useState(false)

    const createEvent = (data) => {
        createOrUpdateEvent(data)
            .then(() => {
                setContent("")
                setCheckContent(false)
                toggle(!isOpen)

                renderNoti({
                    type: "success",
                    title: "Thành công",
                    message: "Đã tạo sự kiện",
                })

                props.getEvent()
            })
            .catch(() => {
                renderNoti({
                    type: "danger",
                    title: "Lỗi",
                    message: "Lỗi trong khi tạo sự kiện",
                })
            })
    }

    const renderModal = () => (
        <ViewModal
            isOpen={isOpen}
            toggle={() => {
                setContent("")
                setCheckContent(false)
                toggle(!isOpen)
            }}
            title="Thêm sự kiện"
            onConfirm={() => createEvent({ time, content })}
        >
            <Row>
                <Col md={12}>
                    <Label>Ngày: {moment(time).format("DD/MM/YYYY")}</Label>
                </Col>
                <Col md={12}>
                    <LabelRequired>Sự kiện</LabelRequired>
                    <Input
                        type="textarea"
                        rows={5}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        onBlur={() => setCheckContent(true)}
                        style={{
                            border:
                                checkContent && !content.trim()
                                    ? "1px solid #dc3545"
                                    : "",
                        }}
                    />
                    {checkContent && !content.trim() && (
                        <Feedback>Sự kiện đang trống</Feedback>
                    )}
                </Col>
            </Row>
        </ViewModal>
    )

    return (
        <AdminBlock title="Lịch" icon="far fa-calendar-alt" height="350px">
            {renderModal()}
            <Calendar
                onChange={(e) => {
                    if (e.getTime() > new Date().getTime()) {
                        setTime(e.toString())
                        toggle(true)
                    }
                }}
                value={new Date()}
                showWeekNumbers
            />
        </AdminBlock>
    )
}

const mapDispatchToProps = {
    getEvent,
}

export default connect(null, mapDispatchToProps)(CalendarContainer)
