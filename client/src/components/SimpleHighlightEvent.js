import React from "react"
import moment from "moment"
import { connect } from "react-redux"
import { Link } from "react-router-dom"

import DeleteBtn from "./buttons/DeleteBtn"
import { deleteEvent } from "../utils/api/fetchData"
import setModal from "../redux/action/setModal"
import getEvent from "../redux/action/getEvent"
import renderNoti from "../utils/renderNoti"

const SimpleHighlightEvent = ({
    item,
    isHighlight,
    onOpenModal,
    setModal,
    getEvent,
}) => {
    const htmlContent = document.createElement("p")
    htmlContent.innerHTML = item.content
    const pureContent = htmlContent.innerText

    const removeEvent = (id) => {
        setModal({
            isOpen: true,
            type: "warning",
            message: "Bạn có chắc chắn muốn xóa sự kiện này ?",
            onConfirm: () => {
                deleteEvent(id)
                    .then(() => {
                        renderNoti({
                            type: "success",
                            title: "Thành công",
                            message: "Đã xóa sự kiện",
                        })
                        getEvent()
                    })
                    .catch(() => {
                        renderNoti({
                            type: "danger",
                            title: "Lỗi",
                            message: "Lỗi trong khi xóa sự kiện",
                        })
                    })
            },
        })
    }

    return (
        <div>
            <div
                style={{
                    padding: "8px 16px",
                    marginBottom: "8px",
                    borderRadius: "20px",
                    backgroundColor: isHighlight ? "royalblue" : "tomato",
                    display: "inline-block",
                    color: "#fff",
                }}
            >
                {moment(item.time).format("DD/MM/YYYY")}
            </div>
            <div className="d-flex">
                <Link
                    to={isHighlight && `highlight/edit/${item._id}`}
                    onClick={() => {
                        if (!isHighlight) {
                            onOpenModal(item)
                        }
                    }}
                    className="flex-grow-1"
                >
                    <b style={{ wordBreak: "break-all" }}>
                        {isHighlight ? item.title : item.content}
                    </b>
                </Link>
                {!isHighlight && (
                    <div className="mr-4">
                        <DeleteBtn onClick={() => removeEvent(item._id)} />
                    </div>
                )}
            </div>
            {isHighlight && (
                <div className="mb-2">{`${pureContent.slice(0, 200)}${
                    pureContent.length > 200 ? "..." : ""
                }`}</div>
            )}
        </div>
    )
}

const mapDispatchToProps = {
    setModal,
    getEvent,
}

export default connect(null, mapDispatchToProps)(SimpleHighlightEvent)
