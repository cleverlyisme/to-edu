import React from "react"
import { Button } from "reactstrap"

export default (props) => (
    <Button color="primary" onClick={props.onClick}>
        Quay lại {props.title}
    </Button>
)
