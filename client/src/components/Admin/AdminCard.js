import React from "react"
import styled from "styled-components"

const LinkSpan = styled.span`
    cursor: pointer;
    &:hover {
        text-decoration: underline;
    }
`

export default ({ color, children, detail, onDetailClick, viewOnly }) => {
    return (
        <div
            className={`text-white d-flex flex-column bg-${color}`}
            style={{ borderRadius: "4px" }}
        >
            <div className="p-3">{children}</div>
            {!viewOnly && (
                <>
                    <hr className="m-0" />
                    <div className="py-2 px-3">
                        <LinkSpan onClick={onDetailClick || null}>
                            {detail || "Xem chi tiết"}{" "}
                            <i
                                className="fas fa-chevron-right"
                                style={{ fontSize: "0.75rem" }}
                            ></i>
                        </LinkSpan>
                    </div>
                </>
            )}
        </div>
    )
}
