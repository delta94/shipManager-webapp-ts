import * as React from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Card, Descriptions } from 'antd';

import PageHeaderWrapper from '@ant-design/pro-layout/es/PageHeaderWrapper';
import { Dispatch } from 'redux';
import { RouteComponentProps } from 'react-router';
import { CompanyCertModelState } from '@/models/companyCert';
import { ICompanyCert } from '@/interfaces/ICompany';

const fieldLabels = {
  name: '证书名',
  identityNumber: '证书编号',
  type: '类型',
  remark: '备注',
  ossFile: '证书电子件',
  expiredAt: '有效期',
};

interface CompanyCertProfileParams {
  id: string;
}

interface CompanyCertProfileProps extends RouteComponentProps<CompanyCertProfileParams> {
  loading: boolean;
  dispatch: Dispatch<any>;
  companyCert: ICompanyCert;
}

@connect(
  ({
    companyCert,
    loading,
  }: {
    companyCert: CompanyCertModelState;
    loading: {
      effects: { [key: string]: boolean };
    };
  }) => ({
    companyCert: companyCert.target,
    loading: loading.effects['companyCert/target'],
  }),
)
class CompanyCertProfile extends React.Component<CompanyCertProfileProps> {
  componentWillMount() {
    const {
      dispatch,
      match: { params },
    } = this.props;
    if (params && params.id) {
      const id = parseInt(params.id, 10);
      dispatch({ type: 'companyCert/target', payload: id });
    }
  }

  render() {
    const cert = this.props.companyCert || ({} as ICompanyCert);

    let ossItems: React.ReactNode = <div>暂未上传任何文件</div>;

    if (cert.ossFile) {
      ossItems = cert.ossFile
        .split(';')
        .map(item => (
          <Card hoverable bordered={false} style={{ width: 240 }} cover={<img src={item} />} />
        ));
    }

    return (
      <PageHeaderWrapper title="公司证书详情页">
        <Card style={{ marginBottom: 24 }} bordered={false}>
          <Descriptions title="基本信息" style={{ marginBottom: 32 }}>
            <Descriptions.Item label={fieldLabels.name}>{cert.name}</Descriptions.Item>
            <Descriptions.Item label={fieldLabels.identityNumber}>
              {cert.identityNumber}
            </Descriptions.Item>
            <Descriptions.Item label={fieldLabels.type}>{cert.typeName}</Descriptions.Item>
            <Descriptions.Item label={fieldLabels.remark}>{cert.remark}</Descriptions.Item>
            <Descriptions.Item label={fieldLabels.expiredAt}>
              {cert.expiredAt ? moment(cert.expiredAt).format('YYYY-MM-DD') : ''}
            </Descriptions.Item>
          </Descriptions>
        </Card>

        <Card style={{ marginBottom: 24 }} bordered={false} title="证书电子件">
          {ossItems}
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default CompanyCertProfile;
