import React from "react"
import Select from "react-select"

const yearNow = new Date().getFullYear()
const minYear = yearNow - 100
const maxYear = yearNow - 18

let options = []
for (let year = minYear; year < maxYear; year++) {
    options = [...options, { value: year.toString(), label: year }]
}

export default function (props) {
    return (
        <Select
            placeholder={props.placeholder || "Chọn năm"}
            options={options}
            onChange={props.onChange}
            {...props}
        />
    )
}
