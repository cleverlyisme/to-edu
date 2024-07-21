import React, { useEffect, useState } from "react"
import { withFormik, Form, Field } from "formik"
import * as yup from "yup"
import {
    Input,
    Label,
    FormGroup,
    Button,
    Row,
    Col,
    CustomInput,
} from "reactstrap"

import YearSelected from "../../components/selecteds/YearSelected"
import FilterSelected from "../../components/selecteds/FilterSelected"
import Feedback from "../../components/common/Feedback"
import LabelRequired from "../../components/common/LabelRequired"
import AllClassSelected from "../../components/selecteds/AllClassSelected"
import BackBtn from "../../components/buttons/BackBtn"

import Schedule from "../../components/Schedule"

import history from "../../config/history"
import renderNoti from "../../utils/renderNoti"

import {
    getAllSubject,
    getTeacherData,
    createTeacher,
    updateTeacher,
    updateProfile,
} from "../../utils/api/fetchData"

const genderOptions = [
    { value: false, label: "Nữ" },
    { value: true, label: "Nam" },
]

const yearOfBirthRegex = /^\d{4}$/g
const phoneNumberRegex = /^0\d{9}$/g

const CreateTeacher = (props) => {
    const teacherId = props.id
    const id = props.match?.params?.id || teacherId

    const [filterSubject, setFilterSubject] = useState([])

    useEffect(() => {
        getData()
    }, [])

    const getData = () => {
        if (!teacherId) {
            getAllSubject().then((res) => {
                const options = res.data
                    .sort()
                    .map((c) => ({ label: c, value: c }))
                setFilterSubject(options)
            })
        }

        if (id) {
            // get teacher data here
            getTeacherData(id).then((res) => {
                const data = res.data
                props.setFieldValue("name", data.name)
                props.setFieldValue("yearOfBirth", data.yearOfBirth)
                props.setFieldValue("gender", data.gender)
                props.setFieldValue("email", data.email)
                props.setFieldValue("phoneNumber", data.phoneNumber)
                props.setFieldValue(
                    "mainTeacher",
                    data.mainTeacherOfClass && data.mainTeacherOfClass.trim()
                )
                props.setFieldValue(
                    "mainTeacherOfClass",
                    data.mainTeacherOfClass
                )
                props.setFieldValue("subject", data.subject)
                props.setFieldValue("teacherOfClass", data.teacherOfClass)
            })
        }
    }

    const {
        name,
        yearOfBirth,
        gender,
        email,
        phoneNumber,
        mainTeacher,
        mainTeacherOfClass,
        subject,
        teacherOfClass,
    } = props.values

    return (
        <Form className="mb-2">
            <Row>
                <Col md={12} className="d-flex align-items-start">
                    <div className="flex-grow-1">
                        <h5 className="mb-2">
                            {id ? "CẬP NHẬT" : "TẠO MỚI"}{" "}
                            {teacherId ? "PROFILE" : "GIÁO VIÊN"}
                        </h5>
                    </div>

                    {!teacherId && (
                        <BackBtn
                            title="trang chủ"
                            onClick={() => history.push("/")}
                        />
                    )}
                </Col>
                <Col md={4} className="text-right"></Col>
            </Row>

            <Row>
                <Col md={6}>
                    <FormGroup>
                        <LabelRequired>Họ và tên giáo viên</LabelRequired>
                        <Field
                            name="name"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    placeholder="Họ và tên giáo viên"
                                />
                            )}
                        />
                        {props.touched.name && (
                            <Feedback>{props.errors.name}</Feedback>
                        )}
                    </FormGroup>

                    <FormGroup>
                        <LabelRequired>Năm sinh</LabelRequired>
                        <YearSelected
                            name="yearOfBirth"
                            onChange={(e) =>
                                props.setFieldValue("yearOfBirth", e.value)
                            }
                            value={
                                yearOfBirth && {
                                    label: yearOfBirth,
                                    value: yearOfBirth,
                                }
                            }
                        />
                        {props.touched.yearOfBirth && (
                            <Feedback>{props.errors.yearOfBirth}</Feedback>
                        )}
                    </FormGroup>

                    <FormGroup>
                        <LabelRequired>Giới tính</LabelRequired>
                        <FilterSelected
                            name="gender"
                            placeholder="Chọn giới tính"
                            options={genderOptions}
                            onChange={(e) =>
                                props.setFieldValue("gender", e.value)
                            }
                            value={
                                gender !== null && {
                                    value: gender,
                                    label: gender ? "Nam" : "Nữ",
                                }
                            }
                        />
                        {props.touched.gender && (
                            <Feedback>{props.errors.gender}</Feedback>
                        )}
                    </FormGroup>

                    <FormGroup>
                        <LabelRequired>Email</LabelRequired>
                        <Field
                            name="email"
                            render={({ field }) => (
                                <Input {...field} placeholder="Email" />
                            )}
                        />
                        {props.touched.email && (
                            <Feedback>{props.errors.email}</Feedback>
                        )}
                    </FormGroup>
                </Col>

                <Col md={6}>
                    <FormGroup>
                        <LabelRequired>Số điện thoại</LabelRequired>
                        <Field
                            name="phoneNumber"
                            render={({ field }) => (
                                <Input {...field} placeholder="Số điện thoại" />
                            )}
                        />
                        {props.touched.phoneNumber && (
                            <Feedback>{props.errors.phoneNumber}</Feedback>
                        )}
                    </FormGroup>

                    <FormGroup className="d-flex flex-column">
                        <div className="d-flex">
                            <Label className="mr-2">Chủ nhiệm</Label>
                            <CustomInput
                                type="checkbox"
                                id="mainTeacher"
                                onChange={(e) => {
                                    props.setFieldValue(
                                        "mainTeacher",
                                        e.target.checked
                                    )
                                    if (!e.target.checked) {
                                        props.setFieldValue(
                                            "mainTeacherOfClass",
                                            ""
                                        )
                                    }
                                }}
                                checked={mainTeacher}
                                disabled={teacherId}
                            />
                        </div>
                        <div>
                            <AllClassSelected
                                isDisabled={
                                    !props.values.mainTeacher || teacherId
                                }
                                onChange={(e) => {
                                    props.setFieldValue(
                                        "mainTeacherOfClass",
                                        e.value
                                    )
                                }}
                                value={
                                    mainTeacherOfClass &&
                                    mainTeacherOfClass.trim() && {
                                        value: mainTeacherOfClass,
                                        label: mainTeacherOfClass,
                                    }
                                }
                                viewOnly={teacherId}
                            />
                            {props.touched.mainTeacherOfClass && (
                                <Feedback>
                                    {props.errors.mainTeacherOfClass}
                                </Feedback>
                            )}
                        </div>
                    </FormGroup>
                    <FormGroup>
                        <LabelRequired>Dạy môn</LabelRequired>
                        <FilterSelected
                            placeholder="Select subject"
                            className="flex-grow-1 mr-1"
                            options={filterSubject}
                            onChange={(e) => {
                                props.setFieldValue("subject", e.value)
                            }}
                            value={
                                subject && { value: subject, label: subject }
                            }
                            isDisabled={teacherId}
                        />
                        {props.touched.subject && (
                            <Feedback>{props.errors.subject}</Feedback>
                        )}
                    </FormGroup>
                    <FormGroup className="d-flex flex-column">
                        <Label>Các lớp đang dạy</Label>
                        <AllClassSelected
                            isMulti
                            onChange={(e) => {
                                props.setFieldValue(
                                    "teacherOfClass",
                                    e ? e.map((item) => item.value) : []
                                )
                            }}
                            value={
                                teacherOfClass &&
                                teacherOfClass.length > 0 &&
                                teacherOfClass.map((item) => ({
                                    value: item,
                                    label: item,
                                }))
                            }
                            isDisabled={teacherId}
                            viewOnly={teacherId}
                        />
                        {props.touched.teacherOfClass && (
                            <Feedback>{props.errors.teacherOfClass}</Feedback>
                        )}
                    </FormGroup>
                </Col>
            </Row>

            {id && <Schedule teacherId={id} />}

            <Button color="success" onClick={props.handleSubmit}>
                {id ? "Cập nhật" : "Tạo mới"}
            </Button>
        </Form>
    )
}

