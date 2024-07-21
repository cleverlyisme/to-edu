import React from "react"
import ReactDOM from "react-dom"
import { Provider } from "react-redux"
import store from "./redux/store"

import "bootstrap/dist/css/bootstrap.min.css"
import "react-perfect-scrollbar/dist/css/styles.css"
import "react-calendar/dist/Calendar.css"
import "./index.css"

import ReactNotification from "react-notifications-component"

import "animate.css"
import "react-notifications-component/dist/theme.css"

import Modal from "./components/modal"

import Layout from "./components/Layout"

import Loading from "./components/Loading"

function App() {
    return (
        <Provider store={store}>
            <div className="App min-vh-100">
                <Modal />
                <ReactNotification />
                <div className="px-3">
                    <Layout />
                </div>
                <Loading />
            </div>
        </Provider>
    )
}

ReactDOM.render(<App />, document.getElementById("root"))
