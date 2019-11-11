import { Card, Steps } from 'antd';
import React, { Component } from 'react';
import { omit } from 'lodash';

import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';

import { FormComponentProps } from 'antd/es/form';
import { Dispatch } from 'redux';
import { Moment } from 'moment';
import ShipBasicForm from '../create/components/ShipBasicForm';
import ShipPayloadForm from '../create/components/ShipPayloadForm';
import ShipCertForm from '../create/components/ShipCertForm';
import ShipCreateResultPage from '../create/components/ShipCreatedPage';

import { ShipStateType } from '@/models/ship';
import IShip, {
  IShipBusinessArea,
  IShipCertType,
  IShipMaterial,
  IShipType,
} from '@/interfaces/IShip';
import styles from './style.less';
import ShipSailorForm from '@/pages/ship/create/components/ShipSailorForm';
import { SailorModelState } from '@/models/sailor';
import { ISailorPosition } from '@/interfaces/ISailor';
import { RouteComponentProps } from 'react-router';

const { Step } = Steps;

export enum ShipCreateStep {
  Basic,
  Payload,
  Certificate,
  Sailor,
  Result,
}

interface ShipUpdateState {
  current: ShipCreateStep;
  ship: Partial<IShip>;
}

interface ShipUpdateProps extends FormComponentProps, RouteComponentProps<{ id: string }> {
  dispatch: Dispatch<any>;
  loading: boolean;
  target: IShip;
  types: IShipType[];
  materials: IShipMaterial[];
  businessAreas: IShipBusinessArea[];
  certificateTypes: IShipCertType[];
  sailorPosition: ISailorPosition[];
}

@connect(
  ({
    ship,
    sailor,
    loading,
  }: {
    ship: ShipStateType;
    sailor: SailorModelState;
    loading: { effects: { [key: string]: boolean } };
  }) => ({
    types: ship.types,
    target: ship.target,
    materials: ship.materials,
    businessAreas: ship.businessAreas,
    certificateTypes: ship.certificateTypes,
    sailorPosition: sailor.positions,
    loading: loading.effects['ship/update'],
  }),
)
class ShipUpdate extends Component<ShipUpdateProps, ShipUpdateState> {
  state = {
    current: ShipCreateStep.Basic,
    ship: {},
  };

  componentDidMount() {
    let shipId = this.props.match.params.id;
    if (shipId) {
      this.props.dispatch({ type: 'ship/fetchTypes' });
      this.props.dispatch({ type: 'ship/fetchBusinessAreas' });
      this.props.dispatch({ type: 'ship/fetchMaterial' });
      this.props.dispatch({ type: 'ship/fetchCertificateType' });
      this.props.dispatch({ type: 'sailor/fetchPositionTypes' });
      this.props.dispatch({
        type: 'ship/target',
        payload: shipId,
        callback: this.setShipInfo,
      });
    }
  }

  setShipInfo = (ship: IShip) => {
    this.setState({ ship: ship });
  };

  switchToStep = (index: ShipCreateStep, shipData: Partial<IShip>) => {
    const ship = { ...this.state.ship, ...shipData };
    this.setState({ current: index, ship });
  };

  handleCreateShip = (shipData: Partial<IShip>) => {
    const finalShipData = { ...this.state.ship, ...shipData };

    if (finalShipData.assembleAt) {
      finalShipData.assembleAt = (finalShipData.assembleAt as Moment).format('YYYY-MM-DD');
    }

    if (finalShipData.buildAt) {
      finalShipData.buildAt = (finalShipData.buildAt as Moment).format('YYYY-MM-DD');
    }

    if (finalShipData.certificates) {
      // @ts-ignore
      finalShipData.certificates = finalShipData.certificates.map(item => {
        if (typeof item.id === 'number') {
          return item;
        } else {
          return omit(item, 'id');
        }
      });
    }

    if (finalShipData.payloads) {
      // @ts-ignore
      finalShipData.payloads = finalShipData.payloads.map(item => {
        if (typeof item.id === 'number') {
          return item;
        } else {
          return omit(item, 'id');
        }
      });
    }

    this.props.dispatch({
      type: 'ship/update',
      payload: finalShipData,
      callback: () => {
        this.setState({ current: ShipCreateStep.Result, ship: {} });
      },
    });
  };

  resetStepForm = () => {
    this.setState({
      current: ShipCreateStep.Basic,
      ship: {},
    });
  };

  render() {
    const { materials, types, businessAreas, certificateTypes, sailorPosition } = this.props;
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
          onCreateShip={this.handleCreateShip}
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
      <PageHeaderWrapper title="更新船舶信息" content="按表单提示填入相应船舶信息">
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

export default ShipUpdate;
