import React from "react"
import { Card, CardHeader, CardBody } from "reactstrap"

export default ({ icon, title, children, height, ...rest }) => {
    return (
        <Card {...rest}>
            <CardHeader>
                <i className={icon ? `${icon} mr-2` : ""} />
                {title}
            </CardHeader>
            <CardBody style={{ height: height || "" }}>{children}</CardBody>
        </Card>
    )
}
