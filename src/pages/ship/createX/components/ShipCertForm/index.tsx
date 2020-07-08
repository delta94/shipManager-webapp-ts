import * as React from 'react';
import { Avatar, Button, Card, Form, List, Popconfirm, Row } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import { Modal } from 'antd/es';
import produce from 'immer';
import uuidv1 from 'uuid/v1';
import styles from './styles.less';
import ListContent from './ListContent';
import ShipEditCertForm from './EditCertForm';
import IShip, { IShipCertificate, IShipCertType } from '@/interfaces/IShip';
import { ShipCreateStep } from '@/pages/ship/create';

interface ShipCertCreateProps extends FormComponentProps {
  switchToStep(index: number, ship: Partial<IShip>): void;
  ship: Partial<IShip>;
  certificateTypes: IShipCertType[];
}

interface ShipCertCreateState {
  data: Partial<IShipCertificate>[];
  current: Partial<IShipCertType> | undefined;
  visible: boolean;
}

class ShipCertCreateForm extends React.Component<ShipCertCreateProps, ShipCertCreateState> {
  constructor(props: ShipCertCreateProps) {
    super(props);
    if (this.props.ship && this.props.ship.certificates) {
      this.state = {
        // @ts-ignore
        data: this.props.ship.certificates,
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

  state = {
    visible: false,
    data: [],
    current: undefined,
  };

  formRef: any;

  saveFormRef = (formRef: any) => {
    this.formRef = formRef;
  };

  showModal = () => {
    this.setState({
      visible: true,
      current: undefined,
    });
  };

  showEditModal = (item: Partial<IShipCertificate>) => {
    this.setState({
      visible: true,
      current: item,
    });
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  onPrev = () => {
    this.props.switchToStep(ShipCreateStep.Payload, { certificates: this.state.data });
  };

  onNext = () => {
    this.props.switchToStep(ShipCreateStep.Sailor, { certificates: this.state.data });
  };

  handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const { form } = this.formRef.props;
    form.validateFields((err: any, values: any) => {
      if (err) return;

      if (values.ossFile && values.ossFile.fileList) {
        values.ossFile = values.ossFile.fileList.map((value: any) => value.url).join(';');
      } else {
        values.ossFile = '';
      }

      const newState = produce(this.state, (draft: ShipCertCreateState) => {
        if (this.state.current) {
          // @ts-ignore
          const { id } = this.state.current;
          const index = draft.data.findIndex(item => item.id == id);
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

  deleteItem = (id: number) => {
    const newState = produce(this.state, (draft: ShipCertCreateState) => {
      draft.data = draft.data.filter(item => item.id != id);
    });
    this.setState(newState);
  };

  render() {
    return (
      <div className={styles.standardList}>
        <Card
          className={styles.listCard}
          bordered={false}
          style={{ marginTop: 24 }}
          bodyStyle={{ padding: '0 32px 40px 32px' }}
        >
          <Button type="dashed" style={{ width: '100%', marginBottom: 8 }} icon="plus" onClick={this.showModal}>
            添加证书
          </Button>
          <List
            size="large"
            rowKey="id"
            pagination={false}
            dataSource={this.state.data}
            renderItem={(item: IShipCertificate) => {
              const type = this.props.certificateTypes.filter(v => v.id == item.typeId)[0];
              if (!type) return <div>empty</div>;
              return (
                <List.Item
                  actions={[
                    <a
                      key="edit"
                      onClick={e => {
                        e.preventDefault();
                        this.showEditModal(item);
                      }}
                    >
                      编辑
                    </a>,

                    <Popconfirm title="是否要删除此行？" onConfirm={() => this.deleteItem(item.id)}>
                      <a>删除</a>
                    </Popconfirm>,
                  ]}
                >
                  <List.Item.Meta
                    avatar={<Avatar src={type.icon} shape="square" size="large" />}
                    title={<a href="">{type.name}</a>}
                    description={`证书编号：${item.identityNumber}`}
                  />
                  <ListContent {...item} />
                </List.Item>
              );
            }}
          />

          <Row style={{ marginTop: 12 }}>
            <Button type="primary" onClick={this.onNext} style={{ float: 'right' }}>
              下一步
            </Button>
            <Button onClick={this.onPrev} style={{ marginRight: 8, float: 'right' }}>
              上一步
            </Button>
          </Row>
        </Card>
        <Modal
          title="编辑"
          width={640}
          bodyStyle={{ padding: '28px 0' }}
          destroyOnClose
          visible={this.state.visible}
          onOk={this.handleSubmit}
          onCancel={this.handleCancel}
        >
          <ShipEditCertForm
            wrappedComponentRef={this.saveFormRef}
            type={this.props.certificateTypes}
            current={this.state.current}
          />
        </Modal>
      </div>
    );
  }
}

export default Form.create<ShipCertCreateProps>()(ShipCertCreateForm);
