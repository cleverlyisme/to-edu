import React, { useState } from "react"
import { connect } from "react-redux"
import { Form, FormGroup, Input, Label, Button } from "reactstrap"

import history from "../config/history"
import Feedback from "../components/common/Feedback"
import resetPassword from "../redux/action/resetPassword"
import renderNoti from "../utils/renderNoti"

const ResetPassword = (props) => {
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [checkPassword, setCheckPassword] = useState(false)

    const {
        match: {
            params: { secretKey },
        },
    } = props

    const sendRequest = async (e) => {
        e.preventDefault()
        setCheckPassword(true)
        if (!password.trim() || password !== confirmPassword) return

        try {
            const res = await props.resetPassword({
                secretKey,
                newPassword: password,
            })
            if (!res) throw new Error("Đã có lỗi xảy ra")

            renderNoti({
                type: "success",
                title: "Thành công",
                message: "Bạn đã đặt lại mật khẩu thành công",
            })
            history.push("/login")
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
                <h3>Đặt lại mật khẩu</h3>
                <FormGroup>
                    <Label>Mật khẩu mới (tối thiểu 8 ký tự)</Label>
                    <Input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{
                            border:
                                checkPassword &&
                                (!password.trim() ||
                                    password !== confirmPassword)
                                    ? "1px solid #dc3545"
                                    : "",
                        }}
                        placeholder="Mật khẩu mới"
                        minLength={8}
                    />
                </FormGroup>
                <FormGroup>
                    <Label>Xác nhận mật khẩu</Label>
                    <Input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        style={{
                            border:
                                checkPassword &&
                                (!confirmPassword.trim() ||
                                    password !== confirmPassword)
                                    ? "1px solid #dc3545"
                                    : "",
                        }}
                        placeholder="Xác nhận mật khẩu"
                        minLength={8}
                    />
                    {checkPassword &&
                        (!password.trim() || password !== confirmPassword) && (
                            <Feedback>
                                Mật khẩu{" "}
                                {!password.trim()
                                    ? "không được bỏ trống"
                                    : "không giống nhau"}
                            </Feedback>
                        )}
                </FormGroup>
                <Button color="primary">Xác nhận</Button>
            </Form>
        </div>
    )
}

const mapDispatchToProps = {
    resetPassword,
}

export default connect(null, mapDispatchToProps)(ResetPassword)
