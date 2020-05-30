import React, { useRef } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { Button, Card, Divider, Popconfirm, message } from 'antd';
import { useRequest } from '@umijs/hooks';
import { useDispatch, routerRedux } from 'dva'
import { ICompanyLicense } from '@/interfaces/ICompany';
import { deleteCompanyLicense, listCompanyLicense } from '@/services/company';
import { PlusOutlined } from '@ant-design/icons';

const CompanyLicenseList: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const dispatch = useDispatch();

  const { run: deleteCert } = useRequest(deleteCompanyLicense, {
    manual: true,
    onSuccess: () => {
      actionRef.current && actionRef.current.reload();
      message.success('批文成功删除');
    },
    onError: err => {
      console.error(err);
    },
  });

  const requestCompanyLicenseList = async (params: any) => {
    let { current = 0, pageSize = 20, name } = params;
    let extra = {};

    if (name !== undefined) {
      extra['name.contains'] = name;
    }

    const data = await listCompanyLicense(current, pageSize, extra);
    return {
      success: true,
      total: data.pagination.total,
      data: data.list,
    };
  };

  const handleAddCompanyLicense = () => {
    dispatch(routerRedux.push('/company/addLicense'));
  };

  const handleInfoCompanyLicense = (id: number) => {
    dispatch(routerRedux.push(`/company/infoLicense/${id}`));
  };

  const handleUpdateCompanyLicense = (id: number) => {
    dispatch(routerRedux.push(`/company/updateLicense/${id}`));
  };

  const columns: ProColumns<ICompanyLicense>[] = [
    {
      title: '名称',
      dataIndex: 'name',
    },
    {
      title: '批文编号',
      dataIndex: 'identityNumber',
    },
    {
      title: '有效期',
      dataIndex: 'expireAt',
      hideInSearch: true,
    },
    {
      title: '备注',
      dataIndex: 'remark',
    },
    {
      title: '操作',
      render: (text: any, record: ICompanyLicense) => (
        <>
          <a onClick={() => handleInfoCompanyLicense(record.id)}>详情</a>
          <Divider type="vertical" />
          <a onClick={() => handleUpdateCompanyLicense(record.id)}>修改</a>
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
    <PageHeaderWrapper title="公司批文列表">
      <Card bordered={false}>
        <ProTable<ICompanyLicense>
          actionRef={actionRef}
          rowKey="id"
          columns={columns}
          request={requestCompanyLicenseList}
          dateFormatter="string"
          toolBarRender={() => [
            <Button key="3" type="primary" onClick={handleAddCompanyLicense}>
              <PlusOutlined />
              新建批文
            </Button>,
          ]}
        />
      </Card>
    </PageHeaderWrapper>
  );
};

export default CompanyLicenseList;
