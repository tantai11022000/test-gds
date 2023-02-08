import { Button, Space, Input, Modal, Select } from "antd";
import React, { useEffect, useState } from "react";
import TableData from "../../components/TableData";
import CONSTANT from "../../constant";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  FileExcelOutlined,
} from "@ant-design/icons";
import { changeNextPageUrl, exportExcel } from "../../utils";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
function Customer() {
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
  const getDataCustomer = (page, search) => {
    let url = `http://localhost:8000/customer?_page=${page}&_limit=${CONSTANT.size}`;
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
          firstName: item["CustFirst Name"],
          lastName: item["CustLast Name"],
          address: item["CustStreet Address"],
          city: item["CustCity"],
          state: item["CustState"],
          zipCode: item["CustZipCode"],
          phone: item["CustPhone"],
          email: item["CustEmail Address"],
        }));
        setData(newData);
      });
  };
  const onHanldeAdd = () => {
    history.push("/customer/add");
  };
  const onHanldeEdit = (key) => {
    history.push(`/customer/${key}`);
  };
  const getValueForExport = (data, option) => {
    switch (option) {
      case "key":
        return data["id"];
      case "firstName":
        return data["CustFirst Name"];
      case "lastName":
        return data["CustLast Name"];
      case "address":
        return data["CustStreet Address"];
      case "city":
        return data["CustCity"];
      case "state":
        return data["CustState"];
      case "zipCode":
        return data["CustZipCode"];
      case "phone":
        return data["CustPhone"];
      case "email":
        return data["CustEmail Address"];
      default:
        break;
    }
  };
  const onHanldeExport = () => {
    let url = `http://localhost:8000/customer`;
    fetch(url)
      .then((res) => res.json())
      .then(async (data) => {
        data = data.map((item) => {
          let obj = {
          };
          fieldExport.forEach(field => {
            obj[field] = getValueForExport(item,field)
          })
          return obj
        });
        return await exportExcel(data,"Customer","Customer")
      });
  };

  const onHanldeDelete = (key) => {
    let url = `http://localhost:8000/customer/${key}`;
    fetch(url, { method: "DELETE" })
      .then((res) => res.json())
      .then((data) => {
        getDataCustomer(page, search);
        toast.success("Delete Success");
      });
  };
  const handleSearch = (value) => {
    setPage(1);
    changeNextPageUrl(history, 1);
    setSearch(value);
  };
  useEffect(() => {
    getDataCustomer(page, search);
  }, [page, search]);
  const columns = [
    {
      title: "Customer Id",
      dataIndex: "key",
    },
    {
      title: "Customer First Name",
      dataIndex: "firstName",
      sorter: (a, b) => a.firstName.localeCompare(b.firstName),
    },
    {
      title: "Customer Last Name",
      dataIndex: "lastName",
      sorter: (a, b) => a.lastName.localeCompare(b.lastName),
    },
    {
      title: "Address",
      dataIndex: "address",
      sorter: (a, b) => a.address.localeCompare(b.address),
    },
    {
      title: "City",
      dataIndex: "city",
      sorter: (a, b) => a.city.localeCompare(b.city),
    },
    {
      title: "State",
      dataIndex: "state",
      sorter: (a, b) => a.state.localeCompare(b.state),
    },
    {
      title: "Zip Code",
      dataIndex: "zipCode",
      sorter: (a, b) => a.zipCode.localeCompare(b.zipCode),
    },
    {
      title: "Phone",
      dataIndex: "phone",
      sorter: (a, b) => a.phone.localeCompare(b.phone),
    },
    {
      title: "Email",
      dataIndex: "email",
      sorter: (a, b) => a.email.localeCompare(b.email),
    },
    {
      title: "",
      align: "center",
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
      <h1 className="title-table">Customer</h1>
      <div className="wrap-search-add">
        <div style={{ width: "20%" }}>
          <Input.Search
            placeholder="Input customer id"
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

export default Customer;
