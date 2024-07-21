import React, { useState } from "react"
import { connect } from "react-redux"
import { Label, Input, Button } from "reactstrap"

import AdminBlock from "./Admin/AdminBlock"
import Feedback from "./common/Feedback"
import sendMessageToMainTeacher from "../redux/action/sendMessageToMainTeacher"
import renderNoti from "../utils/renderNoti"

const Email = (props) => {
    const [content, setContent] = useState("")
    const [checkContent, setCheckContent] = useState(false)
    const { studentId } = props

    const send = async (type) => {
        setCheckContent(true)
        if (!content || !content.trim()) return

        try {
            await props.sendMessageToMainTeacher({ studentId, content, type })
            renderNoti({
                type: "success",
                title: "Thành công",
                message: "Đã gửi tin nhắn đến giáo viên chủ nhiệm",
            })
            setCheckContent(false)
            setContent("")
        } catch {
            renderNoti({
                type: "danger",
                title: "Lỗi",
                message: "Lỗi trong khi gửi tin nhắn đến giáo viên chủ nhiệm",
            })
        }
    }

    return (
        <AdminBlock title="Gửi tin nhắn" icon="far fa-envelope">
            <Label>Gửi tin nhắn đến cô giáo chủ nhiệm</Label>
            <Input
                type="textarea"
                rows={8}
                placeholder="Viết tin nhắn..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                style={{
                    border:
                        checkContent && !content.trim()
                            ? "1px solid #dc3545"
                            : "",
                }}
            />
            {checkContent && !content.trim() && (
                <Feedback>Nội dung tin nhắn không được để trống</Feedback>
            )}
            <div className="text-right mt-2">
                <Button
                    color="primary"
                    className="mr-2"
                    onClick={() => send("sms")}
                >
                    Gửi SMS
                </Button>
                {/* <Button color="warning">Gửi email</Button> */}
            </div>
        </AdminBlock>
    )
}

const mapDispatchToProps = {
    sendMessageToMainTeacher,
}

export default connect(null, mapDispatchToProps)(Email)
