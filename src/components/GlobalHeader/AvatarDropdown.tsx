import { Avatar, Icon, Menu, Spin } from 'antd';
import { ClickParam } from 'antd/es/menu';
import React from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { ConnectProps, ConnectState } from '@/models/connect';
import IAccount from '@/interfaces/IAccount';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';
import defaultAvatar from '@/assets/icons/avatar.png';

export interface GlobalHeaderRightProps extends ConnectProps {
  currentUser?: IAccount;
  menu?: boolean;
}

class AvatarDropdown extends React.Component<GlobalHeaderRightProps> {
  onMenuClick = (event: ClickParam) => {
    const { key } = event;

    if (key === 'logout') {
      const { dispatch } = this.props;

      if (dispatch) {
        dispatch({
          type: 'login/logout',
        });
      }

      return;
    }

    router.push(`/setting/${key}`);
  };

  render() {
    const { currentUser, menu } = this.props;
    const imageUrl = currentUser && currentUser.imageUrl ? currentUser.imageUrl : defaultAvatar;

    if (!menu && currentUser) {
      return (
        <span className={`${styles.action} ${styles.account}`}>
          <Avatar size="small" className={styles.avatar} src={imageUrl} alt="avatar" />
          <span className={styles.name}>{currentUser.login}</span>
        </span>
      );
    }

    const menuHeaderDropdown = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={this.onMenuClick}>
        <Menu.Item key="personal">
          <Icon type="setting" />
          个人设置
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item key="logout">
          <Icon type="logout" />
          退出登录
        </Menu.Item>
      </Menu>
    );
    return currentUser && currentUser.id ? (
      <HeaderDropdown overlay={menuHeaderDropdown}>
        <span className={`${styles.action} ${styles.account}`}>
          <Avatar size="small" icon="user" className={styles.avatar} src={imageUrl} alt="avatar" />
        </span>
      </HeaderDropdown>
    ) : (
      <Spin
        size="small"
        style={{
          marginLeft: 8,
          marginRight: 8,
        }}
      />
    );
  }
}

export default connect(({ user }: ConnectState) => ({
  currentUser: user.currentUser,
}))(AvatarDropdown);
