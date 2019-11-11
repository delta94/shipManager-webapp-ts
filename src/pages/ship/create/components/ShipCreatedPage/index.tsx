import { Button, Result, Descriptions } from 'antd';
import React from 'react';
import { Dispatch } from 'redux';
import { routerRedux } from 'dva/router';
import styles from './styles.less';
import IShip from '@/interfaces/IShip';

interface ShipCreatedPageProps {
  ship: Partial<IShip>;
  onReset(): void;
  dispatch: Dispatch<any>;
}

const ShipCreatedPage: React.FC<ShipCreatedPageProps> = props => {
  const { ship } = props;

  if (!ship) {
    return null;
  }

  const onFinish = () => {
    props.dispatch(routerRedux.push('/ship/list'));
  };

  const onCreate = () => {
    props.onReset();
  };

  const information = (
    <div className={styles.information}>
      <Descriptions column={1}>
        <Descriptions.Item label="船舶名称"> {ship.name}</Descriptions.Item>
        <Descriptions.Item label="船舶所有人"> {ship.owner}</Descriptions.Item>
      </Descriptions>
    </div>
  );

  const extra = (
    <>
      {!ship.id && (
        <Button type="primary" onClick={onCreate}>
          再次录入
        </Button>
      )}
      <Button onClick={onFinish}>查看列表</Button>
    </>
  );

  return (
    <Result status="success" title="操作成功" extra={extra} className={styles.result}>
      {information}
    </Result>
  );
};

export default ShipCreatedPage;
