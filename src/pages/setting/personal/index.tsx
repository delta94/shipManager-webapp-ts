import React, { Component } from 'react';

import { Dispatch } from 'redux';
import { FormattedMessage } from 'umi-plugin-react/locale';
import { GridContent } from '@ant-design/pro-layout';
import { Menu } from 'antd';
import { connect } from 'dva';
import BaseView from './components/base';
import SecurityView from './components/security';
import styles from './style.less';
import IAccount from '@/interfaces/IAccount';
import { UserModelState } from '@/models/user';

const { Item } = Menu;

interface SettingsProps {
  dispatch: Dispatch<any>;
  currentUser: IAccount;
}

type SettingsStateKeys = 'base' | 'security';

interface SettingsState {
  mode: 'inline' | 'horizontal';
  menuMap: {
    [key: string]: React.ReactNode;
  };
  selectKey: SettingsStateKeys;
}

@connect(({ user }: { user: UserModelState }) => ({
  currentUser: user.currentUser,
}))
class Settings extends Component<SettingsProps, SettingsState> {
  constructor(props: SettingsProps) {
    super(props);
    const menuMap = {
      base: <FormattedMessage id="app.settings.menuMap.basic" defaultMessage="Basic Settings" />,
      security: (
        <FormattedMessage id="app.settings.menuMap.security" defaultMessage="Security Settings" />
      ),
    };
    this.state = {
      mode: 'inline',
      menuMap,
      selectKey: 'base',
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/fetchCurrent',
    });
  }

  getMenu = () => {
    const { menuMap } = this.state;
    return Object.keys(menuMap).map(item => <Item key={item}>{menuMap[item]}</Item>);
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
        // @ts-ignore
        return <BaseView />;
      case 'security':
        // @ts-ignore
        return <SecurityView />;
      default:
        break;
    }
    return null;
  };

  render() {
    const { currentUser } = this.props;

    if (!(currentUser && currentUser.id)) {
      return '';
    }

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
