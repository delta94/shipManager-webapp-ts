import * as React from "react"

import Button from "antd/es/button/button";
import List from "antd/es/list";
import MoreBtn from "./MoreBtn";
import {findDOMNode} from "react-dom";
import Avatar from "antd/es/avatar";
import ListContent from "./ListContent";
import {IManagerCert} from "@/interfaces/IManager";


interface ManagerCertListProps {
   certList: IManagerCert[]
}

interface MangerCertListState {
  visible: boolean;
  done: boolean;
  current?: Partial<IManagerCert>;
}

class ManagerCertList extends React.Component<ManagerCertListProps, MangerCertListState> {

  addBtn: HTMLButtonElement | undefined | null = undefined;

  showEditModal = (item: any) => {

  };

  handleEditItem = (e: React.MouseEvent, item: any) => {
    e.preventDefault();
    this.showEditModal(item);
  };

  handleDone = () => {
    setTimeout(() => this.addBtn && this.addBtn.blur(), 0);
    this.setState({
      done: false,
      visible: false,
    });
  };

  handleCancel = () => {
    setTimeout(() => this.addBtn && this.addBtn.blur(), 0);
    this.setState({
      visible: false,
    });
  };

  showModal = () => {
    this.setState({
      visible: true,
      current: undefined,
    });
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

          dataSource={this.props.certList}
          renderItem={(item: IManagerCert) => (
            <List.Item
              actions={[
                <a key="edit" onClick={(e) => this.handleEditItem(e, item)}>
                  编辑
                </a>,
                <MoreBtn key="more" />,
              ]}
            >
              <List.Item.Meta
                avatar={<Avatar shape="square" size="large" />}
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
