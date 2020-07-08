import React, { useRef } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { Button, Card, Divider, Popconfirm, Select, message } from 'antd';
import { useRequest } from '@umijs/hooks';
import { useDispatch, routerRedux } from 'dva';
import { PlusOutlined } from '@ant-design/icons';
import { deleteCompanySheet, listCompanyTemplateSheets, listCompanySheetTypes } from '@/services/sheet';
import { ICompanySheet } from '@/interfaces/ICompanySheet';

const TemplateList: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const dispatch = useDispatch();

  const { data } = useRequest(() => listCompanySheetTypes(), {
    cacheKey: 'company_sheet_type',
    initialData: [],
  });

  const { run: deleteRecord } = useRequest(deleteCompanySheet, {
    manual: true,
    onSuccess: () => {
      actionRef.current && actionRef.current.reload();
      message.success('已成功删除');
    },
    onError: err => {
      console.error(err);
    },
  });

  const requestTemplateDocumentList = async (params: any) => {
    let { current = 0, pageSize = 20, typeId, name } = params;
    let extra = {};

    if (typeId !== undefined && typeId !== -1) {
      extra['typeId.equals'] = typeId;
    }

    if (name !== undefined) {
      extra['name.contains'] = name;
    }

    const data = await listCompanyTemplateSheets(current, pageSize, extra);
    return {
      success: true,
      total: data.pagination.total,
      data: data.list,
    };
  };

  const handleAddTemplateSheet = () => {
    dispatch(routerRedux.push('/document/create/template'));
  };

  const handleInfoTemplateSheet = (id: number) => {
    dispatch(routerRedux.push(`/document/profile/${id}`));
  };

  const handlePrintTemplateSheet = (id: number) => {
    //dispatch(routerRedux.push(`/document/updateCert/${id}`));
  };

  const columns: ProColumns<ICompanySheet>[] = [
    {
      title: '名称',
      dataIndex: 'name',
    },
    {
      title: '文件类型',
      dataIndex: 'typeName',
      hideInSearch: true,
    },
    {
      title: '上传者',
      dataIndex: 'uploader',
      hideInSearch: true,
    },
    {
      title: '文件类型',
      hideInTable: true,
      hideInSearch: false,
      dataIndex: 'typeId',
      renderFormItem: (item, props) => {
        return (
          <Select placeholder="请选择文件类型" onChange={props.onChange}>
            <Select.Option key={99} value={-1}>
              不限类型
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
      title: '上传日期',
      dataIndex: 'updateAt',
      hideInSearch: true,
    },
    {
      title: '操作',
      render: (text: any, record: ICompanySheet) => (
        <>
          <a onClick={() => handleInfoTemplateSheet(record.id)}>详情</a>
          <Divider type="vertical" />
          <a onClick={() => handlePrintTemplateSheet(record.id)}>打印</a>
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
    <PageHeaderWrapper title="自定义表单列表">
      <Card bordered={false}>
        <ProTable<ICompanySheet>
          actionRef={actionRef}
          rowKey="id"
          columns={columns}
          request={requestTemplateDocumentList}
          dateFormatter="string"
          toolBarRender={() => [
            <Button key="3" type="primary" onClick={handleAddTemplateSheet}>
              <PlusOutlined />
              新建自定义表单
            </Button>,
          ]}
        />
      </Card>
    </PageHeaderWrapper>
  );
};

export default TemplateList;
