import React from "react"

export default ({ onClick }) => (
    <div
        className="text-center"
        style={{ cursor: "pointer" }}
        onClick={onClick}
        title="Xóa"
    >
        <i className="far fa-trash-alt"></i>
    </div>
)
