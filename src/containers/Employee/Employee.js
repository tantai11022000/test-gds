import { Button, Modal, Select, Space } from "antd";
import React, { useEffect, useState } from "react";
import TableData from "../../components/TableData";
import CONSTANT from "../../constant";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  FileExcelOutlined,
} from "@ant-design/icons";
import { Input } from "antd";
import { changeNextPageUrl, exportExcel } from "../../utils";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
function Employee() {
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
      case "firstName":
        return data["EmpFirst Name"];
      case "lastName":
        return data["EmpLast Name"];
      case "address":
        return data["EmpStreet Address"];
      case "city":
        return data["EmpCity"];
      case "state":
        return data["EmpState"];
      case "zipCode":
        return data["EmpZipCode"];
      case "phone":
        return data["EmpPhone Number"];
      case "hourlyRate":
        return data["Hourly Rate"];
      case "dateHired":
        return data["Date Hired"];
      case "position":
        return data["Position"];
      default:
        break;
    }
  };

  const onHanldeExport = () => {
    let url = `http://localhost:8000/employee`;
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
        return await exportExcel(data, "Employee", "Employee");
      });
  };
  const getDataEmployee = (page, search) => {
    let url = `http://localhost:8000/employee?_page=${page}&_limit=${CONSTANT.size}`;
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
          firstName: item["EmpFirst Name"],
          lastName: item["EmpLast Name"],
          address: item["EmpStreet Address"],
          city: item["EmpCity"],
          state: item["EmpState"],
          zipCode: item["EmpZipCode"],
          phone: item["EmpPhone Number"],
          hourlyRate: item["Hourly Rate"],
          dateHired: item["Date Hired"],
          position: item["Position"],
        }));
        setData(newData);
      });
  };
  const onHanldeAdd = () => {
    history.push("/employee/add");
  };
  const onHanldeEdit = (key) => {
    history.push(`/employee/${key}`);
  };
  const onHanldeDelete = (key) => {
    let url = `http://localhost:8000/employee/${key}`;
    fetch(url, { method: "DELETE" })
      .then((res) => res.json())
      .then((data) => {
        getDataEmployee(page, search);
        toast.success("Delete Success");
      });
  };
  const handleSearch = (value) => {
    setPage(1);
    changeNextPageUrl(history, 1);
    setSearch(value);
  };
  useEffect(() => {
    getDataEmployee(page, search);
  }, [page, search]);
  const columns = [
    {
      title: "Employee Number",
      dataIndex: "key",
    },
    {
      title: "Employee First Name",
      dataIndex: "firstName",
      sorter: (a, b) => a.firstName.localeCompare(b.firstName),
    },
    {
      title: "Employee Last Name",
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
      title: "Position",
      dataIndex: "position",
      sorter: (a, b) => a.position.localeCompare(b.position),
    },
    {
      title: "Hourly Rate",
      dataIndex: "hourlyRate",
      sorter: {
        compare: (a, b) =>
          +a.hourlyRate.split("$")[0] - +b.hourlyRate.split("$")[0],
      },
    },
    {
      title: "dateHired",
      dataIndex: "dateHired",
      sorter: (a, b) => a.dateHired.localeCompare(b.dateHired),
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
      <h1 className="title-table">Employee</h1>
      <div className="wrap-search-add">
        <div style={{ width: "20%" }}>
          <Input.Search
            placeholder="Input employee number"
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
            style={{ marginLeft: "20px" }}
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

export default Employee;
