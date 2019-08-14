import * as React from 'react'
import Button from 'antd/es/button/button';
import List from 'antd/es/list';
import { findDOMNode } from 'react-dom';
import { Avatar, Popconfirm } from 'antd';
import { IManagerCert } from 'src/interfaces/IManager';
import ListContent from './ListContent';

interface ManagerCertListProps {
  removeCertItem(value: IManagerCert): void
  showCreateModal: (value: IManagerCert | undefined) => void
}

interface ManagerCertListState {
  certList: IManagerCert[]
}

class ManagerCertList extends React.Component<ManagerCertListProps, ManagerCertListState> {
  static getDerivedStateFromProps(nextProps: any) {
    // Should be a controlled component.
    if ('value' in nextProps) {
      return {
        ...(nextProps.value || {}),
      };
    }
    return null;
  }

  state = {
      certList: [],
  }

  addBtn: HTMLButtonElement | undefined | null = undefined;

  handleEditItem = (e: any, item: IManagerCert) => {
    this.props.showCreateModal(item);
  };

  handleRemoveItem = (e: any, item: IManagerCert) => {
    this.props.removeCertItem(item)
  };

  showModal = () => {
    this.props.showCreateModal(undefined);
  };

  render() {
    return (
      <div>
        <Button
          type="dashed"
          style={{ width: '100%', marginBottom: 8 }}
          icon="plus"
          onClick={this.showModal}
          ref={component => {
            // eslint-disable-next-line  react/no-find-dom-node
            this.addBtn = findDOMNode(component) as HTMLButtonElement;
          }}
        >
          添加证书
        </Button>
        <List
          size="large"
          rowKey="id"
          dataSource={this.state.certList}
          renderItem={(item: IManagerCert) => (
            <List.Item
              actions={[
                <a key="edit" onClick={e => this.handleEditItem(e, item)}>
                  编辑
                </a>,
                <Popconfirm title="是否要删除此行？" onConfirm={e => this.handleRemoveItem(e, item)}>
                  <a>删除</a>
                </Popconfirm>,
              ]}
            >
              <List.Item.Meta
                avatar={<Avatar shape="square" size="large" src={ item.icon || 'https://gw.alipayobjects.com/zos/rmsportal/zOsKZmFRdUtvpqCImOVY.png'}/>}
                title={item.name}
                description={item.typeName}
              />
              <ListContent item={item} />
            </List.Item>
          )}
        />
      </div>
    )
  }
}

export default ManagerCertList
