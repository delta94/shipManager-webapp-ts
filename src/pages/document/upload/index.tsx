import React from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Result, Button } from 'antd';
import { history } from 'umi';
const DocumentUpload: React.FC = (props) => {

  const backToList = () => {
    history.push('/document/list');
  };

  return (
    <PageHeaderWrapper title="模版上传">
      <Result
        status="404"
        title="404"
        subTitle="模版上传功能正在开发中"
        extra={
          <Button type="primary" onClick={backToList}>
            查看模版
          </Button>
        }
      />
    </PageHeaderWrapper>
  );
};

export default DocumentUpload;
