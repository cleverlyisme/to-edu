import React, { useState } from "react"
import { connect } from "react-redux"
import { Form, FormGroup, Input, Label, Button } from "reactstrap"
import Select from "react-select"

import Feedback from "../components/common/Feedback"
import LabelRequired from "../components/common/LabelRequired"
import forgetPassword from "../redux/action/forgetPassword"
import renderNoti from "../utils/renderNoti"

const options = [
    { label: "Quản lý", value: "admin" },
    { label: "Giáo viên", value: "teacher" },
    { label: "Phụ huynh", value: "parent" },
]

const ForgetPassword = (props) => {
    const [role, setRole] = useState("teacher")
    const [identity, setIdentity] = useState("")
    const [checkInfo, setCheckInfo] = useState(false)

    const sendRequest = async (e) => {
        e.preventDefault()
        setCheckInfo(true)
        if (!identity.trim()) return

        try {
            const res = await props.forgetPassword({
                role,
                identity,
            })

            if (!res) throw new Error("Vui lòng kiểm tra lại thông tin của bạn")

            renderNoti({
                type: "success",
                title: "Thành công",
                message: `Vui lòng kiểm tra ${
                    role === "parent" ? "tin nhắn SMS" : "email"
                } để nhận liên kết đặt lại mật khẩu. Liên kết sẽ hết hạn sau 15 phút`,
            })
            setIdentity("")
            setCheckInfo(false)
        } catch (err) {
            renderNoti({
                type: "danger",
                title: "Lỗi",
                message: err.message,
            })
        }
    }

    return (
        <div
            className="d-flex justify-content-center align-items-center"
            style={{ height: "75vh" }}
        >
            <Form style={{ width: "300px" }} onSubmit={(e) => sendRequest(e)}>
                <img
                    src="/logo.png"
                    alt=""
                    style={{
                        width: "30px",
                        height: "30px",
                        marginRight: "8px",
                    }}
                />
                <h3>Cấp lại mật khẩu</h3>
                <FormGroup>
                    <Label>Bạn là</Label>
                    <Select
                        options={options}
                        value={options.find((option) => option.value === role)}
                        onChange={(e) => setRole(e.value)}
                    />
                </FormGroup>
                <FormGroup>
                    <LabelRequired>Thông tin đăng nhập của bạn</LabelRequired>
                    <Input
                        type={role === "parent" ? "text" : "email"}
                        placeholder={
                            role === "parent" ? "ID học sinh" : "Email"
                        }
                        value={identity}
                        onChange={(e) => setIdentity(e.target.value)}
                        style={{
                            border:
                                checkInfo && !identity.trim()
                                    ? "1px solid #dc3545"
                                    : "",
                        }}
                    />
                    {checkInfo && !identity.trim() && (
                        <Feedback>
                            Thông tin đăng nhập không được bỏ trống
                        </Feedback>
                    )}
                </FormGroup>
                <Button color="primary">Cấp lại mật khẩu</Button>
            </Form>
        </div>
    )
}

const mapDispatchToProps = {
    forgetPassword,
}

export default connect(null, mapDispatchToProps)(ForgetPassword)
