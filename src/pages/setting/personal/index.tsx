import React, { Component } from 'react';
import { GridContent } from '@ant-design/pro-layout';
import { Menu } from 'antd';
import BaseView from './components/base';
import SecurityView from './components/security';
import styles from './style.less';
import Notification from '@/pages/setting/personal/components/notification';

type SettingsStateKeys = 'base' | 'security' | 'notification';

interface SettingsState {
  mode: 'inline' | 'horizontal';
  menuMap: {
    [key: string]: React.ReactNode;
  };
  selectKey: SettingsStateKeys;
}

class Settings extends Component<{}, SettingsState> {

  state: SettingsState = {
    mode: 'inline',
    menuMap: {
      base: '账号信息',
      security: '账号安全',
      notification: '新消息通知',
    },
    selectKey: 'base',
  };

  getMenu = () => {
    const { menuMap } = this.state;
    return Object.keys(menuMap).map(item => <Menu.Item key={item}>{menuMap[item]}</Menu.Item>);
  };

  getRightTitle = () => {
    const { selectKey, menuMap } = this.state;
    return menuMap[selectKey];
  };

  selectKey = (key: SettingsStateKeys) => {
    this.setState({
      selectKey: key,
    });
  };

  renderChildren = () => {
    const { selectKey } = this.state;
    switch (selectKey) {
      case 'base':
        return <BaseView />;
      case 'security':
        return <SecurityView />;
      case 'notification':
        return <Notification />;
      default:
        break;
    }
    return null;
  };

  render() {
    const { mode, selectKey } = this.state;
    return (
      <GridContent>
        <div className={styles.main}>
          <div className={styles.leftMenu}>
            <Menu
              mode={mode}
              selectedKeys={[selectKey]}
              onClick={({ key }) => this.selectKey(key as SettingsStateKeys)}
            >
              {this.getMenu()}
            </Menu>
          </div>
          <div className={styles.right}>
            <div className={styles.title}>{this.getRightTitle()}</div>
            {this.renderChildren()}
          </div>
        </div>
      </GridContent>
    );
  }
}

export default Settings;
