import React, { useRef } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { Button, Card, Divider, Popconfirm, Select, message } from 'antd';
import { useRequest } from '@umijs/hooks';
import { useDispatch, routerRedux } from 'dva';
import { PlusOutlined } from '@ant-design/icons';
import { listManager, deleteManager, listManagerAssignerPosition } from '@/services/manager';
import { IPageableFilter } from '@/interfaces/ITableList';
import { IManager } from '@/interfaces/IManager';

const ManagerList: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const dispatch = useDispatch();

  const { data: sailorPositions } = useRequest(listManagerAssignerPosition, {
    cacheKey: 'manager_assigner_pos',
    initialData: [],
  });

  const { run: deleteRecord } = useRequest(deleteManager, {
    manual: true,
    onSuccess: () => {
      actionRef.current && actionRef.current.reload();
      message.success('已成功删除');
    },
    onError: err => {
      console.error(err);
    },
  });

  const requestManagerList = async (params: IPageableFilter<IManager>) => {
    let { current = 0, pageSize = 20 } = params;
    let extra = {};

    if (params.name !== undefined) {
      extra['name.contains'] = params.name;
    }

    if (params.mobile !== undefined) {
      extra['mobile.contains'] = params.mobile;
    }

    if (params.identityNumber !== undefined) {
      extra['identityNumber.contains'] = params.identityNumber;
    }

    const data = await listManager(current, pageSize, extra);

    return {
      success: true,
      total: data.pagination.total,
      data: data.list,
    };
  };

  const handleAddManager = () => {
    dispatch(routerRedux.push('/person/manager/create'));
  };

  const handleUpdateManager = (id: number) => {
    dispatch(routerRedux.push(`/person/manager/update/${id}`));
  };

  const handleInfoManager = (id: number) => {
    dispatch(routerRedux.push(`/person/manager/profile/${id}`));
  };

  const columns: ProColumns<IManager>[] = [
    {
      title: '姓名',
      dataIndex: 'name',
    },
    {
      title: '职务',
      dataIndex: 'position',
      hideInSearch: false,
    },
    {
      title: '身份证',
      dataIndex: 'identityNumber',
    },
    {
      title: '指定职位',
      dataIndex: 'assignerName',
      hideInSearch: false,
    },
    {
      title: '手机号码',
      dataIndex: 'mobile',
    },
    {
      title: '职位类型',
      hideInTable: true,
      hideInSearch: false,
      dataIndex: 'positionId',
      renderFormItem: (item, props) => {
        return (
          <Select placeholder="请选择类型" onChange={props.onChange}>
            <Select.Option key={99} value={-1}>
              不限类型
            </Select.Option>
            {sailorPositions &&
              sailorPositions.map((item, index) => {
                return (
                  <Select.Option value={item.id} key={index}>
                    {item.name}
                  </Select.Option>
                );
              })}
          </Select>
        );
      },
    },
    {
      title: '操作',
      render: (text: any, record: IManager) => (
        <>
          <a onClick={() => handleInfoManager(record.id)}>详情</a>
          <Divider type="vertical" />
          <a onClick={() => handleUpdateManager(record.id)}>更改</a>
          <Divider type="vertical" />
          <span>
            <Popconfirm title="是否要删除此行？" onConfirm={() => deleteRecord(record.id)}>
              <a>删除</a>
            </Popconfirm>
          </span>
        </>
      ),
    },
  ];

  return (
    <PageHeaderWrapper title="管理人员列表">
      <Card bordered={false}>
        <ProTable<IManager>
          actionRef={actionRef}
          rowKey="id"
          columns={columns}
          //@ts-ignore
          request={requestManagerList}
          dateFormatter="string"
          toolBarRender={() => [
            <Button key="3" type="primary" onClick={handleAddManager}>
              <PlusOutlined />
              新建管理人员
            </Button>,
          ]}
        />
      </Card>
    </PageHeaderWrapper>
  );
};

export default ManagerList;
