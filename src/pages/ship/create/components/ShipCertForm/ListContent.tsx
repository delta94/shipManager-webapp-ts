import React from 'react';
import styles from '@/pages/list/basic-list/style.less';
import moment from 'moment';
import { Badge } from 'antd';
import { IShipCertificate } from '@/interfaces/IShip';

const ListContent: React.FC<Partial<IShipCertificate>> = props => {
  let isValid = moment(props.expiredAt).isAfter(moment.now());
  return (
    <div className={styles.listContent}>
      <div className={styles.listContentItem}>
        <span>颁发机构</span>
        <p>{props.issueBy}</p>
      </div>
      <div className={styles.listContentItem}>
        <span>有效期至</span>
        <p>{moment(props.expiredAt).format('YYYY-MM-DD')}</p>
      </div>
      <div className={styles.listContentItem}>
        <Badge status={isValid ? 'success' : 'error'} text={isValid ? '有效' : '已经过期'} />
      </div>
    </div>
  );
};

export default ListContent;
