import React from 'react';
import { Result, Button } from 'antd';
import { history } from 'umi';
import { saveAs } from '@/utils/fileSaver';
import { IDocument } from '@/interfaces/IDocument';

interface DocumentResultProps {
  template?: IDocument;
  fileName: string;
}

const DocumentResult: React.FC<DocumentResultProps> = ({ fileName, template }) => {
  const backToList = () => {
    history.push('/document/list');
  };

  const downloadFile = () => {
    saveAs(`/api/documents/download/${fileName}`);
  };

  return (
    <Result
      status="success"
      title={`${template?.name}   已成功生成`}
      subTitle="点击下载文件，下载到本地后打印"
      extra={[
        <Button type="primary" key="download" onClick={downloadFile}>
          下载文件
        </Button>,
        <Button key="back" onClick={backToList}>
          返回列表
        </Button>
      ]}
    />
  );
};

export default DocumentResult;
