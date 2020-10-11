import { ProColumns } from '@ant-design/pro-table';
import { IDocument } from '@/interfaces/IDocument';
import React, { useMemo } from 'react';
import { Select, Tag } from 'antd';
import hooks from './hooks';
import { DocumentKeyMap, listDocument } from '@/services/documentService';
import { IPageableFilter } from '@/interfaces/ITableList';
import { ICommonOptionType } from '@/interfaces/ICategory';

interface IUseDocumentTableDeps {
  documentCategoryTypes: ICommonOptionType[];
}

interface IUseDocumentTableExport {
  columns: ProColumns<IDocument>[];
  request: Function;
}

export default function useDocumentTable(options: IUseDocumentTableDeps): IUseDocumentTableExport {
  const columns = useMemo(() => {
    return [
      {
        title: DocumentKeyMap.name,
        dataIndex: 'name',
      },
      {
        title: DocumentKeyMap.documentCategoryTypeName,
        hideInTable: true,
        hideInSearch: false,
        dataIndex: 'documentCategoryTypeId',
        renderFormItem: (item, props) => {
          return (
            <Select placeholder="请选择类型" onSelect={props.onSelect}>
              <Select.Option key={99} value={-1}>
                全部
              </Select.Option>
              {options.documentCategoryTypes?.map((item, index) => {
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
        title: DocumentKeyMap.documentCategoryTypeName,
        dataIndex: 'documentCategoryTypeName',
        hideInSearch: true,
        render(text: string) {
          return <Tag color="blue">{text}</Tag>;
        },
      },
      {
        title: DocumentKeyMap.uploadBy,
        dataIndex: 'uploadBy',
        hideInSearch: false,
      },
      {
        title: DocumentKeyMap.version,
        dataIndex: 'version',
        hideInSearch: true,
      },
      {
        title: '操作',
        render: (text: any, record: IDocument) => (
          <>
            <a onClick={() => hooks.InfoDocument.call(record)}>打印</a>
          </>
        ),
      },
    ] as ProColumns<IDocument>[];
  }, [options.documentCategoryTypes]);

  const requestDocumentList = async (params: IPageableFilter<IDocument>) => {
    let { current = 0, pageSize = 20 } = params;
    let extra = {};

    if (params.name !== undefined) {
      extra['name.contains'] = params.name;
    }

    if (params.uploadBy !== undefined) {
      extra['mobile.contains'] = params.uploadBy;
    }

    if (params.documentCategoryTypeId !== undefined && params.documentCategoryTypeId != -1) {
      extra['documentCategoryTypeId.equals'] = params.documentCategoryTypeId;
    }

    const data = await listDocument(current, pageSize, extra);

    return {
      success: true,
      total: data.pagination.total,
      data: data.list,
    };
  };

  return {
    columns,
    request: requestDocumentList,
  };
}
