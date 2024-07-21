import React from "react"
import Select from "react-select"

export default function (props) {
    return (
        <Select
            placeholder={props.placeholder || "Lọc"}
            options={props.options}
            onChange={props.onChange}
            maxMenuHeight={150}
            {...props}
        />
    )
}
