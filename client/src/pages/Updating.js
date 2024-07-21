import React, { useEffect } from "react"
import { connect } from "react-redux"

import history from "../config/history"
import { checkUpdateStatus } from "../utils/api/fetchData"
import setUserInformation from "../redux/action/setUserInformation"

const Updating = (props) => {
    useEffect(() => {
        checkUpdateStatus().then((res) => {
            if (res.data) {
                history.push("/login")
            } else {
                props.setUserInformation({})
            }
        })
    }, [])

    return (
        <div
            className="min-vh-100 d-flex flex-column align-items-center justify-content-center"
            style={{ marginTop: "-100px" }}
        >
            <img
                src="/update.png"
                alt="updating"
                className="mb-2"
                style={{ width: "10vw", height: "10vw" }}
            />

            <h5>Hệ thống đang được cập nhật, vui lòng quay lại sau</h5>
        </div>
    )
}

const mapDispatchToProps = {
    setUserInformation,
}

export default connect(null, mapDispatchToProps)(Updating)
