import * as React from 'react';
import { connect } from 'dva';
import { Button, Card, Descriptions } from 'antd';

import PageHeaderWrapper from '@ant-design/pro-layout/es/PageHeaderWrapper';
import { Dispatch } from 'redux';
import { RouteComponentProps } from 'react-router';
import { CompanySheetState } from '@/models/companySheet';
import { ICompanySheet } from '@/interfaces/ICompanySheet';
import OSSClient from '@/utils/OSSClient';

const fieldLabels = {
  name: '证书名',
  type: '类型',
  template: '是否为模版',
  remark: '备注',
  ossFile: '证书电子件',
  updateAt: '更新日期',
};

interface CompanySheetProfileParams {
  id: string;
}

interface CompanySheetProfileProps extends RouteComponentProps<CompanySheetProfileParams> {
  loading: boolean;
  dispatch: Dispatch<any>;
  companySheet: ICompanySheet;
}

@connect(
  ({
    companySheet,
    loading,
  }: {
    companySheet: CompanySheetState;
    loading: {
      effects: { [key: string]: boolean };
    };
  }) => ({
    companySheet: companySheet.target,
    loading: loading.effects['companySheet/target'],
  }),
)
class CompanySheetProfile extends React.Component<CompanySheetProfileProps> {
  componentWillMount() {
    const {
      dispatch,
      match: { params },
    } = this.props;
    if (params && params.id) {
      const id = parseInt(params.id, 10);
      dispatch({ type: 'companySheet/target', payload: id });
    }
  }

  handleDownloadFile = async () => {
    let ossKey = this.props.companySheet.ossFile;
    let client = await OSSClient.getInstance();
    let url = client.signatureUrl(ossKey);

    let a = document.createElement('a');
    a.href = url;
    a.download = url.split('/').pop() || '';
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  render() {
    const sheet = this.props.companySheet || ({} as ICompanySheet);

    return (
      <PageHeaderWrapper title="文件详情页">
        <Card style={{ marginBottom: 24 }} bordered={false}>
          <Descriptions title="基本信息">
            <Descriptions.Item label={fieldLabels.name}>{sheet.name}</Descriptions.Item>
            <Descriptions.Item label={fieldLabels.template}>
              {sheet.isTemplate ? '是' : '否'}
            </Descriptions.Item>
            <Descriptions.Item label={fieldLabels.type}>{sheet.typeName}</Descriptions.Item>
            <Descriptions.Item label={fieldLabels.updateAt}>{sheet.updateAt}</Descriptions.Item>
          </Descriptions>
        </Card>

        <Card style={{ marginBottom: 24 }} bordered={false} title="文件">
          <Descriptions.Item label={fieldLabels.ossFile}>
            {sheet.ossFile ? sheet.ossFile : ''}
          </Descriptions.Item>
          <br />
          <br />
          <Button onClick={this.handleDownloadFile}>下载文件</Button>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default CompanySheetProfile;
