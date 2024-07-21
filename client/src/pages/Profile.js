import React from "react"
import { connect } from "react-redux"

import CreateTeacher from "./Admin/CreateTeacher"
import CreateStudent from "./Admin/CreateStudent"

const Profile = ({ user }) => {
    const { role } = user
    return role === "parent" ? (
        <CreateStudent id={user._id} />
    ) : role === "teacher" ? (
        <CreateTeacher id={user._id} />
    ) : null
}

const mapStateToProps = (state) => ({
    user: state.user.userInformation,
})

export default connect(mapStateToProps, null)(Profile)
