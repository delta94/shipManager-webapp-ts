import * as React from "react"
import {Dropdown, Menu, Icon} from "antd";

const MoreBtn: React.FunctionComponent = () => {
  return (
    <Dropdown
      overlay={
        <Menu>
          <Menu.Item key="edit">编辑</Menu.Item>
          <Menu.Item key="delete">删除</Menu.Item>
        </Menu>
      }
    >
      <a>
        更多 <Icon type="down" />
      </a>
    </Dropdown>
  )
};

export default MoreBtn;
