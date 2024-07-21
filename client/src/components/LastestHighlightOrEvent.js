import React, { useEffect, useState } from "react"
import moment from "moment"
import { Row, Col, Input, Label, Alert } from "reactstrap"
import { Link } from "react-router-dom"
import { connect } from "react-redux"
import PerfectScrollbar from "react-perfect-scrollbar"

import getLastestHighlight from "../redux/action/getLastestHighlight"
import getEvent from "../redux/action/getEvent"
import { createOrUpdateEvent } from "../utils/api/fetchData"
import renderNoti from "../utils/renderNoti"

import AdminBlock from "./Admin/AdminBlock"
import SimpleHighlightEvent from "./SimpleHighlightEvent"
import ViewModal from "./modal/ViewModal"
import LabelRequired from "./common/LabelRequired"
import Feedback from "./common/Feedback"

const highlightTitle = (
    <div className="d-flex align-items-center">
        <i className="fas fa-newspaper mr-2" />
        <div className="flex-grow-1">Thông báo gần đây</div>
        <Link to="/highlights">Xem tất cả</Link>
    </div>
)

const LastestHighlightOrEvent = (props) => {
    const [highlights, setHighlights] = useState([])

    const [id, setId] = useState(null)
    const [time, setTime] = useState(null)
    const [isOpen, toggle] = useState(false)
    const [content, setContent] = useState("")
    const [checkContent, setCheckContent] = useState(false)

    useEffect(() => {
        if (props.isHighlight) {
            props
                .getLastestHighlight()
                .then((data) => setHighlights(data || []))
        } else {
            props.getEvent()
        }
    }, [])

    const updateEvent = () =>
        createOrUpdateEvent({ id, time, content })
            .then(() => {
                setContent("")
                setCheckContent(false)
                toggle(!isOpen)

                renderNoti({
                    type: "success",
                    title: "Thành công",
                    message: "Đã cập nhật sự kiện",
                })

                props.getEvent()
            })
            .catch(() => {
                renderNoti({
                    type: "danger",
                    title: "Lỗi",
                    message: "Lỗi trong khi cập nhật sự kiện",
                })
            })

    const renderModal = () => (
        <ViewModal
            isOpen={isOpen}
            toggle={() => {
                setContent("")
                setCheckContent(false)
                toggle(!isOpen)
            }}
            title="Thêm sự kiện"
            onConfirm={() => updateEvent({ time, content })}
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
                        maxLength={80}
                    />
                    {checkContent && !content.trim() && (
                        <Feedback>Sự kiện đang trống</Feedback>
                    )}
                </Col>
            </Row>
        </ViewModal>
    )

    const data = props.isHighlight ? highlights : props.events
    return (
        <AdminBlock
            title={props.isHighlight ? highlightTitle : "Sự kiện sắp tới"}
            icon={!props.isHighlight && "fab fa-elementor"}
            height={props.height || (props.noHeight && "") || "350px"}
            className={props.className && props.className}
        >
            {renderModal()}
            <PerfectScrollbar>
                {data &&
                    data.length > 0 &&
                    data.map((item, index) => (
                        <React.Fragment key={index}>
                            <SimpleHighlightEvent
                                item={item}
                                {...props}
                                onOpenModal={(item) => {
                                    setId(item._id)
                                    setTime(item.time)
                                    setContent(item.content)
                                    toggle(!isOpen)
                                }}
                            />
                            {index < data.length - 1 && <hr />}
                        </React.Fragment>
                    ))}
                {!data ||
                    (data.length === 0 && (
                        <Alert type="primary">
                            {`Không có ${
                                props.isHighlight ? "thông báo" : "sự kiện"
                            } nào`}
                        </Alert>
                    ))}
            </PerfectScrollbar>
        </AdminBlock>
    )
}

const mapStateToProps = (state) => ({
    events: state.event.events,
})

const mapDispatchToProps = {
    getLastestHighlight,
    getEvent,
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(LastestHighlightOrEvent)
