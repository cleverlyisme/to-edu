import React, { useState, useEffect } from "react"
import { Row, Col, Button, Table } from "reactstrap"
import _ from "lodash"

import history from "../../config/history"
import FilterSelected from "../../components/selecteds/FilterSelected"
import {
    getAllSubject,
    createOrUpdateSchedule,
} from "../../utils/api/fetchData"
import renderNoti from "../../utils/renderNoti"
import { getClassSchedule } from "../../utils/api/fetchData"

export default (props) => {
    const {
        match: {
            params: { classRoom },
        },
    } = props
    const [options, setOptions] = useState([])
    const [schedule, setSchedule] = useState({
        mon: [],
        tue: [],
        wed: [],
        thu: [],
        fri: [],
    })

    useEffect(() => {
        getData()
    }, [])

    const getData = () => {
        getAllSubject().then((res) =>
            setOptions(res.data.map((item) => ({ value: item, label: item }))),
        )

        if (classRoom) {
            getClassSchedule(classRoom).then((res) =>
                setSchedule(res.data.schedule),
            )
        }
    }

    const onUpdateSchedule = async () => {
        try {
            if (!checkFullSchedule()) {
                renderNoti({
                    type: "danger",
                    title: "Lỗi",
                    message: "Vui lòng điền đầy đủ các tiết học",
                })
                return
            }
            const data = { classRoom, schedule }
            const res = await createOrUpdateSchedule(data)

            if (res.data !== true) {
                throw new Error(res.data.error)
            }

            renderNoti({
                type: "success",
                title: "Thành công",
                message: "Đã cập nhật thời khóa biểu",
            })

            history.push("/gradeAndClass")
        } catch (err) {
            renderNoti({
                type: "warning",
                title: "Lỗi",
                message: err.message,
            })
        }
    }

    const checkFullSchedule = () =>
        Object.values(schedule).every(
            (daySchedule) =>
                daySchedule.length === 5 && daySchedule.every((item) => item),
        )

    const onChangeSchedule = (key, index, value) => {
        let copySchedule = _.cloneDeep(schedule)
        copySchedule[key][index] = value

        setSchedule(copySchedule)
    }

    return (
        <div className="mb-2">
            <Row>
                <Col md={12}>
                    <h5>Cập nhật thời khóa biểu lớp {classRoom}</h5>
                </Col>
                <Col md={12}>
                    <Table
                        bordered
                        striped
                        hover
                        size="sm"
                        responsive
                        style={{ marginBottom: "200px" }}
                    >
                        <thead>
                            <tr>
                                {[
                                    "Thứ hai",
                                    "Thứ ba",
                                    "Thứ tư",
                                    "Thứ năm",
                                    "Thứ sáu",
                                ].map((day, index) => (
                                    <th key={index}>{day}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {[0, 1, 2, 3, 4].map((number) => (
                                <tr key={number}>
                                    {["mon", "tue", "wed", "thu", "fri"].map(
                                        (day, item) => (
                                            <td key={item}>
                                                <FilterSelected
                                                    options={options}
                                                    placeholder=""
                                                    value={
                                                        schedule &&
                                                        schedule[day] && {
                                                            value:
                                                                schedule[day][
                                                                    number
                                                                ],
                                                            label:
                                                                schedule[day][
                                                                    number
                                                                ],
                                                        }
                                                    }
                                                    onChange={(e) => {
                                                        onChangeSchedule(
                                                            day,
                                                            number,
                                                            e.value,
                                                        )
                                                    }}
                                                    isDisabled={
                                                        number + item === 0 ||
                                                        number + item === 8
                                                    }
                                                />
                                            </td>
                                        ),
                                    )}
                                </tr>
                            ))}
                        </tbody>
                        <Button
                            color="success"
                            className="mt-2"
                            onClick={onUpdateSchedule}
                        >
                            Cập nhật
                        </Button>
                    </Table>
                </Col>
            </Row>
        </div>
    )
}
