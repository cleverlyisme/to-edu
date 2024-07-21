import React, { useState, useEffect } from "react"
import { connect } from "react-redux"
import moment from "moment"

import Admin from "./Admin"
import Teacher from "./Teacher"
import Parent from "./Parent"
import TimeSemester from "../components/TimeSemester"

function Home(props) {
    const [role, setRole] = useState("")

    useEffect(() => {
        if (
            props.userInformation &&
            Object.keys(props.userInformation).length > 0
        ) {
            setRole(props.userInformation.role)
        }
    }, [props.userInformation])

    return (
        <div>
            {role && <h5>TỔNG QUAN</h5>}
            <TimeSemester />
            {role === "admin" ? (
                <Admin />
            ) : role === "teacher" ? (
                <Teacher />
            ) : role === "parent" ? (
                <Parent />
            ) : null}
        </div>
    )
}

const mapStateToProps = (state) => ({
    userInformation: state.user.userInformation,
})

export default connect(mapStateToProps, null)(Home)
