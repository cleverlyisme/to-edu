import React from "react"
import { connect } from "react-redux"
import moment from "moment"
import { Alert } from "reactstrap"

const TimeSemester = ({ time, role }) => {
    if (!role) {
        return null
    }

    return (
        <Alert color="secondary" className="mb-4">
            <span>
                Ngày: {moment(new Date()).format("DD/MM/YYYY")}
                {"  |  "}
            </span>

            <span>
                Năm học: {time.year ? `${time.year}-${time.year + 1}` : ""}
                {"  |  "}
            </span>
            <span>Học kỳ: {time.semester ? time.semester : ""}</span>
        </Alert>
    )
}

const mapStateToProps = (state) => ({
    time: state.time,
    role: state.user.userInformation.role,
})

export default connect(mapStateToProps, null)(TimeSemester)
