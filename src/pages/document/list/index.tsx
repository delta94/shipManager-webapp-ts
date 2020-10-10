import React, { useRef, useEffect } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable, { ActionType } from '@ant-design/pro-table';
import { Card, message } from 'antd';
import { useRequest, history } from 'umi';
import { deleteDocument, listDocumentCategory } from '@/services/documentService';
import { IDocument } from '@/interfaces/IDocument';
import hooks from './hooks';
import useDocumentTable from "./useDocumentTable";

const DocumentList: React.FC = () => {
  const actionRef = useRef<ActionType>();

  const { run: deleteDocumentRecord } = useRequest(deleteDocument, {
    manual: true,
    onSuccess: () => {
      actionRef.current?.reload();
      message.success('已成功删除模版');
    },
    onError: (err) => {
      message.error('删除模版时出错');
      console.error(err);
    },
  });

  useEffect(() => {
    const unTapDeleteDocument = hooks.DeleteDocument.tap((document) => {
      deleteDocumentRecord(document.id);
    });
    const unTapInfoDocument = hooks.InfoDocument.tap((document) => {
      history.push(`/document/generate/${document.id}`);
    });
    const unTapEditDocument = hooks.EditDocument.tap((document) => {

    });
    return () => {
      unTapDeleteDocument();
      unTapInfoDocument();
      unTapEditDocument();
    };
  }, []);

  const { data: optionTypes } = useRequest(listDocumentCategory, {
    manual: false,
    cacheKey: 'document_category_type',
  });

  const { columns, request } = useDocumentTable({
    documentCategoryTypes: optionTypes?.DocumentCategoryType ?? []
  });

  return (
    <PageHeaderWrapper title="打印表单列表">
      <Card bordered={false}>
        <ProTable<IDocument>
          actionRef={actionRef}
          rowKey="id"
          columns={columns}
          //@ts-ignore
          request={request}
          dateFormatter="string"
        />
      </Card>
    </PageHeaderWrapper>
  );
};

export default DocumentList;
