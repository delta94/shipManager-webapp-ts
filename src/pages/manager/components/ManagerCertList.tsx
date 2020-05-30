import React, { useReducer, useRef } from 'react';
import { Avatar, Popconfirm, List, Button, Divider } from 'antd';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { IManager, IManagerCert } from 'src/interfaces/IManager';
import { PlusOutlined } from '@ant-design/icons';
import ManagerCertEditFormModal from './ManagerCertEditFormModal';

interface ManagerCertListState {
  current: IManagerCert | null;
  list: IManagerCert[];
  showEditModal: boolean;
}

const initialState: ManagerCertListState = {
  current: null,
  showEditModal: false,
  list: [],
};

function reducer(state: ManagerCertListState, action) {
  switch (action.type) {
    case 'remove':
      return {
        ...state,
        list: state.list.filter(x => x.id !== action.payload),
      };
    case 'add':
      return {
        ...state,
        showEditModal: false,
        list: state.list.concat(action.payload),
      };
    case 'edit':
      return {
        ...state,
        current: action.payload,
      };
    case 'toggleModal': {
      return {
        ...state,
        showEditModal: !state.showEditModal,
      };
    }
    default:
      throw new Error();
  }
}

const ManagerCertList: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [state, dispatch] = useReducer(reducer, initialState);

  const handleRemoveItem = (e, item) => {
    dispatch({ type: 'remove', payload: item.id });
  };

  const handleEditItem = (e, item) => {
    dispatch({ type: 'edit', payload: item });
  };

  const handleToggleModal = () => {
    dispatch({ type: 'toggleModal' });
  };

  const handleModalSubmit = (values: IManagerCert) => {
    dispatch({ type: 'add', payload: values });
  };

  const columns: ProColumns<IManagerCert>[] = [
    {
      title: '证书名',
      dataIndex: 'name',
    },
    {
      title: '证书编号',
      dataIndex: 'identityNumber',
    },
    {
      title: '证书过期时间',
      dataIndex: 'expiredAt',
    },
    {
      title: '证书类型',
      dataIndex: 'typeName',
    },
    {
      title: '操作',
      render: (text: any, record: IManagerCert) => (
        <>
          <a onClick={e => handleEditItem(e, record)}>更改</a>
          <Divider type="vertical" />
          <span>
            <Popconfirm title="是否要删除此行？" onConfirm={e => handleRemoveItem(e, record)}>
              <a>删除</a>
            </Popconfirm>
          </span>
        </>
      ),
    },
  ];

  return (
    <div>
      <Button type="dashed" style={{ width: '100%', marginBottom: 8 }} onClick={handleToggleModal}>
        <PlusOutlined />
        添加
      </Button>

      <ProTable<IManagerCert>
        search={false}
        toolBarRender={false}
        actionRef={actionRef}
        rowKey="id"
        dataSource={state.list}
        columns={columns}
        dateFormatter="string"
        pagination={false}
      />

      <ManagerCertEditFormModal
        onCancel={handleToggleModal}
        onSubmit={handleModalSubmit}
        visible={state.showEditModal}
        current={state.current}
      />
    </div>
  );
};

export default ManagerCertList;
