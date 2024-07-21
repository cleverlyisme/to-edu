import React, { useEffect, useState } from "react"
import { Router, Route, Switch } from "react-router-dom"
import history from "../config/history"
import { connect } from "react-redux"
import styled from "styled-components"

import routes from "../config/routes"

import PrivateRoute from "./PrivateRoute"
import Login from "../pages/Login"
import Navigate from "./Navigate"
import Header from "./Header"
import Footer from "./Footer"
import Updating from "../pages/Updating"
import Page404 from "../pages/Page404"

import getUserInformation from "../redux/action/getUserInformation"

const ContentContainer = styled.div`
    transition: 0.2s ease;
    padding-left: ${(props) => props.option};
    width: 100%;
    padding-top: 65px;
`

function Layout(props) {
    const [pathName, setPathName] = useState(window.location.pathname)
    // check if user is login
    useEffect(() => {
        if (
            !props.role &&
            !window.location.pathname.includes("/resetPassword")
        ) {
            props.getUserInformation().then((status) => {
                if (!status) {
                    localStorage.removeItem("access_token")
                    localStorage.removeItem("refresh_token")
                    localStorage.removeItem("access_from")
                    history.push("/login")
                }
            })
        }
    }, [])

    history.listen((location) => {
        setPathName(location.pathname)
    })

    return (
        <div className="min-vh-100vh d-flex">
            {props.role && <Navigate pathName={pathName} />}
            <div style={{ zIndex: 9999 }}>{props.role && <Header />}</div>
            <ContentContainer {...props}>
                <Router history={history}>
                    <Switch>
                        {routes.map((route) => (
                            <PrivateRoute exact key={route.path} {...route} />
                        ))}
                        <Route path="/login" exact component={Login} />
                        <Route path="/updating" exact component={Updating} />
                        <Route component={Page404} />
                    </Switch>
                </Router>
                {props.role && <Footer />}
            </ContentContainer>
        </div>
    )
}

const mapStateToProps = (state) => ({
    role: state.user?.userInformation?.role,
    option: state.navigate.option,
})

const mapDispatchToProps = {
    getUserInformation,
}

export default connect(mapStateToProps, mapDispatchToProps)(Layout)
