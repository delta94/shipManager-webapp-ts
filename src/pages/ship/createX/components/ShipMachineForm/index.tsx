import * as React from 'react';
import { Card, Row, Form, Button, Divider, Popconfirm, Modal } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import { Fragment } from 'react';
import produce from 'immer';
import uuidv1 from 'uuid/v1';
import StandardTable from '@/components/StandardTable';
import styles from '../../style.less';
import IShip, { IShipGenerator, IShipHost } from '@/interfaces/IShip';
import { TableListItem } from '../ShipPayloadTable/ShipCert.d';
import ShipGeneratorEditForm from './ShipGeneratorEditForm';
import ShipHostEditForm from './ShipHostEditForm';
import IShipPayload from '@/interfaces/IShipPayload';
import { ShipCreateStep } from '@/pages/ship/create';

interface ShipMachineCreateProps extends FormComponentProps {
  switchToStep(index: ShipCreateStep, ship: Partial<IShip>): void;
  ship: Partial<IShip>;
}
interface ShipMachineCreateState {
  generators: Partial<IShipGenerator>[];
  hosts: Partial<IShipHost>[];
  hostVisible: boolean;
  generatorVisible: boolean;
  current: Partial<IShipGenerator> | Partial<IShipHost> | undefined;
}

class ShipMachineForm extends React.Component<ShipMachineCreateProps, ShipMachineCreateState> {
  constructor(props: ShipMachineCreateProps) {
    super(props);

    if (this.props.ship) {
      this.state = {
        generators: this.props.ship.generators || [],
        hosts: this.props.ship.hosts || [],
        hostVisible: false,
        generatorVisible: false,
        current: undefined,
      };
    } else {
      this.state = {
        generators: [],
        hosts: [],
        hostVisible: false,
        generatorVisible: false,
        current: undefined,
      };
    }
  }

  generatorColumns = [
    {
      title: '发电机编号',
      dataIndex: 'identityNumber',
    },
    {
      title: '发电机种类',
      dataIndex: 'modelType',
    },
    {
      title: '发电机功率',
      dataIndex: 'power',
      render: (text: any) => `${text} 千瓦`,
    },
    {
      title: '备注',
      dataIndex: 'remark',
    },
    {
      title: '操作',
      render: (text: any, record: TableListItem) => (
        <Fragment>
          <a onClick={() => this.handlePayloadUpdate(record, 'generator')}>修改</a>
          <Divider type="vertical" />
          <span>
            <Popconfirm title="是否要删除此行？" onConfirm={() => this.handleRecordRemove(record, 'generator')}>
              <a>删除</a>
            </Popconfirm>
          </span>
        </Fragment>
      ),
    },
  ];

  hostColumns = [
    {
      title: '主机编号',
      dataIndex: 'identityNumber',
    },
    {
      title: '主机种类',
      dataIndex: 'modelType',
    },
    {
      title: '主机功率',
      dataIndex: 'power',
      render: (text: any) => `${text} 千瓦`,
    },
    {
      title: '备注',
      dataIndex: 'remark',
    },
    {
      title: '操作',
      render: (text: any, record: TableListItem) => (
        <Fragment>
          <a onClick={() => this.handlePayloadUpdate(record, 'host')}>修改</a>
          <Divider type="vertical" />
          <span>
            <Popconfirm title="是否要删除此行？" onConfirm={() => this.handleRecordRemove(record, 'host')}>
              <a>删除</a>
            </Popconfirm>
          </span>
        </Fragment>
      ),
    },
  ];

  generatorFormRef: any;

  hostFormRef: any;

  saveGeneratorFormRef = (formRef: any) => {
    this.generatorFormRef = formRef;
  };

  saveHostFormRef = (formRef: any) => {
    this.hostFormRef = formRef;
  };

  onPrev = () => {
    this.props.switchToStep(ShipCreateStep.Basic, {
      generators: this.state.generators,
      hosts: this.state.hosts,
    });
  };

  onNext = () => {
    this.props.switchToStep(ShipCreateStep.Payload, {
      generators: this.state.generators,
      hosts: this.state.hosts,
    });
  };

  onSelectRow = () => {};

  handleCreateRecord = (type: string) => {
    if (type == 'generator') {
      this.setState({ generatorVisible: true });
    }
    if (type == 'host') {
      this.setState({ hostVisible: true });
    }
  };

