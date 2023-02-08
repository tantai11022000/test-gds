import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { Button, Card, Col, Form, Input, Row, Select, Space } from "antd";
import { toast } from "react-toastify";
import uuid from "react-uuid";

function AddOrder() {
  const history = useHistory();
  const { id } = useParams();
  const [form] = Form.useForm();
  const [dataCustomer, setDataCustomer] = useState("");
  const [dataEmployee, setDataEmployee] = useState("");
  const onFinish = (value) => {
    let url = `http://localhost:8000/order`;
    let data = {
      "Customer Info": {
        id: value.customer,
        "CustFirst Name": dataCustomer.find(
          (item) => item.value === value.customer
        )["CustFirst Name"],
        "CustLast Name": dataCustomer.find(
          (item) => item.value === value.customer
        )["CustLast Name"],
      },
      "Order Date": value.orderDate,
      "Ship Date": value.shipDate,
      "Employee Info": {
        id: value.employee,
        "EmpFirst Name": dataEmployee.find(
          (item) => item.value === value.employee
        )["EmpFirst Name"],
        "EmpLast Name": dataEmployee.find(
          (item) => item.value === value.employee
        )["EmpLast Name"],
      },
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
      let url = `http://localhost:8000/order/${id}`;
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
  useEffect(() => {
    let urlCustomer = `http://localhost:8000/customer`;
    let urlEmployee = `http://localhost:8000/employee`;
    fetch(urlCustomer)
      .then((res) => res.json())
      .then((data) => {
        data = data.map((item) => ({
          value: item.id,
          label: item["CustFirst Name"] + " " + item["CustLast Name"],
          "CustFirst Name": item["CustFirst Name"],
          "CustLast Name": item["CustLast Name"],
        }));
        setDataCustomer(data);
      });
    fetch(urlEmployee)
      .then((res) => res.json())
      .then((data) => {
        data = data.map((item) => ({
          value: item.id,
          label: item["EmpFirst Name"] + " " + item["EmpLast Name"],
          "EmpFirst Name": item["EmpFirst Name"],
          "EmpLast Name": item["EmpLast Name"],
        }));
        setDataEmployee(data);
      });
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
        {id !== "add" ? "Edit Order" : "Add Order"}
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
                name="customer"
                label="Type customer"
                rules={[
                  {
                    required: true,
                    message: "Type customer is required",
                  },
                ]}
              >
                <Select options={dataCustomer}></Select>
              </Form.Item>
              <Form.Item
                name="employee"
                label="Type employee"
                rules={[
                  {
                    required: true,
                    message: "Type employee is required",
                  },
                ]}
              >
                <Select options={dataEmployee}></Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="orderDate"
                label="Type order date"
                rules={[
                  {
                    required: true,
                    message: "Type order date is required",
                  },
                ]}
              >
                <Input></Input>
              </Form.Item>
              <Form.Item
                name="shipDate"
                label="Type ship date"
                rules={[
                  {
                    required: true,
                    message: "Type ship date is required",
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

export default AddOrder;
