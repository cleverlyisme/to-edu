import React, { useState } from "react";
import { Row, Col, PaginationLink } from "reactstrap";

export default ({ currentPage, totalPage, setCurrentPage }) => {
    let current = 1;
    const CurrentPage = () => (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                setCurrentPage(current);
            }}
        >
            <input
                className="text-center"
                type="number"
                name="currentPage"
                style={{
                    border: "1px solid #dee2e6",
                    width: "50px",
                    height: "38px",
                    color: "#007bff",
                }}
                defaultValue={currentPage}
                onChange={(e) => {
                    current = Number(e.target.value);
                }}
            />
        </form>
    );

    const previousPage = () => setCurrentPage(currentPage - 1);
    const nextPage = () => setCurrentPage(currentPage + 1);

    const firstPage = () => setCurrentPage(1);
    const lastPage = () => setCurrentPage(totalPage);

    return (
        <Row>
            <Col md={12} className="d-flex justify-content-end">
                <PaginationLink className="mr-2" onClick={firstPage}>
                    1
                </PaginationLink>
                <PaginationLink
                    previous
                    className="mr-2"
                    onClick={previousPage}
                    disabled={currentPage <= 1}
                />
                <CurrentPage />
                <PaginationLink
                    next
                    className="ml-2"
                    onClick={nextPage}
                    disabled={currentPage >= totalPage}
                />
                <PaginationLink className="ml-2" onClick={lastPage}>
                    {totalPage}
                </PaginationLink>
            </Col>
        </Row>
    );
};
