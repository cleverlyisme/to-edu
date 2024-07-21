import React, { useState, useEffect } from "react"
import { connect } from "react-redux"
import { Row, Col, Button } from "reactstrap"

import history from "../config/history"
import BackBtn from "../components/buttons/BackBtn"
import EditHighlight from "../components/Admin/EditHighlight"
import ViewHighlight from "../components/ViewHighlight"
import { getHighlight, createOrUpdateHighlight } from "../utils/api/fetchData"
import renderNoti from "../utils/renderNoti"

const CreateHighlight = (props) => {
    const {
        match: {
            params: { id },
        },
    } = props

    const canEdit = props.role === "admin"

    const [data, setData] = useState({})

    useEffect(() => {
        if (id) {
            getHighlight(id).then((res) => setData(res.data))
        }
    }, [])

    const onTitleChange = (e) =>
        setData({
            ...data,
            title: e.target.value,
        })

    const onEditorChange = (e) => {
        setData({
            ...data,
            content: e.editor.getData(),
        })
    }

    const onSubmit = async () => {
        try {
            if (!data || !data.title.trim() || !data.content.trim()) {
                throw new Error(`Vui lòng điền đầy đủ tiêu đề và nội dung`)
            }

            if (id) {
                data.id = id
            }

            const res = await createOrUpdateHighlight(data)
            if (res.data !== true) {
                throw new Error(
                    `Lỗi trong khi ${id ? "cập nhật" : "tạo mới"} thông báo`
                )
            }

            renderNoti({
                type: "success",
                title: "Thành công",
                message: `Đã ${id ? "cập nhật" : "tạo mới"} thông báo`,
            })

            history.push("/")
        } catch (err) {
            renderNoti({
                type: "danger",
                title: "Lỗi",
                message: err.message,
            })
        }
    }

    return (
        <>
            <Row className="mb-2">
                <Col md={canEdit ? 8 : 12} className="d-flex align-items-start">
                    <h5 className="flex-grow-1">
                        {!id
                            ? "TẠO MỚI THÔNG BÁO"
                            : canEdit
                            ? "CHỈNH SỬA THÔNG BÁO"
                            : "THÔNG BÁO"}
                    </h5>
                    <BackBtn
                        title="trang chủ"
                        onClick={() => history.push("/")}
                    />
                </Col>
            </Row>
            {canEdit ? (
                <EditHighlight
                    data={data}
                    onTitleChange={onTitleChange}
                    onEditorChange={onEditorChange}
                />
            ) : (
                <ViewHighlight data={data} />
            )}
            {canEdit && (
                <Row>
                    <Col md={8} sm={12}>
                        <Button
                            color="success"
                            className="mr-2"
                            onClick={onSubmit}
                        >
                            {id ? "Cập nhật" : "Tạo mới"}
                        </Button>
                        <Button
                            color="secondary"
                            onClick={() => history.push("/")}
                        >
                            Hủy bỏ
                        </Button>
                    </Col>
                </Row>
            )}
        </>
    )
}

const mapStateToProps = (state) => ({
    role: state.user.userInformation.role,
})

export default connect(mapStateToProps, null)(CreateHighlight)
