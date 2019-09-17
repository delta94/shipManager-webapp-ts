import { Card, Steps } from 'antd';
import React, { Component } from 'react';

import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';

import ShipBasicForm from './components/ShipBasicForm';
import ShipPayloadForm from './components/ShipPayloadForm';
import ShipCertForm from './components/ShipCertForm';
import ShipCreateResultPage from './components/ShipCreatedPage';

import { ShipStateType } from '@/models/ship';
import { FormComponentProps } from 'antd/es/form';
import { Dispatch } from 'redux';
import IShip, {
  IShipBusinessArea,
  IShipCertType,
  IShipMaterial,
  IShipType,
} from '@/interfaces/IShip';
import styles from './style.less';
import ShipSailorForm from "@/pages/ship/create/components/ShipSailorForm";
import {SailorModelState} from "@/models/sailor";
import {ISailorPosition} from "@/interfaces/ISailor";

const { Step } = Steps;

export enum ShipCreateStep {
  Basic,
  Payload,
  Certificate,
  Sailor,
  Result,
}

interface ShipCreateState {
  current: ShipCreateStep;
  ship: Partial<IShip>;
}

interface ShipCreateProps extends FormComponentProps {
  dispatch: Dispatch<any>;
  submitting: boolean;
  types: IShipType[];
  materials: IShipMaterial[];
  businessAreas: IShipBusinessArea[];
  certificateTypes: IShipCertType[];
  sailorPosition: ISailorPosition[],
}

@connect(
  ({
    ship,
    sailor,
    loading,
  }: {
    ship: ShipStateType;
    sailor: SailorModelState,
    loading: { effects: { [key: string]: boolean } };
  }) => ({
    types: ship.types,
    materials: ship.materials,
    businessAreas: ship.businessAreas,
    certificateTypes: ship.certificateTypes,
    sailorPosition: sailor.positions,
    loading: loading.effects['ship/create'],
  }),
)
class ShipCreate extends Component<ShipCreateProps, ShipCreateState> {
  state = {
    current: ShipCreateStep.Certificate,
    ship: {
      carrierIdentifier: '3242MIII',
      examineIdentifier: '432423',
      formerName: '',
      grossTone: 322,
      depth: 32,
      harbor: 'XX',
      height: 32,
      length: 3232,
      width: 32,
      materialId: 2,
      name: 'zha',
      netTone: 23,
      owner: '阿健',
      registerIdentifier: 'E324234',
      shareInfo: 'TTE',
      typeId: 3,
      payloads: [
        {
          id: 1,
          tone: 12,
          remark: 'remark 33',
          areaId: 1,
        },
        {
          id: 2,
          tone: 22,
          remark: 'remark 22',
          areaId: 2,
        },
      ],
      sailors: [{
        id: 1,
        name: "AAA",
        identityNumber: "34234242424",
        isAdvanced: true,
        mobile: "1387747878788",
        positionId: 1,
      }, {
        id: 2,
        name: "BBBB",
        identityNumber: "231332423423",
        isAdvanced: true,
        mobile: "1892882365469",
        positionId: 2,
      }],
      certificates: [
        {
          id: 1,
          identityNumber: 132313213,
          expiredAt: '2017-03-05',
          ossFile: 'http://ship-manager.oss-cn-shenzhen.aliyuncs.com/20190915/2_na7c8ly44hp.jpg',
          remark: 'remark',
          issueBy: 'GZ DEP',
          typeId: 1,
        },
        {
          id: 2,
          identityNumber: 3232332323,
          expiredAt: '2017-09-05',
          ossFile: 'http://ship-manager.oss-cn-shenzhen.aliyuncs.com/20190915/2_na7c8ly44hp.jpg',
          remark: 'remark 22',
          issueBy: 'GF DEP',
          typeId: 2,
        },
      ],
    },
  };

  componentDidMount() {
    this.props.dispatch({ type: 'ship/fetchTypes' });
    this.props.dispatch({ type: 'ship/fetchBusinessAreas' });
    this.props.dispatch({ type: 'ship/fetchMaterial' });
    this.props.dispatch({ type: 'ship/fetchCertificateType' });
    this.props.dispatch({ type: 'sailor/fetchPositionTypes' })
  }

  switchToStep = (index: ShipCreateStep, shipData: Partial<IShip>) => {
    let ship = { ...this.state.ship, ...shipData };
    this.setState({ current: index, ship });
  };

  resetStepForm = () => {
    this.setState({
      current: ShipCreateStep.Basic,
      ship: {},
    });
  };

  render() {
    let { materials, types, businessAreas, certificateTypes, sailorPosition } = this.props;
    let stepComponent;

    if (this.state.current === ShipCreateStep.Basic) {
      stepComponent = (
        <ShipBasicForm
          ship={this.state.ship}
          materials={materials}
          types={types}
          businessAreas={businessAreas}
          switchToStep={this.switchToStep}
        />
      );
    } else if (this.state.current === ShipCreateStep.Payload) {
      stepComponent = (
        <ShipPayloadForm
          ship={this.state.ship}
          businessArea={businessAreas}
          switchToStep={this.switchToStep}
        />
      );
    } else if (this.state.current === ShipCreateStep.Certificate) {
      stepComponent = (
        <ShipCertForm
          ship={this.state.ship}
          certificateTypes={certificateTypes}
          switchToStep={this.switchToStep}
        />
      );
    } else if (this.state.current === ShipCreateStep.Sailor) {
      stepComponent = (
        <ShipSailorForm
          ship={this.state.ship}
          sailorPosition={sailorPosition}
          switchToStep={this.switchToStep}
        />
      );
    } else if (this.state.current === ShipCreateStep.Result) {
      stepComponent = (
        <ShipCreateResultPage
          ship={this.state.ship}
          onReset={this.resetStepForm}
          dispatch={this.props.dispatch}
        />
      );
    }

    return (
      <PageHeaderWrapper title="新船舶信息" content="按表单提示填入相应船舶信息">
        <Card bordered={false}>
          <>
            <Steps current={this.state.current} className={styles.steps}>
              <Step title="基本信息" />
              <Step title="载重吨信息" />
              <Step title="证书信息" />
              <Step title="船员信息" />
              <Step title="完成" />
            </Steps>
            {stepComponent}
          </>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default ShipCreate;
