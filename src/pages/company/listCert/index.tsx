import React from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { Button, Card, Divider, Popconfirm, Select } from 'antd';
import { useRequest } from '@umijs/hooks';
import { ICompanyCert } from '@/interfaces/ICompany';
import { listCompanyCert, listCompanyCertType } from '@/services/company';
import { PlusOutlined } from '@ant-design/icons';

const CompanyCertList = () => {
  const { data } = useRequest(() => listCompanyCertType(), {
    cacheKey: 'company_cert_type',
    initialData: [],
  });

  const handleInfoCompanyCert = (record: ICompanyCert) => {};

  const handleUpdateCompanyCert = (record: ICompanyCert) => {};

  const handleRemoveCompanyCert = (id: number) => {};

  const handleCreateCert = () => {};

  const columns = [
    {
      title: '名称',
      dataIndex: 'name',
    },
    {
      title: '证书类型',
      dataIndex: 'typeName',
      renderFormItem: () => {
        return (
          <Select placeholder="请选择证书类型">
            <Select.Option value={-1} key={99}>
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
      title: '证书号',
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
            <Popconfirm
              title="是否要删除此行？"
              onConfirm={() => handleRemoveCompanyCert(record.id)}
            >
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
          columns={columns}
          request={async (params = {}) => {
            const data = await listCompanyCert(params.current, params.pageSize);
            return {
              success: true,
              total: data.pagination.total,
              data: data.list,
            };
          }}
          rowKey="id"
          dateFormatter="string"
          toolBarRender={() => [
            <Button key="3" type="primary">
              <PlusOutlined />
              新建
            </Button>,
          ]}
        />
      </Card>
    </PageHeaderWrapper>
  );
};

export default CompanyCertList;
