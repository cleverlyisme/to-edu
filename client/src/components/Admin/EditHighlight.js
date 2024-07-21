import React, { useState } from "react"
import CKEditor from "ckeditor4-react"
import { Row, Col, Label, Input } from "reactstrap"

import Feedback from "../common/Feedback"

export default ({ data, onEditorChange, onTitleChange }) => {
    const [titleInvalid, setTitleInvalid] = useState(false)
    const [contentInvalid, setContentInvalid] = useState(false)

    return (
        <Row className="mb-2">
            <Col md={8} sm={12}>
                <Label>Tiêu đề</Label>
                <Input
                    type="text"
                    className="mb-2"
                    value={data.title || ""}
                    onChange={(e) => {
                        onTitleChange(e)
                        if (
                            e &&
                            e.target &&
                            e.target.value &&
                            e.target.value.trim()
                        ) {
                            setTitleInvalid(false)
                        }
                    }}
                    style={{ border: titleInvalid ? "1px solid #dc3545" : "" }}
                    onBlur={() => {
                        if (data && data.title && data.title.trim()) {
                            setTitleInvalid(false)
                            return
                        }
                        setTitleInvalid(true)
                    }}
                />
                {titleInvalid && (
                    <Feedback>Tiêu đề không được bỏ trống</Feedback>
                )}

                <Label>Nội dung</Label>
                <div
                    style={{
                        border: contentInvalid ? "1px solid #dc3545" : "",
                    }}
                    className="mb-2"
                >
                    <CKEditor
                        data={data.content || ""}
                        onChange={(e) => {
                            onEditorChange(e)
                            if (e.editor.getData().trim()) {
                                setContentInvalid(false)
                            }
                        }}
                        config={{
                            allowedContent: true,
                            extraPlugins: "colorbutton",
                            height: "350px",
                        }}
                        onBeforeLoad={(CKEDITOR) =>
                            (CKEDITOR.disableAutoInline = true)
                        }
                        onBlur={() => {
                            if (data && data.content && data.content.trim()) {
                                setContentInvalid(false)
                                return
                            }
                            setContentInvalid(true)
                        }}
                    />
                </div>
                {contentInvalid && (
                    <Feedback>Nội dung không được bỏ trống</Feedback>
                )}
            </Col>
        </Row>
    )
}
