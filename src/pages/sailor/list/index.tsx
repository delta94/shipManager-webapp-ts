import React, { useRef } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { Button, Card, Divider, Popconfirm, Select, message } from 'antd';
import { useRequest } from '@umijs/hooks';
import { useDispatch, routerRedux } from 'dva';
import { PlusOutlined } from '@ant-design/icons';
import ISailor from '@/interfaces/ISailor';
import { deleteSailor, listSailor, listSailorPosition } from '@/services/sailor';
import { IPageableFilter } from '@/interfaces/ITableList';

const SailorList: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const dispatch = useDispatch();

  const { data: sailorPositions } = useRequest(() => listSailorPosition(), {
    cacheKey: 'sailor_position_type',
    initialData: [],
  });

  const { run: deleteRecord } = useRequest(deleteSailor, {
    manual: true,
    onSuccess: () => {
      actionRef.current && actionRef.current.reload();
      message.success('已成功删除');
    },
    onError: err => {
      console.error(err);
    },
  });

  const requestSailorList = async (params: IPageableFilter<ISailor>) => {
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

    // @ts-ignore
    if (params.isAdvanced !== undefined && params.isAdvanced != 'extra') {
      extra['isAdvanced.equals'] = params.isAdvanced;
    }

    if (params.positionId !== undefined && params.positionId !== -1) {
      extra['positionId.equals'] = params.positionId;
    }

    const data = await listSailor(current, pageSize, extra);

    return {
      success: true,
      total: data.pagination.total,
      data: data.list,
    };
  };

  const handleAddSailor = () => {
    dispatch(routerRedux.push('/person/sailor/create'));
  };

  const handleUpdateSailor = (id: number) => {
    dispatch(routerRedux.push(`/person/sailor/update/${id}`));
  };

  const handleInfoSailor = (id: number) => {
    dispatch(routerRedux.push(`/person/sailor/profile/${id}`));
  };

  const columns: ProColumns<ISailor>[] = [
    {
      title: '姓名',
      dataIndex: 'name',
    },
    {
      title: '常任职位',
      dataIndex: 'positionName',
      hideInSearch: true,
    },
    {
      title: '身份证',
      dataIndex: 'identityNumber',
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
      title: '是否高级',
      width: 120,
      dataIndex: 'isAdvanced',
      valueEnum: {
        extra: { text: '不限', status: 'Success' },
        true: { text: '是', status: 'Success' },
        false: { text: '否', status: 'Error' },
      },
    },
    {
      title: '操作',
      render: (text: any, record: ISailor) => (
        <>
          <a onClick={() => handleInfoSailor(record.id)}>详情</a>
          <Divider type="vertical" />
          <a onClick={() => handleUpdateSailor(record.id)}>更改</a>
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
    <PageHeaderWrapper title="船员列表">
      <Card bordered={false}>
        <ProTable<ISailor>
          actionRef={actionRef}
          rowKey="id"
          columns={columns}
          //@ts-ignore
          request={requestSailorList}
          dateFormatter="string"
          toolBarRender={() => [
            <Button key="3" type="primary" onClick={handleAddSailor}>
              <PlusOutlined />
              新建船员
            </Button>,
          ]}
        />
      </Card>
    </PageHeaderWrapper>
  );
};

export default SailorList;
