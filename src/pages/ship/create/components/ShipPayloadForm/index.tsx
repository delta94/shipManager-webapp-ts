import * as React from 'react';
import { Card, Row, Form, Button, Divider, Popconfirm, Modal } from 'antd';
import ShipPayloadTable from '../ShipPayloadTable';
import { FormComponentProps } from 'antd/es/form';
import styles from '../../style.less';
import IShip, { IShipBusinessArea } from '@/interfaces/IShip';
import { TableListItem } from '../ShipPayloadTable/ShipCert.d';
import ShipPayloadEditForm from '@/pages/ship/create/components/ShipPayloadForm/EditForm';
import { Fragment } from 'react';
import produce from 'immer';
import IShipPayload from '@/interfaces/IShipPayload';
import uuidv1 from 'uuid/v1';

interface ShipPayloadCreateProps extends FormComponentProps {
  switchToStep(index: number, ship: Partial<IShip>): void;
  ship: Partial<IShip>;
  businessArea: IShipBusinessArea[];
}
interface ShipPayloadCreateState {
  data: Partial<IShipPayload>[];
  visible: boolean;
  current: Partial<IShipPayload> | undefined;
}

class ShipPayloadForm extends React.Component<ShipPayloadCreateProps, ShipPayloadCreateState> {
  constructor(props: ShipPayloadCreateProps) {
    super(props);
    if (this.props.ship && this.props.ship.payloads) {
      this.state = {
        data: this.props.ship.payloads,
        visible: false,
        current: undefined,
      };
    } else {
      this.state = {
        data: [],
        visible: false,
        current: undefined,
      };
    }
  }

  columns = [
    {
      title: '航区类型',
      dataIndex: 'areaId',
      render: (text: any) => {
        const item = this.props.businessArea.filter(item => item.id.toString() == text);
        return item.length > 0 ? item[0].name : text;
      },
    },
    {
      title: '吨位',
      dataIndex: 'tone',
      render: (text: any) => `${text} 吨`,
    },
    {
      title: '备注',
      dataIndex: 'remark',
    },
    {
      title: '操作',
      render: (text: any, record: TableListItem) => (
        <Fragment>
          <a onClick={() => this.handlePayloadUpdate(record)}>修改</a>
          <Divider type="vertical" />
          <span>
            <Popconfirm title="是否要删除此行？" onConfirm={() => this.handlePayloadRemove(record)}>
              <a>删除</a>
            </Popconfirm>
          </span>
        </Fragment>
      ),
    },
  ];

  formRef: any;

  saveFormRef = (formRef: any) => {
    this.formRef = formRef;
  };

  onPrev = () => {
    this.props.switchToStep(0, { payloads: this.state.data });
  };

  onNext = () => {
    this.props.switchToStep(2, { payloads: this.state.data });
  };

  onSelectRow = () => {};

  handleCreateRecord = () => {
    this.setState({ visible: true });
  };

  handlePayloadSubmit = () => {
    const { form } = this.formRef.props;
    form.validateFields((err: any, values: Partial<IShipPayload>) => {
      if (err) return;

      const newState = produce(this.state, (draft: ShipPayloadCreateState) => {
        if (this.state.current) {
          // @ts-ignore
          let id = this.state.current.id;
          let index = draft.data.findIndex(item => item.id == id);
          draft.data[index] = values;
        } else {
          // @ts-ignore
          values.id = uuidv1();
          draft.data.unshift(values);
        }

        draft.visible = false;
        draft.current = undefined;
      });

      this.setState(newState);
      form.resetFields();
    });
  };

  handlePayloadCancel = () => {
    this.setState({ visible: false, current: undefined });
  };

  handlePayloadUpdate = (record: TableListItem) => {
    const newState = produce(this.state, (draft: ShipPayloadCreateState) => {
      draft.current = record;
      draft.visible = true;
    });
    this.setState(newState);
  };

  handlePayloadRemove = (record: TableListItem) => {
    const newState = produce(this.state, (draft: ShipPayloadCreateState) => {
      draft.data = draft.data.filter(item => item.id != record.id);
    });
    this.setState(newState);
  };

  render() {
    return (
      <Card title="载重吨信息" className={styles.card} bordered={false}>
        <Button
          type="dashed"
          onClick={this.handleCreateRecord}
          style={{ width: '100%', marginTop: 12, marginBottom: 24 }}
          icon="plus"
        >
          添加载重吨信息
        </Button>

        <ShipPayloadTable
          onSelectRow={this.onSelectRow}
          selectedRows={[]}
          columns={this.columns}
          data={{ list: this.state.data, pagination: false }}
        />

        <Row style={{ marginTop: 12 }}>
          <Button type="primary" onClick={this.onNext} style={{ float: 'right' }}>
            下一步
          </Button>
          <Button onClick={this.onPrev} style={{ marginRight: 8, float: 'right' }}>
            上一步
          </Button>
        </Row>

        <Modal
          title="编辑"
          width={640}
          bodyStyle={{ padding: '28px 0' }}
          destroyOnClose
          visible={this.state.visible}
          onOk={this.handlePayloadSubmit}
          onCancel={this.handlePayloadCancel}
        >
          <ShipPayloadEditForm
            wrappedComponentRef={this.saveFormRef}
            type={this.props.businessArea}
            current={this.state.current}
          />
        </Modal>
      </Card>
    );
  }
}

export default Form.create<ShipPayloadCreateProps>()(ShipPayloadForm);
