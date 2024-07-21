import React, { useState, useEffect } from "react"
import history from "../../config/history"
import _ from "lodash"
import DatePicker from "react-datepicker"
import { Row, Col, Input, Label, Button } from "reactstrap"
import Selected from "react-select"

import "react-datepicker/dist/react-datepicker.css"

import Schedule from "../../components/Schedule"
import TeacherOfClass from "../../components/TeacherOfClass"
import FilterSelected from "../../components/selecteds/FilterSelected"
import YearSelected from "../../components/selecteds/YearSelected"
import GradeSelected from "../../components/selecteds/GradeSelected"

import BackBtn from "../../components/buttons/BackBtn"

import renderNoti from "../../utils/renderNoti"

import validation from "../../utils/validation"
import {
    getStudentData,
    getAllClassOfGrade,
    createStudent,
    updateStudent,
    updateProfile,
} from "../../utils/api/fetchData"

export default function (props) {
    const studentId = props.id
    const id = props.match?.params?.id || studentId

    const genderOptions = [
        { value: true, label: "Nam" },
        { value: false, label: "Nữ" },
    ]

    const [state, setState] = useState({
        name: {
            value: "",
            field: "name",
            invalid: false,
        },
        gender: {
            value: "",
            field: "gender",
            invalid: false,
        },
        grade: {
            value: "",
            field: "grade",
            invalid: false,
        },
        classRoom: {
            value: "",
            field: "classRoom",
            invalid: false,
        },
        dateOfBirth: {
            value: "",
            field: "dateOfBirth",
            invalid: false,
        },
        address: {
            value: "",
        },
        note: {
            value: "",
        },
        father: {
            name: "",
            yearOfBirth: "",
            phoneNumber: "",
            note: "",
            invalid: false,
        },
        mother: {
            name: "",
            yearOfBirth: "",
            phoneNumber: "",
            note: "",
            invalid: false,
        },
    })

    const [classOptions, setClassOptions] = useState([])

    // load student data
    useEffect(() => {
        getData()
    }, [])

    const getData = () => {
        if (id) {
            getStudentData(id).then((res) => {
                const {
                    studentName,
                    gender,
                    grade,
                    classRoom,
                    dateOfBirth,
                    address,
                    note,
                    father,
                    mother,
                    _id,
                    studentId,
                } = res.data

                if (!studentId) {
                    getAllClassOfGrade(grade).then((res) => {
                        const options = res.data.map((option) => ({
                            value: option,
                            label: option,
                        }))
                        setClassOptions(options)
                    })
                }

                setState({
                    name: {
                        ...state.name,
                        value: studentName,
                    },
                    gender: {
                        ...state.gender,
                        value: gender,
                    },
                    grade: {
                        ...state.grade,
                        value: grade,
                    },
                    classRoom: {
                        ...state.classRoom,
                        value: classRoom,
                    },
                    dateOfBirth: {
                        ...state.dateOfBirth,
                        value: dateOfBirth,
                    },
                    address: {
                        value: address,
                    },
                    note: {
                        value: note,
                    },
                    father: {
                        ...father,
                        invalid: false,
                    },
                    mother: {
                        ...mother,
                        invalid: false,
                    },
                    _id,
                    studentId,
                })
            })
        }
    }

    const checkSingleInput = (key) => {
        if (
            (!key.value && key.field !== "gender") ||
            (key.field === "gender" && key.value === "") ||
            (key.value && !key.value.toString().trim())
        ) {
            setState({
                ...state,
                [key.field]: {
                    ...key,
                    invalid: true,
                },
            })
        } else {
            setState({
                ...state,
                [key.field]: {
                    ...key,
                    invalid: false,
                },
            })
        }
    }

    const checkPhoneNummber = (phoneNumber) => {
        if (validation.phoneNumber(phoneNumber)) {
            return true
        }

        return false
    }

    const ErrorMessage = (key) => (
        <p
            className="mb-2 text-danger"
            style={{
                display: key.invalid ? "block" : "none",
                fontSize: "0.75rem",
            }}
        >
            {_.capitalize(_.startCase(key.field).toLowerCase())} is empty
        </p>
    )

    const canSubmit = () => {
        const {
            name,
            gender,
            grade,
            classRoom,
            dateOfBirth,
            father,
            mother,
        } = state
        const arr = [name, gender, grade, classRoom, dateOfBirth]

        const fatherValid =
            father.name.trim() &&
            father.yearOfBirth.trim() &&
            father.phoneNumber.trim()
        const motherValid =
            mother.name.trim() &&
            mother.yearOfBirth.trim() &&
            mother.phoneNumber.trim()

        const phoneNumberNotEmpty =
            father.phoneNumber.trim().length > 0 ||
            mother.phoneNumber.trim().length > 0

        let flag = true

        for (let item of arr) {
            if (!item.value.toString().trim()) {
                flag = false
            }
        }

        if (!flag) {
            renderNoti({
                title: "Lỗi",
                message:
                    "Vui lòng điền đầy đủ các thông tin cơ bản của học sinh",
                type: "danger",
            })
        }

        if (!fatherValid && !motherValid) {
            flag = false
            setState({
                ...state,
                father: {
                    ...father,
                    invalid: true,
                },
                mother: {
                    ...mother,
                    invalid: true,
                },
            })

            renderNoti({
                title: "Lỗi",
                message:
                    "Vui lòng điền đầy đủ các thông tin cơ bản của bố hoặc mẹ",
                type: "danger",
            })
        } else {
            if (fatherValid) {
                setState({
                    ...state,
                    father: {
                        ...father,
                        invalid: false,
                    },
                })
            } else {
                setState({
                    ...state,
                    mother: {
                        ...mother,
                        invalid: false,
                    },
                })
            }
        }

        if (
            phoneNumberNotEmpty &&
            !checkPhoneNummber(father.phoneNumber) &&
            !checkPhoneNummber(mother.phoneNumber)
        ) {
            flag = false
            renderNoti({
                title: "Lỗi",
                message: "Số điện thoại không hợp lệ",
                type: "danger",
            })
        }

        if (
            flag &&
            father.phoneNumber.trim() &&
            mother.phoneNumber.trim() &&
            (!checkPhoneNummber(father.phoneNumber) ||
                !checkPhoneNummber(mother.phoneNumber))
        ) {
            flag = false
            renderNoti({
                title: "Lỗi",
                message: "Số điện thoại không hợp lệ",
                type: "danger",
            })
        }

        if (!flag) return false

        return true
    }

    const onSubmit = () => {
        if (!canSubmit()) {
            return
        }

        let submit = id
            ? studentId
                ? updateProfile
                : updateStudent
            : createStudent

        const {
            name,
            gender,
            grade,
            classRoom,
            dateOfBirth,
            address,
            note,
            father,
            mother,
        } = state
        const data = {
            studentName: name.value,
            gender: gender.value,
            grade: grade.value,
            classRoom: classRoom.value,
            dateOfBirth: dateOfBirth.value,
            address: address.value,
            note: note.value,
            father: {
                name: father.name,
                yearOfBirth: father.yearOfBirth,
                phoneNumber: father.phoneNumber,
                note: father.note,
            },
            mother: {
                name: mother.name,
                yearOfBirth: mother.yearOfBirth,
                phoneNumber: mother.phoneNumber,
                note: mother.note,
            },
        }

        submit(data, id, "parent")
            .then(() =>
                renderNoti({
                    title: "Thành công",
                    message: `Đã ${id ? "cập nhật" : "tạo mới"} học sinh`,
                    type: "success",
                }),
            )
            .then(() => history.push("/"))
    }

    const {
        name,
        gender,
        grade,
        classRoom,
        dateOfBirth,
        address,
        note,
        father,
        mother,
    } = state

    return (
        <div className="mb-2">
            <Row>
                <Col md={12} className="d-flex align-items-start">
                    <div className="flex-grow-1">
                        <h5 className="mb-2">
                            {id ? "CẬP NHẬT" : "TẠO MỚI"}{" "}
                            {studentId ? "PROFILE" : "HỌC SINH"}
                        </h5>

                        {id && !studentId && (
                            <Button
                                color="link"
                                className="pl-0"
                                onClick={() =>
                                    history.push(`/student/transcript/${id}`)
                                }
                            >
                                View transcript
                            </Button>
                        )}
                    </div>

                    <BackBtn
                        title="trang chủ"
                        onClick={() => history.push("/")}
                    />
                </Col>
            </Row>

            <Row className="mb-2">
                <Col md={6} sm={12}>
                    <Label>
                        Họ và tên học sinh{" "}
                        <span className="text-danger">*</span>
                    </Label>
                    <Input
                        type="text"
                        placeholder="Họ và tên học sinh"
                        className={!name.invalid ? "mb-2" : ""}
                        value={name.value}
                        onChange={(e) =>
                            setState({
                                ...state,
                                name: {
                                    ...state.name,
                                    value: e.target.value,
                                },
                            })
                        }
                        onBlur={() => checkSingleInput(name)}
                    />
                    {ErrorMessage(name)}

                    <Row className="mb-2">
                        <Col md={4} sm={12}>
                            <Label>
                                Giới tính <span className="text-danger">*</span>
                            </Label>
                            <Selected
                                placeholder="Chọn giới tính"
                                options={genderOptions}
                                value={
                                    gender.value !== ""
                                        ? genderOptions.find(
                                              (option) =>
                                                  option.value === gender.value,
                                          )
                                        : null
                                }
                                onChange={(e) =>
                                    setState({
                                        ...state,
                                        gender: {
                                            ...state.gender,
                                            value: e.value,
                                        },
                                    })
                                }
                                onBlur={() => checkSingleInput(gender)}
                            />
                            {ErrorMessage(gender)}
                        </Col>

                        <Col md={4} sm={12}>
                            <Label>
                                Khối học <span className="text-danger">*</span>
                            </Label>
                            <GradeSelected
                                viewOnly={studentId}
                                isDisabled={studentId}
                                value={
                                    grade.value && {
                                        label: grade.value,
                                        value: grade.value,
                                    }
                                }
                                onChange={(e) => {
                                    setState({
                                        ...state,
                                        grade: {
                                            ...state.grade,
                                            value: e.value,
                                        },
                                        classRoom: {
                                            ...classRoom,
                                            value: e.classRoom[0],
                                        },
                                    })
                                    const classArray = e.classRoom.map(
                                        (item) => ({
                                            value: item,
                                            label: item,
                                        }),
                                    )
                                    setClassOptions(classArray)
                                }}
                                onBlur={() => checkSingleInput(grade)}
                            />
                            {ErrorMessage(grade)}
                        </Col>

                        <Col md={4} sm={12}>
                            <Label>
                                Lớp học <span className="text-danger">*</span>
                            </Label>
                            <FilterSelected
                                placeholder="Chọn lớp học"
                                value={
                                    classRoom.value
                                        ? {
                                              value: classRoom.value,
                                              label: classRoom.value,
                                          }
                                        : ""
                                }
                                options={classOptions}
                                onChange={(e) =>
                                    setState({
                                        ...state,
                                        classRoom: {
                                            ...state.classRoom,
                                            value: e.value,
                                        },
                                    })
                                }
                                onBlur={() => checkSingleInput(classRoom)}
                                isDisabled={!grade.value || studentId}
                            />
                            {ErrorMessage(classRoom)}
                        </Col>
                    </Row>

                    <Row className="mb-2">
                        <Col md={4} sm={12}>
                            <Label className="d-block">
                                Ngày sinh <span className="text-danger">*</span>
                            </Label>
                            <DatePicker
                                dateFormat="dd/MM/yyyy"
                                onChange={(e) =>
                                    setState({
                                        ...state,
                                        dateOfBirth: {
                                            ...state.dateOfBirth,
                                            value: e && e.toString(),
                                        },
                                    })
                                }
                                onBlur={() => checkSingleInput(dateOfBirth)}
                                placeholderText="Chọn ngày sinh"
                                customInput={<Input />}
                                showYearDropdown
                                maxDate={new Date()}
                                selected={
                                    dateOfBirth.value
                                        ? new Date(dateOfBirth.value)
                                        : ""
                                }
                            />
                            {ErrorMessage(dateOfBirth)}
                        </Col>

                        <Col md={8} sm={12}>
                            <Label>Địa chỉ</Label>
                            <Input
                                type="text"
                                placeholder="Địa chỉ"
                                value={address.value ? address.value : ""}
                                onChange={(e) =>
                                    setState({
                                        ...state,
                                        address: {
                                            ...state.address,
                                            value: e.target.value,
                                        },
                                    })
                                }
                            />
                        </Col>
                    </Row>

                    <Row className="mb-3">
                        <Col md={12}>
                            <Label>Ghi chú</Label>
                            <Input
                                type="textarea"
                                placeholder="Ghi chú"
                                value={note.value}
                                onChange={(e) =>
                                    setState({
                                        ...state,
                                        note: {
                                            ...state.note,
                                            value: e.target.value,
                                        },
                                    })
                                }
                            />
                        </Col>
                    </Row>
                </Col>

                <Col md={3} sm={12}>
                    <Label>Họ và tên bố</Label>
                    <Input
                        type="text"
                        placeholder="Họ và tên bố"
                        className="mb-2"
                        value={father && father.name ? father.name : ""}
                        onChange={(e) =>
                            setState({
                                ...state,
                                father: {
                                    ...father,
                                    name: e.target.value,
                                },
                            })
                        }
                    />

                    <Label>Năm sinh bố</Label>
                    <YearSelected
                        className="mb-2"
                        value={
                            father && father.yearOfBirth
                                ? {
                                      value: father.yearOfBirth,
                                      label: father.yearOfBirth,
                                  }
                                : ""
                        }
                        onChange={(e) =>
                            setState({
                                ...state,
                                father: {
                                    ...father,
                                    yearOfBirth: e.value,
                                },
                            })
                        }
                    />

                    <Label>Số điện thoại bố</Label>
                    <Input
                        type="text"
                        placeholder="Số điện thoại bố"
                        className="mb-2"
                        value={
                            father && father.phoneNumber
                                ? father.phoneNumber
                                : ""
                        }
                        onChange={(e) =>
                            setState({
                                ...state,
                                father: {
                                    ...father,
                                    phoneNumber: e.target.value,
                                },
                            })
                        }
                    />

                    <Label>Ghi chú</Label>
                    <Input
                        type="textarea"
                        placeholder="Ghi chú"
                        value={father && father.note ? father.note : ""}
                        onChange={(e) =>
                            setState({
                                ...state,
                                father: {
                                    ...father,
                                    note: e.target.value,
                                },
                            })
                        }
                    />
                </Col>

                <Col md={3} sm={12}>
                    <Label>Họ và tên mẹ</Label>
                    <Input
                        type="text"
                        placeholder="Họ và tên mẹ"
                        className="mb-2"
                        value={mother && mother.name ? mother.name : ""}
                        onChange={(e) =>
                            setState({
                                ...state,
                                mother: {
                                    ...mother,
                                    name: e.target.value,
                                },
                            })
                        }
                    />

                    <Label>Năm sinh mẹ</Label>
                    <YearSelected
                        className="mb-2"
                        value={
                            mother && mother.yearOfBirth
                                ? {
                                      value: mother.yearOfBirth,
                                      label: mother.yearOfBirth,
                                  }
                                : ""
                        }
                        onChange={(e) =>
                            setState({
                                ...state,
                                mother: {
                                    ...mother,
                                    yearOfBirth: e.value,
                                },
                            })
                        }
                    />

                    <Label>Số điện thoại mẹ</Label>
                    <Input
                        type="text"
                        placeholder="Số điện thoại mẹ"
                        className="mb-2"
                        value={
                            mother && mother.phoneNumber
                                ? mother.phoneNumber
                                : ""
                        }
                        onChange={(e) =>
                            setState({
                                ...state,
                                mother: {
                                    ...mother,
                                    phoneNumber: e.target.value,
                                },
                            })
                        }
                    />

                    <Label>Ghi chú</Label>
                    <Input
                        type="textarea"
                        placeholder="Ghi chú"
                        value={mother && mother.note ? mother.note : ""}
                        onChange={(e) =>
                            setState({
                                ...state,
                                mother: {
                                    ...mother,
                                    note: e.target.value,
                                },
                            })
                        }
                    />
                </Col>
            </Row>

            {id && (
                <>
                    <Schedule classRoom={classRoom.value} />
                    <TeacherOfClass classRoom={classRoom.value} />
                </>
            )}

            <Row className="mb-2">
                <Col md={12}>
                    <Button color="success" onClick={onSubmit}>
                        {id ? "Cập nhật" : "Tạo mới"}
                    </Button>
                </Col>
            </Row>
        </div>
    )
}
