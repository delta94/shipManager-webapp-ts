import * as React from 'react';
import { connect } from 'dva';

import { Card, Table, Descriptions } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { ManagerModelState } from '@/models/manager';
import { Dispatch } from 'redux';
import { RouteComponentProps } from 'react-router';
import { IManager } from '@/interfaces/IManager';

const fieldLabels = {
  name: '管理人员姓名',
  identityNumber: '身份证号码',
  assignerName: '指定职位',
  mobile: '手机号码',
  phone: '座机电话',
  dept: '部门',
  position: '职务',
};

interface Params {
  id: string;
}

interface ManagerDetailsProps extends RouteComponentProps<Params> {
  loading: boolean;
  dispatch: Dispatch<any>;
  manager: IManager;
}

@connect(
  ({
    manager,
    loading,
  }: {
    manager: ManagerModelState;
    loading: { effects: { [key: string]: boolean } };
  }) => ({
    loading: loading.effects['manager/target'],
    manager: manager.target,
  }),
)
class ManagerDetails extends React.Component<ManagerDetailsProps> {
  componentWillMount() {
    if (this.props.match.params.id) {
      const managerId = parseInt(this.props.match.params.id, 10);
      setTimeout(() => {
        this.props.dispatch({
          type: 'manager/target',
          payload: managerId,
        });
      }, 10);
    }
  }

  render() {
    const { loading } = this.props;
    const manager = this.props.manager || {};

    const renderContent = (value: any) => ({
      children: value,
      props: {},
    });
    const certsColumns = [
      {
        title: '证书名',
        dataIndex: 'name',
        key: 'name',
        render: renderContent,
      },
      {
        title: '证书类型',
        dataIndex: 'typeName',
        key: 'typeName',
        render: renderContent,
      },
      {
        title: '证书编号',
        dataIndex: 'identityNumber',
        key: 'identityNumber',
        render: renderContent,
      },
      {
        title: '到期时间',
        dataIndex: 'expiredAt',
        key: 'expiredAt',
        render: renderContent,
      },
    ];

    return (
      <PageHeaderWrapper title="管理人员详情页">
        <Card style={{ marginBottom: 24 }} bordered={false}>
          <Descriptions title="基本信息" style={{ marginBottom: 32 }}>
            <Descriptions.Item label={fieldLabels.name}>{manager.name}</Descriptions.Item>
            <Descriptions.Item label={fieldLabels.identityNumber}>
              {manager.identityNumber}
            </Descriptions.Item>
            <Descriptions.Item label={fieldLabels.assignerName}>
              {manager.assignerName}
            </Descriptions.Item>
            <Descriptions.Item label={fieldLabels.mobile}>{manager.mobile}</Descriptions.Item>
            <Descriptions.Item label={fieldLabels.phone}>{manager.phone}</Descriptions.Item>
            <Descriptions.Item label={fieldLabels.dept}>{manager.dept}</Descriptions.Item>
            <Descriptions.Item label={fieldLabels.position}>{manager.position}</Descriptions.Item>
          </Descriptions>
        </Card>

        <Card bordered={false}>
          <Descriptions title="证书信息" />
          <Table
            style={{ marginBottom: 24 }}
            pagination={false}
            loading={loading}
            dataSource={manager.certs}
            columns={certsColumns}
            rowKey="id"
          />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default ManagerDetails;
