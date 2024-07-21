import React, { useState } from "react"
import { connect } from "react-redux"
import { Form, FormGroup, Label, Input } from "reactstrap"

import ViewModal from "./modal/ViewModal"
import Feedback from "./common/Feedback"
import changePassword from "../redux/action/changePassword"
import renderNoti from "../utils/renderNoti"

const ChangePasswordModal = ({ isOpen, changePassword, toggle }) => {
    const [password, setPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmNewPassword, setConfirmNewPassword] = useState("")
    const [checkPassword, setCheckPassword] = useState(false)

    const confirmChangePassword = async () => {
        setCheckPassword(true)
        if (
            !password.trim() ||
            newPassword !== confirmNewPassword ||
            !newPassword.trim()
        )
            return

        try {
            const res = await changePassword({ password, newPassword })
            if (!res) throw new Error("Sai mật khẩu")

            renderNoti({
                type: "success",
                title: "Thành công",
                message: "Bạn đã thay đổi mật khẩu thành công",
            })

            toggleModal()
        } catch (err) {
            renderNoti({
                type: "danger",
                title: "Lỗi",
                message: err.message,
            })
        }
    }

    const toggleModal = () => {
        toggle()
        setPassword("")
        setNewPassword("")
        setConfirmNewPassword("")
    }

    return (
        <ViewModal
            title="Đổi mật khẩu"
            isOpen={isOpen}
            toggle={toggleModal}
            onConfirm={confirmChangePassword}
        >
            <Form>
                <FormGroup>
                    <Label>Mật khẩu cũ</Label>
                    <Input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Mật khẩu cũ"
                        style={{
                            border:
                                checkPassword && !password.trim()
                                    ? "1px solid #dc3545"
                                    : "",
                        }}
                    />
                    {checkPassword && !password.trim() && (
                        <Feedback>Mật khẩu không được bỏ trống</Feedback>
                    )}
                </FormGroup>

                <FormGroup>
                    <Label>Mật khẩu mới</Label>
                    <Input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Mật khẩu mới"
                        minLength={8}
                        style={{
                            border:
                                checkPassword &&
                                (!newPassword.trim() ||
                                    newPassword !== confirmNewPassword)
                                    ? "1px solid #dc3545"
                                    : "",
                        }}
                    />
                    {checkPassword &&
                        (!newPassword.trim() ||
                            newPassword !== confirmNewPassword) && (
                            <Feedback>
                                Mật khẩu mới{" "}
                                {!newPassword.trim()
                                    ? "không được bỏ trống"
                                    : "không giống nhau"}
                            </Feedback>
                        )}
                </FormGroup>

                <FormGroup>
                    <Label>Xác nhận mật khẩu mới</Label>
                    <Input
                        type="password"
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        placeholder="Xác nhận mật khẩu mới"
                        style={{
                            border:
                                checkPassword &&
                                (!confirmNewPassword.trim() ||
                                    newPassword !== confirmNewPassword)
                                    ? "1px solid #dc3545"
                                    : "",
                        }}
                    />
                    {checkPassword &&
                        (!newPassword.trim() ||
                            newPassword !== confirmNewPassword) && (
                            <Feedback>
                                Mật khẩu mới{" "}
                                {!newPassword.trim()
                                    ? "không được bỏ trống"
                                    : "không giống nhau"}
                            </Feedback>
                        )}
                </FormGroup>
            </Form>
        </ViewModal>
    )
}

const mapDispatchToProps = {
    changePassword,
}

export default connect(null, mapDispatchToProps)(ChangePasswordModal)
