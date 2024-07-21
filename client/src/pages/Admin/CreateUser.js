import React from "react"

import CreateStudent from "./CreateStudent"
import CreateTeacher from "./CreateTeacher"

export default function (props) {
    return (
        <div>
            {props.match.params.role === "student" ? (
                <CreateStudent {...props} />
            ) : props.match.params.role === "teacher" ? (
                <CreateTeacher {...props} />
            ) : (
                ""
            )}
        </div>
    )
}
