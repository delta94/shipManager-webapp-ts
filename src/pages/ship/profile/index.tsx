import React, { Component } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Card, Badge, Table, Descriptions } from 'antd';

import styles from './style.less';
import PageHeaderWrapper from "@ant-design/pro-layout/es/PageHeaderWrapper";
import {Dispatch} from "redux";
import {ShipStateType} from "@/models/ship";
import IShip from "@/interfaces/IShip";
import {RouteComponentProps} from "react-router";

const fieldLabels = {
  name: '船舶名',
  carrierIdentifier: "船舶识别号",
  owner: "船舶所有人",
  shareInfo: "船舶共有情况",
  harbor: "船籍港",
  formerName: "曾用名",
  registerIdentifier: "初次登记号",
  examineIdentifier: "船检登记号",
  material: "船舶材质",
  buildAt: "建造完工日期",
  assembleAt:"安放龙骨日期",
  type: '船舶类型',
  sailorCount: "船员总人数",
  power: '发动机功率',
  grossTone: '总吨位 (吨)',
  netTone: '净吨位 (吨)',
  length: '船身长 (米)',
  width: '船身宽 (米)',
  depth: '船身深 (米)',
  height: '船身高 (米)'
};

const sailorColumn = [
  {
    title: '姓名',
    dataIndex: 'name',
  },
  {
    title: '常任职位',
    dataIndex: 'positionName'
  },
  {
    title: '手机号码',
    dataIndex: 'mobile',
  },
  {
    title: '身份证',
    dataIndex: 'identityNumber'
  },
  {
    title: '是否高级船员',
    dataIndex: 'isAdvanced',
    key: 'isAdvanced',
    render: (isAdvanced: boolean) => isAdvanced ? <Badge status="success" text="是" /> : <Badge status="error" text="否" />
  },
];


const payloadColumn = [
  {
    title: '航区类型',
    dataIndex: 'areaName',
    key: 'areaName'
  },
  {
    title: '载重吨数',
    dataIndex: 'tone',
    key: 'tone',
    render: (payload: number) => `${payload} 吨`
  }
];

interface ShipProfileProps extends RouteComponentProps {
  loading: boolean;
  dispatch: Dispatch<any>;
  ship: ShipStateType;
}

interface ShipProfileState {

}

@connect(
  ({
     ship,
     loading,
   }: {
    ship: ShipStateType,
    loading: {
      effects: { [key: string]: boolean };
    };
  }) => ({
    ship,
    loading: loading.effects['ship/target'],
  }),
)
class ShipProfile extends Component<ShipProfileProps, ShipProfileState> {

  componentWillMount() {

    if (this.props.match.params) {
      // @ts-ignore
      let shipId = parseInt(this.props.match.params.id, 10);
      setTimeout(() => {
        this.props.dispatch({
          type: "ship/target",
          payload: shipId
        })
      }, 10)
    }
  }

  render() {
    let ship = this.props.ship.target || {} as IShip;

    return (
      <PageHeaderWrapper title="船舶详情页">
        <Card style={{ marginBottom: 24 }} bordered={false}>
          <Descriptions title="基本信息" style={{ marginBottom: 32 }}>
            <Descriptions.Item label={fieldLabels.name}>{ship.name}</Descriptions.Item>
            <Descriptions.Item label={fieldLabels.carrierIdentifier}>{ship.carrierIdentifier}</Descriptions.Item>
            <Descriptions.Item label={fieldLabels.owner}>{ship.owner}</Descriptions.Item>
            <Descriptions.Item label={fieldLabels.type}>{ship.typeName}</Descriptions.Item>
          </Descriptions>

          <Descriptions title="其他信息" style={{ marginBottom: 32 }}>
            <Descriptions.Item label={fieldLabels.shareInfo}>{ship.shareInfo}</Descriptions.Item>
            <Descriptions.Item label={fieldLabels.registerIdentifier}>{ship.registerIdentifier}</Descriptions.Item>
            <Descriptions.Item label={fieldLabels.examineIdentifier}>{ship.examineIdentifier}</Descriptions.Item>
            <Descriptions.Item label={fieldLabels.material}>{ship.materialName}</Descriptions.Item>
            <Descriptions.Item label={fieldLabels.harbor}>{ship.harbor}</Descriptions.Item>
            <Descriptions.Item label={fieldLabels.formerName}>{ship.formerName}</Descriptions.Item>
            <Descriptions.Item label={fieldLabels.buildAt}>{ship.buildAt ? moment(ship.buildAt).format("YYYY-MM-DD") : ""}</Descriptions.Item>
            <Descriptions.Item label={fieldLabels.assembleAt}>{ship.assembleAt ? moment(ship.assembleAt).format("YYYY-MM-DD") : ""}</Descriptions.Item>
          </Descriptions>

          <Descriptions title="船舶参数" style={{ marginBottom: 32 }}>
            <Descriptions.Item label={fieldLabels.grossTone}>{ship.grossTone}</Descriptions.Item>
            <Descriptions.Item label={fieldLabels.netTone}>{ship.netTone}</Descriptions.Item>
            <Descriptions.Item label={fieldLabels.sailorCount}>{ship.sailorCount}</Descriptions.Item>
            <Descriptions.Item label={fieldLabels.length}>{ship.length}</Descriptions.Item>
            <Descriptions.Item label={fieldLabels.width}>{ship.width}</Descriptions.Item>
            <Descriptions.Item label={fieldLabels.height}>{ship.height}</Descriptions.Item>
            <Descriptions.Item label={fieldLabels.depth}>{ship.depth}</Descriptions.Item>
          </Descriptions>
        </Card>

        <Card  style={{ marginBottom: 24 }} bordered={false}>
          <div className={styles.title}>船员信息</div>
          <Table size="middle" bordered={false} pagination={false} dataSource={ship.sailors} columns={sailorColumn} />
        </Card>

        <Card  style={{ marginBottom: 24 }} bordered={false}>
          <div className={styles.title}>载重吨信息</div>
          <Table size="middle" bordered={false} pagination={false} dataSource={ship.payloads} columns={payloadColumn} />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default ShipProfile;
