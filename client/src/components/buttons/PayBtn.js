import React from "react";

export default ({ onClick }) => (
  <div
    className="text-center"
    style={{ cursor: "pointer" }}
    onClick={onClick}
    title="Thanh toán"
  >
    <i className="fas fa-money-check-alt"></i>
  </div>
);
