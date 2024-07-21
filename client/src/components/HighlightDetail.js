import React, { useEffect } from "react"
import { connect } from "react-redux"
import { Link } from "react-router-dom"
import { Row, Col } from "reactstrap"
import moment from "moment"

import DeleteBtn from "../components/buttons/DeleteBtn"
import { deleteHighlight } from "../utils/api/fetchData"
import renderNoti from "../utils/renderNoti"
import setModal from "../redux/action/setModal"

const HighlightDetail = ({ highlight, afterDelete, setModal, role }) => {
    const { _id, title, content, time } = highlight

    const removeHighlight = (id) => {
        try {
            setModal({
                isOpen: true,
                type: "warning",
                message: "Do you want to delete this highlight ?",
                onConfirm: async () => {
                    const res = await deleteHighlight(id)

                    if (res.data !== true) {
                        throw new Error("Delete highlight failed")
                    }

                    renderNoti({
                        type: "success",
                        title: "Success",
                        message: "Delete highlight successfully",
                    })
                    afterDelete()
                },
            })
        } catch (err) {
            renderNoti({
                type: "danger",
                title: "Failed",
                message: err.message,
            })
        }
    }

    {
        /* remove tag in html content */
    }

    const htmlContent = document.createElement("p")
    htmlContent.innerHTML = content
    const pureContent = htmlContent.innerText

    useEffect(() => {
        return () => htmlContent.remove()
    }, [])

    return (
        <Row className="mb-2">
            <Col md={12} className="d-flex flex-column">
                <div className="d-flex align-items-start">
                    <Link to={`highlight/edit/${_id}`} className="flex-grow-1">
                        <b>{title}</b>
                    </Link>
                    {role === "admin" && (
                        <DeleteBtn onClick={() => removeHighlight(_id)} />
                    )}
                </div>
                <p className="mb-2" style={{ fontSize: "0.7rem" }}>
                    Cập nhật lần cuối lúc{" "}
                    {time ? moment(time).format("HH:mm DD/MM/YYYY") : ""}
                </p>
                <p className="mb-2">{`${pureContent.slice(0, 300)}${
                    pureContent.length > 300 ? "..." : ""
                }`}</p>
            </Col>
        </Row>
    )
}

const mapDispatchToProps = {
    setModal,
}

export default connect(null, mapDispatchToProps)(HighlightDetail)
