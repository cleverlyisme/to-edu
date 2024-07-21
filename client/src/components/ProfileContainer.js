import React from "react"
import { connect } from "react-redux"
import { Link } from "react-router-dom"
import styled from "styled-components"
import moment from "moment"

import AdminBlock from "./Admin/AdminBlock"

const Bold = styled.span`
    font-weight: 500;
`

const ProfileContainer = (props) => {
    const { userInformation } = props
    const isParent = userInformation.role === "parent"
    const isTeacher = userInformation.role === "teacher"

    const profileTitle = (
        <div className="d-flex align-items-center">
            <i className="fas fa-user mr-2" />
            <span>Thông tin cá nhân</span>
            <div className="flex-grow-1 text-right">
                <Link to="/profile">Edit</Link>
            </div>
        </div>
    )

    return (
        <div className={props.className && props.className}>
            <AdminBlock title={profileTitle}>
                {isParent && (
                    <div>
                        <p>
                            ID: <Bold>{userInformation.studentId}</Bold>
                        </p>
                        <p>
                            Họ và tên:{" "}
                            <Bold>{userInformation.studentName}</Bold>
                        </p>
                        <p>
                            Giới tính:{" "}
                            <Bold>{userInformation.gender ? "Nam" : "Nữ"}</Bold>
                        </p>
                        <p>
                            Khối: <Bold>{userInformation.grade}</Bold>
                        </p>
                        <p>
                            Lớp: <Bold>{userInformation.classRoom}</Bold>
                        </p>
                        <p>
                            Ngày sinh:{" "}
                            <Bold>
                                {moment(userInformation.dateOfBirth).format(
                                    "DD/MM/YYYY"
                                )}
                            </Bold>
                        </p>
                        <p>
                            Địa chỉ: <Bold>{userInformation.address}</Bold>
                        </p>
                        {userInformation.father.name && (
                            <p>
                                Họ và tên bố:{" "}
                                <Bold>{userInformation.father.name}</Bold>
                            </p>
                        )}

                        {userInformation.father.phoneNumber && (
                            <p>
                                Số điện thoại bố:{" "}
                                <Bold>
                                    {userInformation.father.phoneNumber}
                                </Bold>
                            </p>
                        )}

                        {userInformation.mother.name && (
                            <p>
                                Họ và tên mẹ:{" "}
                                <Bold>{userInformation.mother.name}</Bold>
                            </p>
                        )}

                        {userInformation.mother.phoneNumber && (
                            <p>
                                Số điện thoại mẹ:{" "}
                                <Bold>
                                    {userInformation.mother.phoneNumber}
                                </Bold>
                            </p>
                        )}

                        {userInformation.note && (
                            <p>
                                Ghi chú: <Bold>{userInformation.note}</Bold>
                            </p>
                        )}
                    </div>
                )}

                {isTeacher && (
                    <div>
                        <p>
                            Họ và tên: <Bold>{userInformation.name}</Bold>
                        </p>
                        <p>
                            Giới tính:{" "}
                            <Bold>{userInformation.gender ? "Nam" : "Nữ"}</Bold>
                        </p>
                        <p>
                            Năm sinh: <Bold>{userInformation.yearOfBirth}</Bold>
                        </p>
                        <p>
                            Email: <Bold>{userInformation.email}</Bold>
                        </p>
                        <p>
                            Số điện thoại:{" "}
                            <Bold>{userInformation.phoneNumber}</Bold>
                        </p>
                        {userInformation.mainTeacherOfClass &&
                            userInformation.mainTeacherOfClass.trim() && (
                                <p>
                                    Giáo viên chủ nhiệm lớp:{" "}
                                    <Bold>
                                        {userInformation.mainTeacherOfClass}
                                    </Bold>
                                </p>
                            )}
                        <p>
                            Môn học: <Bold>{userInformation.subject}</Bold>
                        </p>
                        <p>
                            Các lớp đang dạy:{" "}
                            <Bold>
                                {userInformation.teacherOfClass.join(", ")}
                            </Bold>
                        </p>
                    </div>
                )}
            </AdminBlock>
        </div>
    )
}

const mapStateToProps = (state) => ({
    userInformation: state.user.userInformation,
})

export default connect(mapStateToProps, null)(ProfileContainer)
