import React from "react"
import { Label } from "reactstrap"

export default (props) => (
    <Label>
        {props.children} <span className="text-danger">*</span>
    </Label>
)
