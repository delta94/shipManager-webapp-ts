import { LogoutOutlined, SettingOutlined } from '@ant-design/icons';
import { Avatar, Menu, Spin } from 'antd';
import { ClickParam } from 'antd/es/menu';
import React from 'react';
import { connect } from 'dva';
import { router } from 'umi';
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
    const {
      currentUser = {
        imageUrl: defaultAvatar,
        login: '',
      },
      menu,
    } = this.props;

    const imageUrl = currentUser.imageUrl ? currentUser.imageUrl : defaultAvatar;

    const menuHeaderDropdown = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={this.onMenuClick}>
        {menu && (
          <Menu.Item key="personal">
            <SettingOutlined />
            个人设置
          </Menu.Item>
        )}
        {menu && <Menu.Divider />}

        <Menu.Item key="logout">
          <LogoutOutlined />
          退出登录
        </Menu.Item>
      </Menu>
    );
    return currentUser && currentUser.login ? (
      <HeaderDropdown overlay={menuHeaderDropdown}>
        <span className={`${styles.action} ${styles.account}`}>
          <Avatar size="small" className={styles.avatar} src={imageUrl} alt="avatar" />
          <span className={styles.name}>{currentUser.login}</span>
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
