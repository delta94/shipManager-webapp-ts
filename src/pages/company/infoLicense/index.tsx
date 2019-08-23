import * as React from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Card, Descriptions } from 'antd';

import PageHeaderWrapper from '@ant-design/pro-layout/es/PageHeaderWrapper';
import { Dispatch } from 'redux';
import { RouteComponentProps } from 'react-router';
import { CompanyLicenseModelState } from '@/models/companyLicense';
import { ICompanyLicense } from '@/interfaces/ICompany';

const fieldLabels = {
  name: '批文名',
  identityNumber: '批文编号',
  remark: '备注',
  ossFile: '批文电子件',
  expireAt: '有效期',
};

interface CompanyCertProfileParams {
  id: string;
}

interface CompanyCertProfileProps extends RouteComponentProps<CompanyCertProfileParams> {
  loading: boolean;
  dispatch: Dispatch<any>;
  companyLicense: ICompanyLicense;
}

@connect(
  ({
     companyLicense,
     loading,
   }: {
    companyLicense: CompanyLicenseModelState;
    loading: {
      effects: { [key: string]: boolean };
    };
  }) => ({
    companyLicense: companyLicense.target,
    loading: loading.effects['companyLicense/target'],
  }),
)
class CompanyCertProfile extends React.Component<CompanyCertProfileProps> {
  componentWillMount() {
    let {
      dispatch,
      match: { params },
    } = this.props;
    if (params && params.id) {
      const id = parseInt(params.id, 10);
      dispatch({ type: 'companyLicense/target', payload: id });
    }
  }

  render() {
    const license = this.props.companyLicense || ({} as ICompanyLicense);

    let ossItems: React.ReactNode = <div>暂未上传任何文件</div>;

    if (license.ossFile) {
      ossItems = license.ossFile
        .split(';')
        .map(item => (
          <Card hoverable bordered={false} style={{ width: 240 }} cover={<img src={item} />} />
        ));
    }

    return (
      <PageHeaderWrapper title="公司批文详情页">
        <Card style={{ marginBottom: 24 }} bordered={false}>
          <Descriptions title="基本信息" style={{ marginBottom: 32 }}>
            <Descriptions.Item label={fieldLabels.name}>{license.name}</Descriptions.Item>
            <Descriptions.Item label={fieldLabels.identityNumber}>{license.identityNumber}</Descriptions.Item>
            <Descriptions.Item label={fieldLabels.remark}>{license.remark}</Descriptions.Item>
            <Descriptions.Item label={fieldLabels.expireAt}>
              {license.expireAt ? moment(license.expireAt).format('YYYY-MM-DD') : ''}
            </Descriptions.Item>
          </Descriptions>
        </Card>

        <Card style={{ marginBottom: 24 }} bordered={false} title="批文电子件">
          {ossItems}
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default CompanyCertProfile;
