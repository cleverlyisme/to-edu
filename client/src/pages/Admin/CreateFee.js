import * as yup from "yup";
import { Calendar } from "react-calendar";
import { withFormik, Form, Field } from "formik";
import React, { useEffect, useState } from "react";
import { Input, FormGroup, Button, Row, Col } from "reactstrap";

import FilterSelected from "../../components/selecteds/FilterSelected";
import Feedback from "../../components/common/Feedback";
import LabelRequired from "../../components/common/LabelRequired";
import BackBtn from "../../components/buttons/BackBtn";
import history from "../../config/history";
import renderNoti from "../../utils/renderNoti";

import {
  getAllClass,
  getFeeData,
  createFee,
  updateFee,
} from "../../utils/api/fetchData";
import GradeSelected from "../../components/selecteds/GradeSelected";

const CreateFee = (props) => {
  const teacherId = props.id;
  const id = props.match?.params?.id || teacherId;

  const [filterClass, setFilterClass] = useState([]);

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    getAllClass().then((res) => {
      const options = res.data.map((c) => ({ label: c, value: c }));
      setFilterClass(options);
    });

    if (id) {
      // get teacher data here
      getFeeData(id).then((res) => {
        const data = res.data;
        props.setFieldValue("title", data.title);
        props.setFieldValue("grade", data.grade);
        props.setFieldValue("classRoom", data.classRoom);
        props.setFieldValue("description", data.description);
        props.setFieldValue("amount", data.amount);
        props.setFieldValue("from", new Date(data.from));
        props.setFieldValue("to", new Date(data.to));
      });
    }
  };

  const onGradeSelected = (e) => {
    if (e) {
      props.setFieldValue("grade", e.value);
      const classArray = e.classRoom.map((item) => ({
        value: item,
        label: item,
      }));
      setFilterClass(classArray);
    } else {
      props.setFieldValue("grade", "");
      setFilterClass([]);
    }
    props.setFieldValue("classRoom", "");
  };

  const { title, grade, classRoom, description, amount, from, to } =
    props.values;

  return (
    <Form className="mb-2">
      <Row>
        <Col md={12} className="d-flex align-items-start">
          <div className="flex-grow-1">
            <h5 className="mb-2">
              {id ? "CẬP NHẬT GIÁO VIÊN" : "TẠO MỚI GIÁO VIÊN"}
            </h5>
          </div>

          <BackBtn title="trang chủ" onClick={() => history.push("/")} />
        </Col>
        <Col md={4} className="text-right"></Col>
      </Row>

      <Row>
        <Col md={6}>
          <FormGroup>
            <LabelRequired>Tiêu đề</LabelRequired>
            <Field
              name="title"
              render={({ field }) => (
                <Input {...field} placeholder="Tiêu đề học phí" />
              )}
            />
            {props.touched.title && <Feedback>{props.errors.title}</Feedback>}
          </FormGroup>

          <FormGroup>
            <LabelRequired>Số tiền</LabelRequired>
            <Field
              name="amount"
              render={({ field }) => <Input {...field} placeholder="Số tiền" />}
            />
            {props.touched.amount && <Feedback>{props.errors.amount}</Feedback>}
          </FormGroup>

          <FormGroup>
            <LabelRequired>Ngày bắt đầu</LabelRequired>
            <Calendar
              onChange={(e) => {
                if (e.getTime() < to.getTime()) {
                  props.setFieldValue("from", e);
                }
              }}
              value={from}
              showWeekNumbers
            />
            {props.touched.from && <Feedback>{props.errors.from}</Feedback>}
          </FormGroup>

          <FormGroup>
            <LabelRequired>Mô tả</LabelRequired>
            <Field
              name="description"
              render={({ field }) => (
                <Input {...field} type="textarea" placeholder="Mô tả" />
              )}
            />
            {props.touched.description && (
              <Feedback>{props.errors.description}</Feedback>
            )}
          </FormGroup>
        </Col>

        <Col md={6}>
          <FormGroup>
            <LabelRequired>Khối</LabelRequired>
            <GradeSelected
              name="grade"
              isClearable
              className="mb-2"
              placeholder="Chọn khối"
              onChange={(e) => onGradeSelected(e)}
            />
            {props.touched.grade && <Feedback>{props.errors.grade}</Feedback>}
          </FormGroup>

          <FormGroup>
            <LabelRequired>Lớp học</LabelRequired>
            <FilterSelected
              isClearable
              placeholder="Chọn lớp"
              options={filterClass}
              onChange={(e) => {
                if (e) {
                  props.setFieldValue("classRoom", e.value);
                } else {
                  props.setFieldValue("classRoom", "");
                }
              }}
              value={
                classRoom && {
                  value: classRoom,
                  label: classRoom,
                }
              }
            />
            {props.touched.classRoom && (
              <Feedback>{props.errors.classRoom}</Feedback>
            )}
          </FormGroup>

          <FormGroup>
            <LabelRequired>Hạn đóng</LabelRequired>
            <Calendar
              onChange={(e) => {
                if (e.getTime() > from.getTime()) {
                  props.setFieldValue("to", e);
                }
              }}
              value={to}
              showWeekNumbers
            />
            {props.touched.to && <Feedback>{props.errors.to}</Feedback>}
          </FormGroup>
        </Col>
      </Row>

      <Button color="success" onClick={props.handleSubmit}>
        {id ? "Cập nhật" : "Tạo mới"}
      </Button>
    </Form>
  );
};

export default withFormik({
  mapPropsToValues: () => ({
    title: "",
    grade: "",
    classRoom: "",
    description: "",
    amount: 0,
    from: new Date(),
    to: new Date(),
  }),
  validationSchema: yup.object().shape({
    title: yup.string().required("Tiêu đề không được để trống"),
    grade: yup.string().required("Chọn khối muốn tạo học phí"),
    classRoom: yup.string().required("Chọn lớp muốn tạo học phí"),
    description: yup
      .string()
      .required("Mô tả không được để trống")
      .max(255, "Mô tả quá dài"),
    amount: yup
      .number("Học phí phải là kiểu số")
      .typeError("Học phí phải là kiểu số")
      .required("Học phí không được để trống"),
    to: yup.date().min(yup.ref("from"), "Hạn đóng phải lớn hơn ngày bắt đầu"),
  }),
  handleSubmit: async (values, { props }) => {
    try {
      const id = props.match?.params?.id;
      const res = await (id ? updateFee(values, id) : createFee(values));
      if (res.data && res.data.error) {
        throw new Error(res.data.error);
      }
      renderNoti({
        type: "success",
        title: "Thành công",
        message: `Đã ${id ? "cập nhật" : "tạo mới"} học phí`,
      });
      history.push("/fees");
    } catch (err) {
      renderNoti({
        type: "danger",
        title: "Lỗi",
        message: err.message,
      });
    }
  },
})(CreateFee);
