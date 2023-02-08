import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { Button, Card, Col, Form, Input, Row, Space } from "antd";
import { toast } from "react-toastify";
import uuid from "react-uuid";

function AddEmployee() {
  const history = useHistory();
  const { id } = useParams();
  const [form] = Form.useForm();
  const onFinish = (value) => {
    let url = `http://localhost:8000/employee`;
    let data = {
      "EmpFirst Name": value.firstName,
      "EmpLast Name": value.lastName,
      "EmpStreet Address": value.streetAddress,
      EmpCity: value.city,
      EmpState: value.state,
      EmpZipCode: value.zipCode,
      "EmpPhone Number": value.phone,
      Position: value.position,
      "Hourly Rate": value.hourlyRate,
      "Date Hired": value.dateHired,
    };
    if (id !== "add") {
      url += `/${id}`;
      let option = {
        method: "PATCH",
        body: JSON.stringify(data),
        headers: {
          "Content-type": "application/json",
        },
      };
      fetch(url, option)
        .then((res) => res.json())
        .then((data) => {
          toast.success("Edit Success");
        });
    } else {
      data.id = uuid();
      let option = {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-type": "application/json",
        },
      };
      fetch(url, option)
        .then((res) => res.json())
        .then((data) => {
          form.resetFields();

          toast.success("Add Success");
        });
    }
  };
  const onFinishFailed = (value) => {
    toast.error("Your input aren't finish");
  };
  useEffect(() => {
    if (id !== "add") {
      let url = `http://localhost:8000/employee/${id}`;
      fetch(url)
        .then((res) => res.json())
        .then((data) => {
          let formatData = {
            firstName: data["EmpFirst Name"],
            lastName: data["EmpLast Name"],
            position: data["Position"],
            streetAddress: data["EmpStreet Address"],
            city: data["EmpCity"],
            state: data["EmpState"],
            zipCode: data["EmpZipCode"],
            phone: data["EmpPhone Number"],
            dateHired: data["Date Hired"],
            hourlyRate: data["Hourly Rate"],
          };
          form.setFieldsValue({ ...formatData });
        });
    }
  }, []);
  return (
    <div className="wrap-table">
      <div className="wrap-search-add">
        <Button
          onClick={() => history.goBack()}
          type="primary"
          icon={<ArrowLeftOutlined />}
        ></Button>
      </div>
      <h1 className="title-table">
        {id !== "add" ? "Edit Employee" : "Add Employee"}
      </h1>
      <Card>
        <Form
          layout="vertical"
          form={form}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Row className="wrap-row-input">
            <Col span={8}>
              <Form.Item
                name="firstName"
                label="Type first name"
                rules={[
                  {
                    required: true,
                    message: "Type first name is required",
                  },
                ]}
              >
                <Input></Input>
              </Form.Item>
              <Form.Item
                name="lastName"
                label="Type last name"
                rules={[
                  {
                    required: true,
                    message: "Type last name is required",
                  },
                ]}
              >
                <Input></Input>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="streetAddress"
                label="Street address"
                rules={[
                  {
                    required: true,
                    message: "Type street address is required",
                  },
                ]}
              >
                <Input></Input>
              </Form.Item>
              <Form.Item
                name="city"
                label="Type city"
                rules={[
                  {
                    required: true,
                    message: "Type city is required",
                  },
                ]}
              >
                <Input></Input>
              </Form.Item>
            </Col>
          </Row>
          <Row className="wrap-row-input">
            <Col span={8}>
              <Form.Item
                name="state"
                label="Type state"
                rules={[
                  {
                    required: true,
                    message: "Type state is required",
                  },
                ]}
              >
                <Input></Input>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="zipCode"
                label="Type zip code"
                rules={[
                  {
                    required: true,
                    message: "Type zip code is required",
                  },
                ]}
              >
                <Input></Input>
              </Form.Item>
            </Col>
          </Row>
          <Row className="wrap-row-input">
            <Col span={8}>
              <Form.Item
                name="phone"
                label="Type phone"
                rules={[
                  {
                    required: true,
                    message: "Type phone is required",
                  },
                ]}
              >
                <Input></Input>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="position"
                label="Type position"
                rules={[
                  {
                    required: true,
                    message: "Type position is required",
                  },
                ]}
              >
                <Input></Input>
              </Form.Item>
            </Col>
          </Row>
          <Row className="wrap-row-input">
            <Col span={8}>
              <Form.Item
                name="hourlyRate"
                label="Type hourly rate"
                rules={[
                  {
                    required: true,
                    message: "Type hourly rate is required",
                  },
                ]}
              >
                <Input></Input>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="dateHired"
                label="Type date hired"
                rules={[
                  {
                    required: true,
                    message: "Type date hired is required",
                  },
                ]}
              >
                <Input></Input>
              </Form.Item>
            </Col>
          </Row>
          <Space className="text-right">
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Space>
        </Form>
      </Card>
    </div>
  );
}

export default AddEmployee;
