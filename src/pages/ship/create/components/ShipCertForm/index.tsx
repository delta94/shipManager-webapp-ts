import * as React from 'react';
import IShip, { IShipCertificate, IShipCertType } from '@/interfaces/IShip';
import { Avatar, Button, Card, Form, List } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import styles from '@/pages/list/basic-list/style.less';
import ListContent from './ListContent';
import { Modal } from 'antd/es';
import ShipEditCertForm from './EditCertForm';
import produce from 'immer';
import uuidv1 from 'uuid/v1';

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

  handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const { form } = this.formRef.props;
    form.validateFields((err: any, values: Partial<IShipCertificate>) => {
      if (err) return;

      const newState = produce(this.state, (draft: ShipCertCreateState) => {
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

  deleteItem = (id: string) => {};

  render() {
    return (
      <div className={styles.standardList}>
        <Card
          className={styles.listCard}
          bordered={false}
          style={{ marginTop: 24 }}
          bodyStyle={{ padding: '0 32px 40px 32px' }}
        >
          <Button
            type="dashed"
            style={{ width: '100%', marginBottom: 8 }}
            icon="plus"
            onClick={this.showModal}
          >
            添加证书
          </Button>
          <List
            size="large"
            rowKey="id"
            pagination={false}
            dataSource={this.state.data}
            renderItem={(item: IShipCertificate) => {
              let type = this.props.certificateTypes.filter(v => v.id == item.typeId)[0];
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
                    <a
                      key="edit"
                      onClick={e => {
                        e.preventDefault();
                        this.deleteItem(item);
                      }}
                    >
                      删除
                    </a>,
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
