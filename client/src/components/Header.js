import React, { useState, useEffect } from "react"
import { connect } from "react-redux"
import styled from "styled-components"
import history from "../config/history"

import changeOptionNavigate from "../redux/action/changeOptionNavigate"
import setUserInformation from "../redux/action/setUserInformation"
import setTime from "../redux/action/setTime"
import ChangePasswordModal from "./ChangePasswordModal"

const HeaderContainer = styled.div`
    width: ${(props) => `calc(100vw - ${props.option})`};
    padding-right: 16px;
    height: 55px;
    position: fixed;
    top: 0;
    left: ${(props) => props.option};
    background-color: #343a40;
    transition: 0.2s ease;
    display: flex;
    align-items: center;
    color: #fff;
`

const NavigateButton = styled.span`
    transition: 0.2s ease;
    padding: 32px;
    width: 32px;
    height: 32px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1.25rem;
    cursor: pointer;
`
const UserInfoContainer = styled.div`
    flex-grow: 1;
    display: flex;
    justify-content: flex-end;
    padding-right: 16px;
`

const UserInfo = styled.span`
    cursor: pointer;
    white-space: nowrap;
`

const UserOption = styled.div`
    position: fixed;
    top: 50px;
    right: 16px;
    border-radius: 4px;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.4);
    color: #555;
    background-color: #fff;
    display: ${(props) => (props.show ? "block" : "none")};
    p {
        padding: 8px 16px;
        margin-bottom: 0;
        cursor: pointer;
        border-radius: 4px;
    }
    p:hover {
        background-color: #ddd;
    }
    div {
        padding: 8px 16px;
        margin-bottom: 0;
        border-radius: 4px;
    }
`

const changeWidthNavigate = (props) => {
    switch (props.option) {
        case "0px":
            props.changeOptionNavigate("70px")
            break
        case "70px":
            props.changeOptionNavigate("200px")
            break
        case "200px":
            props.changeOptionNavigate("0px")
            break
        default:
            break
    }
}

function Header(props) {
    const [userInfo, setUserInfo] = useState("")
    const [show, setShow] = useState(false)
    const [isOpen, toggle] = useState(false)

    useEffect(() => {
        if (
            props.userInformation &&
            Object.keys(props.userInformation).length > 0
        ) {
            if (props.userInformation.role === "parent") {
                setUserInfo(props.userInformation.studentName)
            } else {
                setUserInfo(props.userInformation.email)
            }
        }

        props.setTime()
    }, [props.userInformation])

    const signOut = () => {
        props.setUserInformation({ data: {} })
        localStorage.removeItem("access_token")
        localStorage.removeItem("refresh_token")
        localStorage.removeItem("access_from")
        history.push("/login")
        props.changeOptionNavigate("0px")
    }

    return (
        <HeaderContainer {...props}>
            <ChangePasswordModal
                isOpen={isOpen}
                toggle={() => toggle(!isOpen)}
            />
            <NavigateButton
                {...props}
                onClick={() => changeWidthNavigate(props)}
            >
                {props.option === "0px" ? (
                    <i className="fas fa-bars"></i>
                ) : props.option === "70px" ? (
                    <i className="fas fa-arrow-right"></i>
                ) : (
                    <i className="fas fa-arrow-left"></i>
                )}
            </NavigateButton>
            <UserInfoContainer>
                <UserInfo onClick={() => setShow(!show)}>
                    <i className="fas fa-user"></i>{" "}
                    <i className="fas fa-sort-down"></i>
                </UserInfo>
                <UserOption show={show}>
                    <div>{userInfo}</div>
                    {props.userInformation &&
                        ["teacher", "parent"].includes(
                            props.userInformation.role
                        ) && (
                            <p
                                onClick={() => {
                                    setShow(false)
                                    history.push("/profile")
                                }}
                            >
                                Trang cá nhân
                            </p>
                        )}
                    {props.userInformation?.role && (
                        <p
                            onClick={() => {
                                setShow(false)
                                toggle(!isOpen)
                            }}
                        >
                            Đổi mật khẩu
                        </p>
                    )}
                    <p onClick={signOut}>Đăng xuất</p>
                </UserOption>
            </UserInfoContainer>
        </HeaderContainer>
    )
}

const mapStateToProps = (state) => ({
    userInformation: state.user.userInformation,
    option: state.navigate.option,
})

const mapDispatchToProps = {
    changeOptionNavigate,
    setUserInformation,
    setTime,
}

export default connect(mapStateToProps, mapDispatchToProps)(Header)
