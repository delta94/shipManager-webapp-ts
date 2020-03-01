import React from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable, { ProColumns, TableDropdown } from '@ant-design/pro-table';
import { Button, Card, Form, Divider, Popconfirm, Select } from 'antd';
import { useFormTable } from '@umijs/hooks';
import { PaginatedParams } from '@umijs/use-request/lib/types';
import styles from './style.less';
import { ICompanyCert, ICompanyCertType } from '@/interfaces/ICompany';
import { listCompanyCert } from '@/services/company';
import { ITableResult } from '@/interfaces/ITableList';
import { PlusOutlined } from '@ant-design/icons';

const getTableData = async (
  { current, pageSize }: PaginatedParams[0],
  formData,
): Promise<ITableResult<ICompanyCert>> => {
  console.log(formData);
  let startIndex = current - 1;
  let data = await listCompanyCert(startIndex, pageSize, '');
  return {
    total: data.pagination.total,
    list: data.list,
  };
};

const CompanyCertList = () => {

  const certificateTypes: ICompanyCertType[] = [];

  const handleInfoCompanyCert = (record: ICompanyCert) => {};

  const handleUpdateCompanyCert = (record: ICompanyCert) => {};

  const handleRemoveCompanyCert = (id: number) => {};

  const handleCreateCert = () => {};

  const columns = [
    {
      title: '名称',
      dataIndex: 'name',
      hideInSearch: true,
    },
    {
      title: '证书类型',
      dataIndex: 'typeName',
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
              data: data.list
            }
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
