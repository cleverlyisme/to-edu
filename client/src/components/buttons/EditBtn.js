import React from "react"

export default ({ title, onClick }) => (
    <span
        className="text-primary"
        style={{ cursor: "pointer" }}
        title={title}
        onClick={onClick}
    >
        <i className="fas fa-edit"></i>
    </span>
)
