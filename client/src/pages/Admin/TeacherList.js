import React, { useState, useEffect } from "react"
import { connect } from "react-redux"
import { Table, Row, Col, Alert } from "reactstrap"

import history from "../../config/history"
import CreateBtnBig from "../../components/buttons/CreateBtnBig"
import BackBtn from "../../components/buttons/BackBtn"
import DeleteBtn from "../../components/buttons/DeleteBtn"
import SearchBox from "../../components/common/SearchBox"
import FilterSelected from "../../components/selecteds/FilterSelected"
import NewTabLink from "../../components/common/NewTabLink"
import Pagination from "../../components/common/Pagination"

import renderNoti from "../../utils/renderNoti"
import getAllUser from "../../redux/action/getAllUser"
import setModal from "../../redux/action/setModal"
import {
    getAllClass,
    getAllSubject,
    deleteUser,
} from "../../utils/api/fetchData"

const TeacherList = (props) => {
    const [searchString, setSearchString] = useState("")
    const [optionClass, setOptionClass] = useState("")
    const [optionSubject, setOptionSubject] = useState("")
    const [filterClassTeacher, setFilterClassTeacher] = useState([])
    const [filterSubject, setFilterSubject] = useState([])
    const [data, setData] = useState([])

    const [currentPage, setCurrentPage] = useState(1)
    const [totalPage, setTotalPage] = useState(1)
    const [totalUser, setTotalUser] = useState(0)

    const [isOpen, toggle] = useState(false)

    const getData = () => {
        props
            .getAllUser(
                "teacher",
                searchString,
                optionClass,
                "",
                optionSubject,
                currentPage
            )
            .then((res) => {
                setData(res.data)
                setTotalPage(res.totalPage)
                setTotalUser(res.totalUser)
            })
            .catch((err) => {
                renderNoti({
                    type: "danger",
                    title: "Lỗi",
                    message: "Lỗi trong khi lấy dữ liệu",
                })
            })
    }

    useEffect(() => {
        getAllClass().then((res) => {
            const options = res.data.map((c) => ({ label: c, value: c }))
            setFilterClassTeacher(options)
        })

        getAllSubject().then((res) => {
            const options = res.data.sort().map((c) => ({ label: c, value: c }))
            setFilterSubject(options)
        })
    }, [])

    useEffect(() => {
        getData()
        //eslint-disable-next-line
    }, [optionClass, optionSubject, currentPage])

    const deleteTeacher = (id) => {
        deleteUser("teacher", id)
            .then(() =>
                renderNoti({
                    title: "Thành công",
                    message: "Đã xóa giáo viên",
                    type: "success",
                })
            )
            .then(() => getData())
            .catch((err) => {
                renderNoti({
                    type: "danger",
                    title: "Lỗi",
                    message: "Lỗi trong khi xóa giáo viên",
                })
            })
    }

    return (
        <div>
            <Row className="mb-2">
                <Col md={7}>
                    <h5>
                        DANH SÁCH GIÁO VIÊN{" "}
                        {props.year && `${props.year}-${props.year + 1}`}
                    </h5>
                </Col>
                <Col md={5} className="text-md-right text-md-left">
                    <CreateBtnBig
                        title="giáo viên"
                        className="mr-2"
                        onClick={() => history.push("/user/teacher/create")}
                    />
                    <BackBtn
                        title="trang chủ"
                        onClick={() => history.push("/")}
                    />
                </Col>
            </Row>
            <Row className="mb-2">
                <Col md={6}>
                    <SearchBox
                        onChange={(e) => setSearchString(e.target.value)}
                        onSearch={() => {
                            if (currentPage !== 1) {
                                setCurrentPage(1)
                            } else {
                                getData()
                            }
                        }}
                    />
                </Col>
                <Col md={3}>
                    <FilterSelected
                        isClearable
                        placeholder="Lọc theo môn học"
                        className="mb-2"
                        options={filterSubject}
                        onChange={(e) => {
                            setCurrentPage(1)
                            if (e) {
                                setOptionSubject(e.value)
                            } else {
                                setOptionSubject("")
                            }
                        }}
                    />
                </Col>
                <Col md={3}>
                    <FilterSelected
                        isClearable
                        placeholder="Lọc theo lớp"
                        options={filterClassTeacher}
                        onChange={(e) => {
                            setCurrentPage(1)
                            if (e) {
                                setOptionClass(e.value)
                            } else {
                                setOptionClass("")
                            }
                        }}
                        value={
                            optionClass && {
                                value: optionClass,
                                label: optionClass,
                            }
                        }
                    />
                </Col>
            </Row>
            <Row className="mb-2">
                <Col md={12} className="text-right">
                    <b>Tổng số giáo viên: {totalUser}</b>
                </Col>
            </Row>
            <Row>
                <Col md={12}>
                    {data && data.length > 0 ? (
                        <Table bordered striped hover size="sm" responsive>
                            <thead>
                                <tr>
                                    {[
                                        "Tên",
                                        "Giới tính",
                                        "Năm sinh",
                                        "Email",
                                        "Số điện thoại",
                                        "Môn học",
                                        "Các lớp đang dạy",
                                        "Các lớp chủ nhiệm",
                                        "",
                                    ].map((item, index) => (
                                        <th key={index} className="align-top">
                                            {item}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((teacher, index) => (
                                    <tr key={index}>
                                        <td>
                                            <NewTabLink
                                                title={teacher.name}
                                                to={`/user/teacher/edit/${teacher._id}`}
                                            />
                                        </td>
                                        <td>{teacher.gender ? "Nam" : "Nữ"}</td>
                                        <td>{teacher.yearOfBirth}</td>
                                        <td>{teacher.email}</td>
                                        <td>{teacher.phoneNumber}</td>
                                        <td>{teacher.subject}</td>
                                        <td>
                                            {teacher.teacherOfClass.join(", ")}
                                        </td>
                                        <td>{teacher.mainTeacherOfClass}</td>
                                        <td className="text-center">
                                            <DeleteBtn
                                                onClick={() => {
                                                    props.setModal({
                                                        isOpen: true,
                                                        message:
                                                            "Bạn có chắc muốn xóa giáo viên này ?",
                                                        type: "warning",
                                                        onConfirm: () =>
                                                            deleteTeacher(
                                                                teacher._id
                                                            ),
                                                    })
                                                }}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    ) : (
                        <Alert color="primary">Không có giáo viên</Alert>
                    )}
                </Col>
            </Row>
            <Pagination
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                totalPage={totalPage}
            />
        </div>
    )
}

const mapStateToProps = (state) => ({
    year: state.time.year,
})

const mapDispatchToProps = {
    getAllUser,
    setModal,
}

export default connect(mapStateToProps, mapDispatchToProps)(TeacherList)
