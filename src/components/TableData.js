import { Table } from 'antd';
import CONSTANT from '../constant';
import { changeNextPageUrl } from '../utils';
import { useHistory } from 'react-router-dom';
const TableData = (props) => {
  const history = useHistory();
  return (
    <Table columns={props.columns} dataSource={props.data}
    pagination={{
      position: ['bottomCenter'],
      showSizeChanger: false,
      pageSize: CONSTANT.size,
      total: props.total,
      current: props.page,
      onChange(current) {
        props.changePage(current)
        changeNextPageUrl(history, current);
      }
    }}/>
  )
} 
export default TableData;