export default withFormik({
    mapPropsToValues: () => ({
        name: "",
        yearOfBirth: "",
        gender: null,
        email: "",
        phoneNumber: "",
        mainTeacher: false,
        mainTeacherOfClass: "",
        subject: "",
        teacherOfClass: [],
    }),
    validationSchema: yup.object().shape({
        name: yup.string().required("Họ và tên không được để trống"),
        yearOfBirth: yup
            .string()
            .required("Năm sinh không được để trống")
            .matches(yearOfBirthRegex, "Năm sinh không hợp lệ"),
        gender: yup
            .boolean()
            .required("Giới tính không được để trống")
            .nullable(),
        email: yup
            .string()
            .required("Email không được để trống")
            .email("Email không hợp lệ"),
        phoneNumber: yup
            .string()
            .required("Số điện thoại không được để trống")
            .matches(phoneNumberRegex, "Số điện thoại không hợp lệ"),
        mainTeacher: yup.boolean(),
        mainTeacherOfClass: yup.string().when("mainTeacher", {
            is: true,
            then: yup.string().required("Chọn lớp đang chủ nhiệm"),
        }),
        subject: yup.string().required("Môn học không được để trống"),
        teacherOfClass: yup
            .string()
            .required("Các lớp đang dạy không được để trống")
            .min(1, "Các lớp đang dạy không được để trống"),
    }),
    handleSubmit: async (values, { props }) => {
        try {
            const teacherId = props.id
            const id = props.match?.params?.id || teacherId

            const res = await (id
                ? (teacherId ? updateProfile : updateTeacher)(
                      values,
                      id,
                      "teacher"
                  )
                : createTeacher(values))

            if (res.data && res.data.error) {
                throw new Error(res.data.error)
            }

            renderNoti({
                type: "success",
                title: "Thành công",
                message: `Đã ${id ? "cập nhật" : "tạo mới"} giáo viên`,
            })
            history.push("/")
        } catch (err) {
            renderNoti({
                type: "danger",
                title: "Lỗi",
                message: err.message,
            })
        }
    },
})(CreateTeacher)
