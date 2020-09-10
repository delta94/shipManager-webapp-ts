import { ConnectState } from '@/models/connect';
import { MenuDataItem, DefaultFooter } from '@ant-design/pro-layout';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { connect, ConnectProps } from 'umi';
import React from 'react';
import logo from '../assets/logo.png';
import styles from './UserLayout.less';

export interface UserLayoutProps extends Partial<ConnectProps> {
  breadcrumbNameMap: {
    [path: string]: MenuDataItem;
  };
}

const UserLayout: React.FC<UserLayoutProps> = ({ children }) => {
  return (
    <HelmetProvider>
      <Helmet>
        <title>船务管理系统</title>
        <meta name="description" content="船务管理系统" />
      </Helmet>

      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.top}>
            <div className={styles.header}>
              <img alt="logo" className={styles.logo} src={logo} />
              <span className={styles.title}>船务管理系统</span>
            </div>
            <div className={styles.desc} />
          </div>
          {children}
        </div>
        <DefaultFooter copyright="2020 船务管理系统" links={false} />
      </div>
    </HelmetProvider>
  );
};

export default connect(({ settings }: ConnectState) => ({ ...settings }))(UserLayout);
