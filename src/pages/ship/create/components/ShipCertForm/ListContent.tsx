import React from 'react';
import moment from 'moment';
import { Badge } from 'antd';
import styles from './styles.less';
import { IShipCertificate } from '@/interfaces/IShip';

const ListContent: React.FC<Partial<IShipCertificate>> = props => {
  const isValid = moment(props.expiredAt).isAfter(moment.now());
  return (
    <div className={styles.listContent}>
      <div className={styles.listContentItem}>
        <span>颁发机构</span>
        <p>{props.issueBy ? props.issueBy : '未知'}</p>
      </div>
      <div className={styles.listContentItem}>
        <span>有效期至</span>
        <p>{moment(props.expiredAt).format('YYYY-MM-DD')}</p>
      </div>
      <div className={styles.listContentItem}>
        <Badge status={isValid ? 'success' : 'error'} text={isValid ? '证书有效' : '证书过期'} />
      </div>
    </div>
  );
};

export default ListContent;
