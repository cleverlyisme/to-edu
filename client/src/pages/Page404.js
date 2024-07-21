import React from "react"
import { Col, Container, Row } from "reactstrap"

export default () => {
    return (
        <div
            className="min-vh-100 d-flex align-items-center justify-content-center"
            style={{ marginTop: "-100px" }}
        >
            <div>
                <h1 className="float-left display-3 mr-4">404</h1>
                <h4 className="pt-3">Oops! Lỗi.</h4>
                <p className="text-muted float-left">
                    Địa chỉ bạn đang truy cập không tồn tại.
                </p>
            </div>
        </div>
    )
}
