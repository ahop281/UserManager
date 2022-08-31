import { CheckOutlined, CheckSquareOutlined, CloseOutlined, CloseSquareOutlined, DeleteOutlined, EditOutlined, FormOutlined, PlusOutlined, UserAddOutlined, WarningOutlined } from '@ant-design/icons'
import { Anchor, Button, Space, Spin, Table, Typography, Popconfirm, Form, InputNumber, Input, DatePicker } from 'antd'
import Search from 'antd/lib/input/Search'
import moment from 'moment';
import { Component, useEffect, useState } from 'react'

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
  var inputNode = inputType === 'number' ? <InputNumber /> : <Input />
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
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0
          }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

function Home({
  users,
  pending,
  error,
  fetchDataPending,
  fetchDataSuccess,
  fetchDataError,
  addUser,
  updateUser,
  deleteUser
}) {
  const [editingKey, setEditingKey] = useState('')
  const [form] = Form.useForm()

  const fetchData = (url, request = { method: 'GET' }) => {
    console.log('call api');
    fetchDataPending()
    fetch(`https://localhost:44330/api/User/${url}`, {
      ...request,
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        if(request.method == 'GET')
          return res.json()
        fetchDataSuccess()
      })
      .then(res => {
        fetchDataSuccess(res)
      })
      .catch(error => {
        fetchDataError(error)
      })
  }

  useEffect(() => {
    fetchData('GetAllUsers')
  }, [])

  useEffect(() => {
    const record = dataSource?.find(record => record?.key == 'add-user')
    if(record)
      edit(record)
  }, [users])

  const handleAdd = () => {
    addUser()
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
      dob: row.dob,
    }
    updateUser(user)
    if(record.key == 'add-user') {
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
          <Space size='large'>
            <Button
              onClick={() => save(record)}
              type='primary'
              ghost
            >
              <CheckOutlined />
            </Button>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <Button type='default' danger>
                <CloseOutlined />
              </Button>
            </Popconfirm>
          </Space>
        ) : (
          <Space size='large'>
            <Button type='primary' ghost disabled={editingKey !== ''} onClick={() => edit(record)}>
              <FormOutlined />
            </Button>
            <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record)}>
              <Button type='default' danger disabled={editingKey !== ''}>
                <DeleteOutlined />
              </Button>
            </Popconfirm>
          </Space>
        );
      }
      // dataSource.length >= 1 ? (
      //   <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.key)}>
      //     <a>Delete</a>
      //   </Popconfirm>
      // ) : null,
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

  const dataSource = users?.map((user, index) => ({
    key: user.id,
    index: index + 1,
    name: user.name,
    email: user.email,
    dob: moment(user.dob).format(dateFormat),
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
        <Typography.Title level={2}>Users</Typography.Title>
        <Space size='large'>
          <Search
            placeholder="input search text"
            allowClear
            onSearch={() => {}}
            enterButton
          />
          <Anchor>
            <Button type='primary' onClick={handleAdd}>
              <UserAddOutlined />
            </Button>
          </Anchor>
        </Space>
      </div>
      <Form form={form} component={false}>
        {
        /* error ? <Space size='large'><WarningOutlined />error</Space>
          :  */<Table
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
      </Form>
    </div>
  )
}

export default Home