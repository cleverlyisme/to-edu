import moment from "moment";
import { connect } from "react-redux";
import React, { useState, useEffect } from "react";
import { Table, Row, Col, Alert } from "reactstrap";

import history from "../config/history";
import CreateBtnBig from "../components/buttons/CreateBtnBig";
import BackBtn from "../components/buttons/BackBtn";
import DeleteBtn from "../components/buttons/DeleteBtn";
import SearchBox from "../components/common/SearchBox";
import FilterSelected from "../components/selecteds/FilterSelected";
import NewTabLink from "../components/common/NewTabLink";
import Pagination from "../components/common/Pagination";

import renderNoti from "../utils/renderNoti";
import getAllFees from "../redux/action/getAllFees";
import getStudentFees from "../redux/action/getStudentFees";
import setModal from "../redux/action/setModal";
import { getAllClass, deleteFee } from "../utils/api/fetchData";
import GradeSelected from "../components/selecteds/GradeSelected";
import PayBtn from "../components/buttons/PayBtn";

const FeeList = (props) => {
  const { role, _id } = props.user;
  const [searchString, setSearchString] = useState("");
  const [optionClass, setOptionClass] = useState("");
  const [filterClass, setFilterClass] = useState([]);
  const [optionGrade, setOptionGrade] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterStatusValue, setFilterStatusValue] = useState("");
  const [data, setData] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [totalFee, setTotalFee] = useState(0);

  const [isOpen, toggle] = useState(false);

  const status = [
    { label: "Chưa đóng", value: "not-paid" },
    { label: "Đã đóng", value: "paid" },
    { label: "Đang chờ xác nhận", value: "pending" },
  ];

  const getData = () => {
    if (role !== "admin" && _id) {
      props
        .getStudentFees(
          { searchString, filterStatus: filterStatusValue, currentPage },
          _id
        )
        .then((res) => {
          setData(res.data);
          setTotalPage(res.totalPage);
          setTotalFee(res.totalFee);
        })
        .catch((err) => {
          renderNoti({
            type: "danger",
            title: "Lỗi",
            message: "Lỗi trong khi lấy dữ liệu",
          });
        });
    } else {
      props
        .getAllFees(searchString, optionClass, optionGrade, currentPage)
        .then((res) => {
          setData(res.data);
          setTotalPage(res.totalPage);
          setTotalFee(res.totalFee);
        })
        .catch((err) => {
          renderNoti({
            type: "danger",
            title: "Lỗi",
            message: "Lỗi trong khi lấy dữ liệu",
          });
        });
    }
  };

  useEffect(() => {
    if (role === "admin")
      getAllClass().then((res) => {
        const options = res.data.map((c) => ({ label: c, value: c }));
        setFilterClass(options);
      });
  }, []);

  useEffect(() => {
    getData();
    //eslint-disable-next-line
  }, [optionGrade, optionClass, filterStatusValue, currentPage]);

  const onGradeSelected = (e) => {
    setCurrentPage(1);
    if (e) {
      setOptionGrade(e.value);
      const classArray = e.classRoom.map((item) => ({
        value: item,
        label: item,
      }));
      setFilterClass(classArray);
    } else {
      setOptionGrade("");
      setFilterClass([]);
    }
    setOptionClass("");
  };

  const handleDeleteFee = (id) => {
    deleteFee(id)
      .then(() =>
        renderNoti({
          title: "Thành công",
          message: "Đã xóa học phí",
          type: "success",
        })
      )
      .then(() => getData())
      .catch((err) => {
        renderNoti({
          type: "danger",
          title: "Lỗi",
          message: "Lỗi trong khi xóa học phí",
        });
      });
  };

  return (
    <div>
      <Row className="mb-2">
        <Col md={7}>
          <h5>
            DANH SÁCH HỌC PHÍ {props.year && `${props.year}-${props.year + 1}`}
          </h5>
        </Col>
        <Col md={5} className="text-md-right text-md-left">
          {role === "admin" && (
            <CreateBtnBig
              title="học phí"
              className="mr-2"
              onClick={() => history.push("/user/fee/create")}
            />
          )}
          <BackBtn title="trang chủ" onClick={() => history.push("/")} />
        </Col>
      </Row>
      <Row className="mb-2">
        <Col md={6}>
          <SearchBox
            onChange={(e) => setSearchString(e.target.value)}
            onSearch={() => {
              if (currentPage !== 1) {
                setCurrentPage(1);
              } else {
                getData();
              }
            }}
          />
        </Col>
        {role === "admin" ? (
          <>
            <Col md={3}>
              <GradeSelected
                isClearable
                className="mb-2"
                placeholder="Lọc theo khối"
                onChange={(e) => onGradeSelected(e)}
              />
            </Col>
            <Col md={3}>
              <FilterSelected
                isClearable
                placeholder="Lọc theo lớp"
                options={filterClass}
                onChange={(e) => {
                  setCurrentPage(1);
                  if (e) {
                    setOptionClass(e.value);
                  } else {
                    setOptionClass("");
                  }
                }}
                value={
                  optionClass && {
                    value: optionClass,
                    label: optionClass,
                  }
                }
              />
            </Col>
          </>
        ) : (
          <Col md={3}>
            <FilterSelected
              isClearable
              placeholder="Tình trạng"
              options={status}
              onChange={(e) => {
                setFilterStatus(e);
                setFilterStatusValue(e.value);
              }}
              value={filterStatus}
            />
          </Col>
        )}
      </Row>
      <Row className="mb-2">
        <Col md={12} className="text-right">
          <b>Tổng số học phí: {totalFee}</b>
        </Col>
      </Row>
      <Row>
        <Col md={12}>
          {data && data.length > 0 ? (
            <Table bordered striped hover size="sm" responsive>
              <thead>
                <tr>
                  {[
                    "Tiêu đề",
                    "Khối",
                    "Lớp",
                    "Số tiền",
                    "Ngày tạo",
                    "Hạn đóng",
                    "",
                  ].map((item, index) => (
                    <th key={index} className="align-top">
                      {item}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((fee, index) => (
                  <tr key={index}>
                    {role === "admin" ? (
                      <td>
                        <NewTabLink
                          title={fee.title}
                          to={`/user/fee/edit/${fee._id}`}
                        />
                      </td>
                    ) : (
                      <td>{fee.title}</td>
                    )}
                    <td>{fee.grade}</td>
                    <td>{fee.classRoom}</td>
                    <td>
                      {fee.amount.toLocaleString("en-US", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </td>
                    <td>{moment(fee.from).format("DD/MM/YYYY")}</td>
                    <td>{moment(fee.to).format("DD/MM/YYYY")}</td>
                    <td className="text-center">
                      {role !== "admin" && (
                        <PayBtn
                          onClick={() => {
                            props.setModal({
                              isOpen: true,
                              message: "Bạn muốn thanh toán học phí này ?",
                              onConfirm: () => handleDeleteFee(fee._id),
                            });
                          }}
                        />
                      )}
                      <DeleteBtn
                        onClick={() => {
                          props.setModal({
                            isOpen: true,
                            message: "Bạn có chắc muốn xóa học phí này ?",
                            type: "warning",
                            onConfirm: () => handleDeleteFee(fee._id),
                          });
                        }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <Alert color="primary">Không có học phí nào</Alert>
          )}
        </Col>
      </Row>
      <Pagination
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPage={totalPage}
      />
    </div>
  );
};

const mapStateToProps = (state) => ({
  year: state.time.year,
  user: state.user.userInformation,
});

const mapDispatchToProps = {
  getAllFees,
  getStudentFees,
  setModal,
};

export default connect(mapStateToProps, mapDispatchToProps)(FeeList);