  handlePayloadSubmit = (type: string) => {
    const { form } = type === 'generator' ? this.generatorFormRef.props : this.hostFormRef.props;

    form.validateFields((err: any, values: Partial<IShipPayload>) => {
      if (err) return;

      const newState = produce(this.state, (draft: ShipMachineCreateState) => {
        if (this.state.current) {
          // @ts-ignore
          const { id } = this.state.current;

          if (type === 'generator') {
            const index = draft.generators.findIndex(item => item.id == id);
            draft.generators[index] = values;
          }
          if (type === 'host') {
            const index = draft.hosts.findIndex(item => item.id == id);
            draft.hosts[index] = values;
          }
        } else {
          // @ts-ignore
          values.id = uuidv1();
          if (type === 'generator') {
            draft.generators.unshift(values);
          }
          if (type === 'host') {
            draft.hosts.unshift(values);
          }
        }
        draft.current = undefined;
        draft.generatorVisible = false;
        draft.hostVisible = false;
      });

      this.setState(newState);
      form.resetFields();
    });
  };

  handlePayloadCancel = () => {
    this.setState({
      generatorVisible: false,
      hostVisible: false,
      current: undefined,
    });
  };

  handlePayloadUpdate = (record: TableListItem, type: string) => {
    const newState = produce(this.state, (draft: ShipMachineCreateState) => {
      draft.current = record;
      if (type === 'generator') {
        draft.generatorVisible = true;
      }
      if (type === 'host') {
        draft.hostVisible = true;
      }
    });
    this.setState(newState);
  };

  handleRecordRemove = (record: TableListItem, type: string) => {
    const newState = produce(this.state, (draft: ShipMachineCreateState) => {
      if (type === 'generator') {
        draft.generators = draft.generators.filter(item => item.id != record.id);
      }
      if (type === 'host') {
        draft.hosts = draft.hosts.filter(item => item.id != record.id);
      }
    });
    this.setState(newState);
  };

  render() {
    return (
      <div>
        <Card title="发电机信息" className={styles.card} bordered={false}>
          <Button
            type="dashed"
            onClick={() => this.handleCreateRecord('generator')}
            style={{ width: '100%', marginTop: 12, marginBottom: 24 }}
            icon="plus"
          >
            添加发电机信息
          </Button>

          <StandardTable
            rowKey="id"
            onSelectRow={this.onSelectRow}
            selectedRows={[]}
            columns={this.generatorColumns}
            data={{ list: this.state.generators as TableListItem[], pagination: false }}
          />

          <Modal
            title="编辑发动机"
            width={640}
            bodyStyle={{ padding: '28px 0' }}
            destroyOnClose
            visible={this.state.generatorVisible}
            onOk={() => this.handlePayloadSubmit('generator')}
            onCancel={this.handlePayloadCancel}
          >
            <ShipGeneratorEditForm wrappedComponentRef={this.saveGeneratorFormRef} current={this.state.current} />
          </Modal>
        </Card>

        <Card title="主机信息" className={styles.card} bordered={false}>
          <Button
            type="dashed"
            onClick={() => this.handleCreateRecord('host')}
            style={{ width: '100%', marginTop: 12, marginBottom: 24 }}
            icon="plus"
          >
            添加主机信息
          </Button>

          <StandardTable
            rowKey="id"
            onSelectRow={this.onSelectRow}
            selectedRows={[]}
            columns={this.hostColumns}
            data={{ list: this.state.hosts as TableListItem[], pagination: false }}
          />

          <Modal
            title="编辑主机"
            width={640}
            bodyStyle={{ padding: '28px 0' }}
            destroyOnClose
            visible={this.state.hostVisible}
            onOk={() => this.handlePayloadSubmit('host')}
            onCancel={this.handlePayloadCancel}
          >
            <ShipHostEditForm wrappedComponentRef={this.saveHostFormRef} current={this.state.current} />
          </Modal>
        </Card>

        <Row style={{ marginTop: 12 }}>
          <Button type="primary" onClick={this.onNext} style={{ float: 'right' }}>
            下一步
          </Button>
          <Button onClick={this.onPrev} style={{ marginRight: 8, float: 'right' }}>
            上一步
          </Button>
        </Row>
      </div>
    );
  }
}

export default Form.create<ShipMachineCreateProps>()(ShipMachineForm);
