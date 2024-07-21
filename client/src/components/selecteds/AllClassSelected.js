import React, { useEffect, useState } from "react"
import Select from "react-select"

import { getAllClass } from "../../utils/api/fetchData"

export default (props) => {
    const [options, setOptions] = useState([])
    useEffect(() => {
        if (!props.viewOnly) {
            getAllClass().then((res) =>
                setOptions(
                    res.data.map((item) => ({ value: item, label: item }))
                )
            )
        }
    }, [])

    return (
        <Select
            placeholder="Chọn lớp học"
            options={options}
            onChange={props.onChange}
            {...props}
        />
    )
}
