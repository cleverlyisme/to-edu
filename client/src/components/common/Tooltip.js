import React from "react"
import ReactTooltip from "react-tooltip"

export default function Tooltip(props) {
    return (
        <ReactTooltip
            border={false}
            key={props.id}
            id={props.id}
            effect="float"
            delayHide={100}
            delayShow={100}
            delayUpdate={100}
            place="bottom"
            type="info"
            {...props}
        >
            {props.children}
        </ReactTooltip>
    )
}
