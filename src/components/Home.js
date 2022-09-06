import * as icons from '@ant-design/icons'
import * as antd from 'antd'
import Search from 'antd/lib/input/Search'
import moment from 'moment';
import { useEffect, useState } from 'react'

const dateFormat = 'DD/MM/YYYY'

const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  var inputNode = inputType === 'number' ? <antd.InputNumber /> : <antd.Input />
  if(dataIndex === 'dob' && editing) {
    // inputNode = <DatePicker
    //   format={dateFormat}
    //   value={moment(record.dob, dateFormat)}
    //   picker='date'
    //   allowClear
    // />
    console.log('moment:', moment(record.dob, dateFormat));
  }
  // console.log(record, dataIndex);
  const rules = [
    {
      required: true,
      message: `Please Input ${title}!`
    }
  ]
  if(dataIndex === 'email') rules.push({
    type: 'email',
    message: 'Invalid email'
  })
  return (
    <td {...restProps}>
      {editing ? (
        <antd.Form.Item
          name={dataIndex}
          style={{
            margin: 0
          }}
          rules={rules}
        >
          {inputNode}
        </antd.Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

function Home({
  users,
  pending,
  filter,
  fetchDataPending,
  fetchDataSuccess,
  fetchDataError,
  addUser,
  updateUser,
  deleteUser,
  setSearchFilter
}) {
  const [editingKey, setEditingKey] = useState('')
  const [refresh, setRefresh] = useState(false)
  const [form] = antd.Form.useForm()

  const fetchData = (url, request = { method: 'GET' }) => {
    fetchDataPending()
    fetch(`https://localhost:44348/api/User/${url}`, {
      ...request,
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        if(request.method === 'GET')
          return res.json()
        fetchDataSuccess()
      })
      .then(res => {
        fetchDataSuccess(res)
        setRefresh(false)
      })
      .catch(error => {
        fetchDataError(error)
        showError(`Get Users Failed!\n ${error}`)
        setRefresh(false)
      })
  }

  const showError = (err) => {
    antd.message.error(`Error occurred: ${err}`);
  }

  useEffect(() => {
    fetchData('GetAllUsers')
  }, [])

  useEffect(() => {
    const record = dataSource?.find(record => record?.key === 'add-user')
    if(record)
      edit(record)
  }, [users])

  const handleSearch = (e) => {
    setSearchFilter(e.target.value.toLowerCase())
  }

  const handleRefresh = () => {
    fetchData('GetAllUsers')
    setRefresh(true)
    if(filter !== '') setSearchFilter('')
  }

  const handleAdd = () => {
    addUser()
    if(filter !== '') setSearchFilter('')
  }

  const handleDelete = record => {
    fetchData('DeleteUser', { method: 'POST', body: JSON.stringify({ id: record.key }) })
    deleteUser(record.key)
  }

  const edit = record => {
    form.setFieldsValue({
      ...record,
    })
    setEditingKey(record.key)
  }

  const save = async record => {
    const row = await form.validateFields();
    const user = {
      ...users.find(user => user.id === record.key),
      name: row.name,
      email: row.email,
      address: row.address,
      dob: moment(row.dob, dateFormat).format(),
    }
    updateUser(user)
    if(record.key === 'add-user') {
      delete user.id
      fetchData('AddUser', { method: 'POST', body: JSON.stringify(user) })
    }
    else {
      fetchData('UpdateUser', { method: 'POST', body: JSON.stringify(user) })
    }
    cancel()
  }

  const isEditing = record => record.key === editingKey

  const cancel = () => {
    if(editingKey === 'add-user')
      deleteUser(editingKey)
    setEditingKey('')
  }

  const columns = [
    {
      title: '#',
      dataIndex: 'index',
      key: 'index',
      width: '2%'
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      editable: true,
      width: '20%',
      filterSearch: true
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      editable: true,
      width: '20%'
    },
    {
      title: 'Dob',
      dataIndex: 'dob',
      key: 'dob',
      editable: true,
      width: '20%',
      inputType: "date"
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
      editable: true,
      width: '20%'
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      render: (_, record) => {
        const editable = isEditing(record)

        if(dataSource.length < 1) return null

        return editable ? (
          <antd.Space size='large'>
            <antd.Tooltip title='Save Editing' color='blue'>
              <antd.Button
                onClick={() => save(record)}
                type='primary'
                ghost
              >
                <icons.CheckOutlined />
              </antd.Button>
            </antd.Tooltip>
            <antd.Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <antd.Button type='default' danger>
                <icons.CloseOutlined />
              </antd.Button>
            </antd.Popconfirm>
          </antd.Space>
        ) : (
          <antd.Space size='large'>
            <antd.Tooltip title='Edit This User' color='blue'>
              <antd.Button type='primary' ghost disabled={editingKey !== ''} onClick={() => edit(record)}>
                <icons.FormOutlined />
              </antd.Button>
            </antd.Tooltip>
            <antd.Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record)}>
              <antd.Tooltip title='Delete This User' color='red'>
                <antd.Button type='default' danger disabled={editingKey !== ''}>
                  <icons.DeleteOutlined />
                </antd.Button>
              </antd.Tooltip>
            </antd.Popconfirm>
          </antd.Space>
        );
      }
    },
  ];

  const mergedColumns = columns.map((col) => {
    if(!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.dataIndex === 'index' ? 'number' : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  })

  const dataSource = users?.filter(user => user.name.toLowerCase().includes(filter))
    .map((user, index) => ({
      key: user.id,
      index: index + 1,
      name: user.name,
      email: user.email,
      dob: !!user.dob ? moment(user.dob).format(dateFormat) : '',
      address: user.address
    }))

  return (
    <div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        padding: '12px 16px',
        backgroundColor: 'white'
      }}>
        <antd.Typography.Title level={2}>Users</antd.Typography.Title>
        <antd.Space size='large'>
          <Search
            placeholder="Search by name?"
            allowClear
            onChange={handleSearch}
            enterButton
            value={filter}
          />
          <antd.Tooltip title='Add New User' color='blue'>
            <antd.Button type='primary' onClick={handleAdd}>
              <icons.UserAddOutlined />
            </antd.Button>
          </antd.Tooltip>
          <antd.Tooltip title='Refresh' color='blue'>
            <antd.Button type='primary' onClick={handleRefresh}>
              <icons.SyncOutlined spin={refresh} />
            </antd.Button>
          </antd.Tooltip>
        </antd.Space>
      </div>
      <antd.Form form={form} component={false}>
        {
          <antd.Table
            components={{
              body: {
                cell: EditableCell,
              },
            }}
            dataSource={dataSource}
            columns={mergedColumns}
            bordered
            loading={pending}
            rowClassName="editable-row"
            pagination={{
              onChange: cancel,
            }}
          />
        }
      </antd.Form>
    </div>
  )
}

export default Home