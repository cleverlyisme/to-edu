import React, { useState, useEffect } from "react"
import { connect } from "react-redux"
import { Row, Col, Alert } from "reactstrap"
import styled from "styled-components"

import history from "../config/history"
import SearchBox from "../components/common/SearchBox"
import CreateBtnBig from "../components/buttons/CreateBtnBig"
import BackBtn from "../components/buttons/BackBtn"
import Pagination from "../components/common/Pagination"
import HighlightDetail from "../components/HighlightDetail"

import getAllHighlight from "../redux/action/getAllHighlight"

const HighlightContainer = styled.div`
    padding: 16px;
    margin-bottom: 8px;
    overflow: auto;
`

const Highlight = ({ role, getAllHighlight }) => {
    const [data, setData] = useState([])
    const [searchString, setSearchString] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPage, setTotalPage] = useState(1)

    const [isPhone, setIsPhone] = useState(window.innerWidth < 768)

    useEffect(() => {
        getData()
    }, [currentPage])

    const getData = () => {
        getAllHighlight(searchString, currentPage).then((res) => {
            setData((res && res.data) || [])
            setTotalPage((res && res.totalPage) || 1)
        })
    }

    window.addEventListener("resize", () => setIsPhone(window.innerWidth < 768))

    return (
        <HighlightContainer>
            <Row className="mb-2 d-flex align-items-start">
                <Col md={2} className="mb-2 d-flex align-items-center">
                    <h5 className="mb-2 flex-grow-1">THÔNG BÁO</h5>
                    {isPhone && (
                        <>
                            {role === "admin" && (
                                <CreateBtnBig
                                    title="thông báo"
                                    onClick={() =>
                                        history.push("/highlight/create")
                                    }
                                    className="mr-2"
                                />
                            )}
                            <BackBtn
                                title="trang chủ"
                                onClick={() => history.push("/")}
                            />
                        </>
                    )}
                </Col>
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
                {!isPhone && (
                    <Col
                        md={4}
                        className="d-flex align-items-start justify-content-end"
                    >
                        {role === "admin" && (
                            <CreateBtnBig
                                title="thông báo"
                                onClick={() =>
                                    history.push("/highlight/create")
                                }
                                className="mr-2"
                            />
                        )}

                        <BackBtn
                            title="trang chủ"
                            onClick={() => history.push("/")}
                        />
                    </Col>
                )}
            </Row>
            <Row>
                {data &&
                    data.length > 0 &&
                    data.map((highlight, index) => (
                        <Col md={6} key={index} className="px-3">
                            <HighlightDetail
                                highlight={highlight}
                                afterDelete={() => {
                                    if (currentPage === 1) {
                                        getData()
                                        return
                                    }
                                    setCurrentPage(1)
                                }}
                                role={role}
                            />
                        </Col>
                    ))}

                {!data ||
                    (data && data.length === 0 && (
                        <Col md={12}>
                            <Alert color="primary">Không có thông báo</Alert>
                        </Col>
                    ))}
            </Row>
            {data && data.length > 0 && (
                <Pagination
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    totalPage={totalPage}
                />
            )}
        </HighlightContainer>
    )
}

const mapStateToProps = (state) => ({
    role: state.user.userInformation.role,
})

const mapDispatchToProps = {
    getAllHighlight,
}

export default connect(mapStateToProps, mapDispatchToProps)(Highlight)
