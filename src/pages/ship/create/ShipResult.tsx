import React from 'react';
import { IShip } from '@/interfaces/IShip';
import { history } from 'umi';
import { NavigationProps } from '@/hooks/useStep';
import { Result, Button } from 'antd';

interface ShipResultProps {
  ship: Partial<IShip>;
  onReset: Function;
  navigation: NavigationProps;
}

const ShipResult: React.FC<ShipResultProps> = (props) => {
  const backToList = () => {
    history.push('/ship/list');
  };

  return (
    <Result
      status="success"
      title={`成功保存 ${props.ship.name}`}
      subTitle="相关信息可以在船舶详情页继续编辑"
      extra={[
        <Button type="primary" key="back" onClick={backToList}>
          返回列表
        </Button>,
        <Button
          key="continue"
          onClick={() => {
            props.onReset();
          }}
        >
          继续录入
        </Button>,
      ]}
    />
  );
};

export default ShipResult;
