import * as React from 'react';
import { Button, Card, Form, Modal, Popconfirm, Row } from 'antd';
import styles from '@/pages/ship/create/style.less';
import StandardTable from '@/pages/sailor/list/components/StandardTable';
import { TableListItem } from '@/pages/sailor/list/sailor';
import { Fragment } from 'react';
import { ShipCreateStep } from '@/pages/ship/create';
import { FormComponentProps } from 'antd/es/form';
import IShip from '@/interfaces/IShip';
import ISailor, { ISailorPosition } from '@/interfaces/ISailor';
import produce from 'immer';
import SailorListTable from '@/pages/ship/create/components/ShipSailorForm/SailorListTable';

interface ShipSailorFormProps extends FormComponentProps {
  switchToStep(index: ShipCreateStep, ship: Partial<IShip>): void;
  onCreateShip(shipData: Partial<IShip>): void;
  ship: Partial<IShip>;
  sailorPosition: ISailorPosition[];
}

interface ShipSailorFormState {
  visible: boolean;
  selectedRow: TableListItem[];
  data: Partial<ISailor>[];
  selectedSailorRows: Partial<ISailor>[];
}

class ShipSailorForm extends React.Component<ShipSailorFormProps, ShipSailorFormState> {
  constructor(props: ShipSailorFormProps) {
    super(props);

    if (props.ship.sailors && props.ship.sailors.length > 0) {
      this.state = {
        visible: false,
        data: props.ship.sailors,
        selectedSailorRows: [],
        selectedRow: [],
      };
    } else {
      this.state = {
        visible: false,
        data: [],
        selectedSailorRows: [],
        selectedRow: [],
      };
    }
  }

  columns = [
    {
      title: '姓名',
      dataIndex: 'name',
    },
    {
      title: '常任职位',
      dataIndex: 'positionId',
      render: (val: number) => {
        const item = this.props.sailorPosition.filter(item => item.id == val);
        return item.length > 0 ? item[0].name : val;
      },
    },
    {
      title: '手机号码',
      dataIndex: 'mobile',
    },
    {
      title: '身份证',
      dataIndex: 'identityNumber',
    },
    {
      title: '是否高级船员',
      dataIndex: 'isAdvanced',
      render: (val: boolean) => (val ? '是' : '否'),
    },
    {
      title: '操作',
      render: (text: any, record: Partial<ISailor>) => (
        <Fragment>
          <Popconfirm title="是否要删除此行？" onConfirm={() => this.handleUnbindSailor(record)}>
            <a>移除</a>
          </Popconfirm>
        </Fragment>
      ),
    },
  ];

  onPrev = () => {
    this.props.switchToStep(ShipCreateStep.Certificate, { sailors: this.state.data });
  };

  onNext = () => {
    this.props.onCreateShip({ sailors: this.state.data });
  };

  onSelectRow = () => {};

  handleCreateRecord = () => {
    this.setState({ visible: true });
  };

  handleSelectSailor = () => {
    let selectedSailorRows = this.state.selectedSailorRows;

    const newState = produce(this.state, (draft: ShipSailorFormState) => {
      if (selectedSailorRows.length == 0) {
        draft.data = [];
      } else {
        draft.data = selectedSailorRows;
      }
      draft.selectedSailorRows = [];
      draft.visible = false;
    });
    this.setState(newState);
  };

  handleModalCancel = () => {
    this.setState({
      visible: false,
      selectedSailorRows: [],
    });
  };

  handleUnbindSailor = (record: Partial<ISailor>) => {
    const newState = produce(this.state, (draft: ShipSailorFormState) => {
      draft.data = draft.data.filter(item => item.id != record.id);
    });
    this.setState(newState);
  };

  handleUpdateSelectedSailor = (sailors: Partial<ISailor>[]) => {
    this.setState({ selectedSailorRows: sailors });
  };

  handleSelectRows = (rows: TableListItem[]) => {};

  render() {
    let previousSelectedKeys: any[] = [];

    if (this.state.data.length > 0) {
      previousSelectedKeys = this.state.data.map(item => item.id);
    }

    return (
      <Card title="船员列表信息" className={styles.card} bordered={false}>
        <Button
          type="dashed"
          onClick={this.handleCreateRecord}
          style={{ width: '100%', marginTop: 12, marginBottom: 24 }}
          icon="plus"
        >
          选择船员
        </Button>

        <StandardTable
          columns={this.columns}
          data={{ list: this.state.data as TableListItem[], pagination: false }}
          selectedRows={this.state.selectedRow}
          onSelectRow={this.handleSelectRows}
        />

        <Row style={{ marginTop: 12 }}>
          <Button type="primary" onClick={this.onNext} style={{ float: 'right' }}>
            录入船舶
          </Button>
          <Button onClick={this.onPrev} style={{ marginRight: 8, float: 'right' }}>
            上一步
          </Button>
        </Row>

        <Modal
          title="选择船员"
          width={960}
          bodyStyle={{ padding: '28px 12px' }}
          destroyOnClose
          visible={this.state.visible}
          onOk={this.handleSelectSailor}
          onCancel={this.handleModalCancel}
        >
          <SailorListTable
            previousSelectedKeys={previousSelectedKeys}
            onChange={this.handleUpdateSelectedSailor}
          />
        </Modal>
      </Card>
    );
  }
}

export default Form.create<ShipSailorFormProps>()(ShipSailorForm);
