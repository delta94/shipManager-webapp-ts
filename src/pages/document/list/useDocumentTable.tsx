import { ProColumns } from '@ant-design/pro-table';
import { IDocument } from '@/interfaces/IDocument';
import React, { useMemo } from 'react';
import { Tag } from 'antd';
import hooks from './hooks';
import { DocumentKeyMap, listDocument } from '@/services/documentService';
import { IPageableFilter } from '@/interfaces/ITableList';
import CategorySelect from '@/components/CategorySelect';

interface IUseDocumentTableDeps {}

interface IUseDocumentTableExport {
  columns: ProColumns<IDocument>[];
  request: any;
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
        dataIndex: 'documentCategoryTypeName',
        search: {
          transform: (val) => {
            if (val == -1) return undefined;
            return {
              'documentCategoryType.equals': val,
            };
          },
        },
        render(text: string) {
          return <Tag color="blue">{text}</Tag>;
        },
        renderFormItem: (item, props) => {
          return <CategorySelect placeholder="请选择类型" category="DocumentCategoryType" onSelect={props.onSelect} />;
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
  }, []);

  const requestDocumentList = async (params: IPageableFilter<IDocument>) => {
    let { current = 0, pageSize = 20, ...extra } = params;

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
