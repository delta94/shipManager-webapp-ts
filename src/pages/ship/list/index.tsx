import React, { useRef, Fragment } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { Button, Card, Divider, Select, Popconfirm, message } from 'antd';
import { useRequest } from '@umijs/hooks';
import { useDispatch, routerRedux } from 'dva';
import { PlusOutlined } from '@ant-design/icons';
import ISailor from '@/interfaces/ISailor';
import { IPageableFilter } from '@/interfaces/ITableList';
import { deleteShip, listShip, listShipTypes } from '@/services/ship';
import IShip from '@/interfaces/IShip';

const ShipList: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const dispatch = useDispatch();

  const { data: shipTypes } = useRequest(() => listShipTypes(), {
    cacheKey: 'ship_type',
    initialData: [],
  });

  const { run: handleDeleteShip } = useRequest(deleteShip, {
    manual: true,
    onSuccess: () => {
      actionRef.current && actionRef.current.reload();
      message.success('船舶已成功删除');
    },
    onError: err => {
      console.error(err);
    },
  });

  const requestShipList = async (params: IPageableFilter<IShip>) => {
    let { current = 0, pageSize = 20 } = params;
    let extra = {};

    if (params.name !== undefined) {
      extra['name.contains'] = params.name;
    }

    if (params.typeId !== undefined && params.typeId != -1) {
      extra['typeId.equals'] = params.typeId;
    }

    const data = await listShip(current, pageSize, extra);

    return {
      success: true,
      total: data.pagination.total,
      data: data.list,
    };
  };

  const handleAddShip = () => {
    dispatch(routerRedux.push('/ship/create'));
  };

  const handleUpdateShip = (id: number) => {
    dispatch(routerRedux.push(`/ship/update/${id}`));
  };

  const handleInfoShip = (id: number) => {
    dispatch(routerRedux.push(`/ship/profile/${id}`));
  };

  const columns: ProColumns<IShip>[] = [
    {
      title: '船舶名',
      dataIndex: 'name',
    },
    {
      title: '类型',
      dataIndex: 'typeName',
      hideInSearch: true,
    },
    {
      title: '船舶共有情况',
      dataIndex: 'shareInfo',
      hideInSearch: true,
    },
    {
      title: '总吨数',
      dataIndex: 'grossTone',
      sorter: true,
      render: val => `${val} 吨`,
      hideInSearch: true,
    },
    {
      title: '净吨数',
      dataIndex: 'netTone',
      sorter: true,
      render: val => `${val} 吨`,
      hideInSearch: true,
    },
    {
      title: '职位类型',
      hideInTable: true,
      hideInSearch: false,
      dataIndex: 'typeId',
      renderFormItem: (item, props) => {
        return (
          <Select placeholder="请选择类型" onChange={props.onChange}>
            <Select.Option key={99} value={-1}>
              不限类型
            </Select.Option>
            {shipTypes &&
              shipTypes.map((item, index) => {
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
      render: (text, record) => (
        <Fragment>
          <a onClick={() => handleInfoShip(record)}>详情</a>
          <Divider type="vertical" />
          <a onClick={() => handleUpdateShip(record)}>修改</a>
          <Divider type="vertical" />
          <Popconfirm title="是否要删除此船舶？" onConfirm={() => handleDeleteShip(record)}>
            <a>删除</a>
          </Popconfirm>
        </Fragment>
      ),
    },
  ];

  return (
    <PageHeaderWrapper title="船舶列表">
      <Card bordered={false}>
        <ProTable<IShip>
          actionRef={actionRef}
          rowKey="id"
          columns={columns}
          //@ts-ignore
          request={requestShipList}
          dateFormatter="string"
          toolBarRender={() => [
            <Button type="primary" onClick={handleAddShip}>
              <PlusOutlined />
              新建船舶
            </Button>,
          ]}
        />
      </Card>
    </PageHeaderWrapper>
  );
};

export default ShipList;
