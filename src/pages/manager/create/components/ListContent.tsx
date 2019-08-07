import * as React from "react";
import {IManagerCert} from "@/interfaces/IManager";
import styles from "./style.less";
import moment from "moment";

interface ListContentProps {
  item: IManagerCert
}

const ListContent: React.FunctionComponent<ListContentProps> = ( { item }) => (
  <div className={styles.listContent}>
    <div className={styles.listContentItem}>
      <span>Owner</span>
      <p>{item.name}</p>
    </div>
    <div className={styles.listContentItem}>
      <span>过期时间</span>
      <p>{moment(item.expiredAt).format('YYYY-MM-DD HH:mm')}</p>
    </div>
    <div className={styles.listContentItem}>
      todo
    </div>
  </div>
);

export default ListContent
