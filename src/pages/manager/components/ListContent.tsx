import * as React from 'react';
import { IManagerCert } from 'src/interfaces/IManager';
import moment from 'moment';
import styles from './style.less';

interface ListContentProps {
  item: IManagerCert
}

const ListContent: React.FunctionComponent<ListContentProps> = ({ item }) => (
  <div className={styles.listContent}>
    <div className={styles.listContentItem}>
      <span>证书名称</span>
      <p>{item.name}</p>
    </div>
    <div className={styles.listContentItem}>
      <span>证书过期时间</span>
      <p>{moment(item.expiredAt).format('YYYY-MM-DD HH:mm')}</p>
    </div>
  </div>
);

export default ListContent
