import React, { useRef } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { Button, Card, Divider, Popconfirm, Select, message } from 'antd';
import { useRequest } from '@umijs/hooks';
import { ICompanyCert } from '@/interfaces/ICompany';
import { deleteCompanyCert, listCompanyCert, listCompanyCertType } from '@/services/company';
import { PlusOutlined } from '@ant-design/icons';

const CompanyCertList: React.FC = () => {
  const actionRef = useRef<ActionType>();

  const { data } = useRequest(() => listCompanyCertType(), {
    cacheKey: 'company_cert_type',
    initialData: [],
  });

  const { run: deleteCert } = useRequest(deleteCompanyCert, {
    manual: true,
    onSuccess: () => {
      actionRef.current && actionRef.current.reload();
      message.success('证书已成功删除');
    },
    onError: err => {
      console.error(err);
    },
  });

  const requestCompanyList = async (params: any) => {
    let { current = 0, pageSize = 20, typeId, name } = params;
    let extra = {};

    if (typeId !== undefined && typeId !== -1) {
      extra['typeId.equals'] = typeId;
    }

    if (name !== undefined) {
      extra['name.contains'] = name;
    }

    const data = await listCompanyCert(current, pageSize, extra);
    return {
      success: true,
      total: data.pagination.total,
      data: data.list,
    };
  };

  const handleInfoCompanyCert = (record: ICompanyCert) => {};

  const handleUpdateCompanyCert = (record: ICompanyCert) => {};

  const columns: ProColumns<ICompanyCert>[] = [
    {
      title: '名称',
      dataIndex: 'name',
    },
    {
      title: '证书类型',
      dataIndex: 'typeName',
      hideInSearch: true,
    },
    {
      title: '证书类型',
      hideInTable: true,
      hideInSearch: false,
      dataIndex: 'typeId',
      renderFormItem: (item, props) => {
        return (
          <Select placeholder="请选择证书类型" onChange={props.onChange}>
            <Select.Option key={99} value={-1}>
              不限证书类型
            </Select.Option>
            {data &&
              data.map((item, index) => {
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
      title: '证书编号',
      dataIndex: 'identityNumber',
    },
    {
      title: '有效期',
      dataIndex: 'expiredAt',
      hideInSearch: true,
    },
    {
      title: '操作',
      render: (text: any, record: ICompanyCert) => (
        <>
          <a onClick={() => handleInfoCompanyCert(record)}>详情</a>
          <Divider type="vertical" />
          <a onClick={() => handleUpdateCompanyCert(record)}>修改</a>
          <Divider type="vertical" />
          <span>
            <Popconfirm title="是否要删除此行？" onConfirm={() => deleteCert(record.id)}>
              <a>删除</a>
            </Popconfirm>
          </span>
        </>
      ),
    },
  ];

  return (
    <PageHeaderWrapper title="公司证书列表">
      <Card bordered={false}>
        <ProTable<ICompanyCert>
          actionRef={actionRef}
          rowKey="id"
          columns={columns}
          request={requestCompanyList}
          dateFormatter="string"
          toolBarRender={() => [
            <Button key="3" type="primary">
              <PlusOutlined />
              新建证书
            </Button>,
          ]}
        />
      </Card>
    </PageHeaderWrapper>
  );
};

export default CompanyCertList;
