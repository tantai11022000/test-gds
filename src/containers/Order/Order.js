import React, { useEffect, useState } from "react";
import TableData from "../../components/TableData";
import CONSTANT from "../../constant";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  FileExcelOutlined,
} from "@ant-design/icons";
import { Button, Modal, Select, Space } from "antd";
import { Input } from "antd";
import { changeNextPageUrl, exportExcel } from "../../utils";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
function Order() {
  const history = useHistory();
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fieldExport, setFieldExport] = useState([]);
  const handleChangeFieldExport = (value) => {
    setFieldExport(value);
  };
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    if (fieldExport.length !== 0) {
      onHanldeExport();
      setIsModalOpen(false);
    } else {
      toast.error("Choose field for export");
    }
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const getValueForExport = (data, option) => {
    switch (option) {
      case "key":
        return data["id"];
      case "orderDate":
        return data["Order Date"];
      case "shipDate":
        return data["Ship Date"];
      case "employeeName":
        return (
          data["Employee Info"]["EmpFirst Name"] +
          " " +
          data["Employee Info"]["EmpLast Name"]
        );
      case "customerName":
        return (
          data["Customer Info"]["CustFirst Name"] +
          " " +
          data["Customer Info"]["CustLast Name"]
        );
      default:
        break;
    }
  };

  const onHanldeExport = () => {
    let url = `http://localhost:8000/order`;
    fetch(url)
      .then((res) => res.json())
      .then(async (data) => {
        data = data.map((item) => {
          let obj = {};
          fieldExport.forEach((field) => {
            obj[field] = getValueForExport(item, field);
          });
          return obj;
        });
        return await exportExcel(data, "Order", "Order");
      });
  };
  const onHanldeAdd = () => {
    history.push("/order/add");
  };
  const onHanldeEdit = (key) => {
    history.push(`/order/${key}`);
  };
  const getDataOrder = (page, search) => {
    let url = `http://localhost:8000/order?_page=${page}&_limit=${CONSTANT.size}`;
    if (search) {
      url += `&id_like=${search}`;
    }
    fetch(url)
      .then(async (res) => ({
        data: await res.json(),
        total: res.headers.get("X-Total-Count"),
      }))
      .then((newData) => {
        setTotal(newData.total);
        newData = newData.data.map((item) => ({
          key: item["id"],
          orderDate: item["Order Date"],
          shipDate: item["Ship Date"],
          employeeName:
            item["Employee Info"]["EmpFirst Name"] +
            " " +
            item["Employee Info"]["EmpLast Name"],
          customerName:
            item["Customer Info"]["CustFirst Name"] +
            " " +
            item["Customer Info"]["CustLast Name"],
        }));
        setData(newData);
      });
  };
  const onHanldeDelete = (key) => {
    let url = `http://localhost:8000/order/${key}`;
    fetch(url, { method: "DELETE" })
      .then((res) => res.json())
      .then((data) => {
        getDataOrder(page, search);
        toast.success("Delete Success");
      });
  };
  const handleSearch = (value) => {
    setPage(1);
    changeNextPageUrl(history, 1);
    setSearch(value);
  };
  useEffect(() => {
    getDataOrder(page, search);
  }, [page, search]);
  const columns = [
    {
      title: "Order Number",
      dataIndex: "key",
    },
    {
      title: "Customer Name",
      dataIndex: "customerName",
      sorter: (a, b) => a.customerName.localeCompare(b.customerName),
    },
    {
      title: "Employee Name",
      dataIndex: "employeeName",
      sorter: (a, b) => a.employeeName.localeCompare(b.employeeName),
    },
    {
      title: "Order Date",
      dataIndex: "orderDate",
      sorter: (a, b) => a.orderDate.localeCompare(b.orderDate),
    },
    {
      title: "Ship Date",
      dataIndex: "shipDate",
      sorter: (a, b) => a.shipDate.localeCompare(b.shipDate),
    },
    {
      title: "",
      align: "center",
      width: 200,
      render: (key) => (
        <Space size="middle">
          <Button
            onClick={() => onHanldeDelete(key)}
            type="primary"
            icon={<DeleteOutlined />}
          ></Button>
          <Button
            onClick={() => onHanldeEdit(key)}
            type="primary"
            icon={<EditOutlined />}
          ></Button>
        </Space>
      ),
    },
  ];
  const optionExport = columns.map((item) => ({
    value: item.dataIndex,
    label: item.title,
  }));
  return (
    <div className="wrap-table">
      <h1 className="title-table">Order</h1>
      <div className="wrap-search-add">
        <div style={{ width: "20%" }}>
          <Input.Search
            placeholder="Input order number"
            onSearch={handleSearch}
            allowClear
            enterButton="Search"
          />
        </div>
        <div>
          <Button
            onClick={() => showModal()}
            type="primary"
            icon={<FileExcelOutlined />}
          ></Button>
          <Button
            style={{ marginLeft: "10px" }}
            onClick={() => onHanldeAdd()}
            type="primary"
            icon={<PlusOutlined />}
          ></Button>
        </div>
      </div>
      {data && (
        <TableData
          data={data}
          columns={columns}
          total={total}
          changePage={(newPage) => setPage(newPage)}
          page={page}
        ></TableData>
      )}
      <Modal
        title="Choose field for export"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Select
          style={{ width: "100%" }}
          options={optionExport}
          onChange={handleChangeFieldExport}
          mode="multiple"
        ></Select>
      </Modal>
    </div>
  );
}

export default Order;
