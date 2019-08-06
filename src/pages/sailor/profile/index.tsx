import * as React  from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import { Card, Descriptions } from 'antd';
import {Dispatch} from "redux";
import ISailor from "@/interfaces/ISailor";
import {SailorModelState} from "@/models/sailor";
import {RouteComponentProps} from "react-router";

const fieldLabels = {
  name: '船员名',
  identityNumber: "身份证号码",
  isAdvanced: "是否高级船员",
  mobile: "手机号码",
  certFile: "证书电子证件",
  address: "地址",
  positionName: "职位",
  shipName: "所属船舶名"
};

interface SailorDetailsProps extends RouteComponentProps{
  loading: boolean;
  dispatch: Dispatch<any>;
  sailor: ISailor
}

@connect(({ sailor, loading}: {
    sailor: SailorModelState
    loading: { effects: { [key: string]: boolean } }
  }) => ({
    submitting: loading.effects['sailor/target'],
    sailor: sailor.target
  }),
)
class SailorDetails extends React.Component<SailorDetailsProps> {

  componentWillMount() {
    let params = this.props.match.params;
    //@ts-ignore
    if (params && params.id !== undefined) {
      //@ts-ignore
      let sailorId = parseInt(params.id, 10);
      setTimeout(() => {
        this.props.dispatch({
          type: "sailor/target",
          payload: sailorId
        })
      }, 10)
    }
  }

  render() {
    let sailor = this.props.sailor || {};

    return (
      <PageHeaderWrapper title="船员详情页">
        <Card style={{ marginBottom: 24 }} bordered={false}>

          <Descriptions title="基本信息" bordered>
            <Descriptions.Item label={fieldLabels.name}>{sailor.name}</Descriptions.Item>
            <Descriptions.Item label={fieldLabels.isAdvanced}>{sailor.isAdvanced ? "是" : "否" }</Descriptions.Item>
            <Descriptions.Item label={fieldLabels.positionName}>{sailor.positionName}</Descriptions.Item>

            <Descriptions.Item label={fieldLabels.mobile}>{sailor.mobile}</Descriptions.Item>
            <Descriptions.Item label={fieldLabels.identityNumber} span={3}>{sailor.identityNumber}</Descriptions.Item>
            <Descriptions.Item label={fieldLabels.shipName} span={3}>
              {sailor.shipName}
            </Descriptions.Item>

            <Descriptions.Item label={fieldLabels.certFile} span={3}>
              todos
            </Descriptions.Item>

            <Descriptions.Item label={fieldLabels.address}>
              <br />
              {sailor.address}
              <br />
            </Descriptions.Item>
          </Descriptions>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default SailorDetails;
