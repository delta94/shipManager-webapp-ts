import React, { useState, useEffect } from 'react';
import { Steps, Card } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { listShipCategory } from '@/services/shipService';
import { useRequest } from '@umijs/hooks';
import useStep from '@/pages/ship/create/useStep';
import styles from './style.less';

interface CreateShipProps {}

const CreateShip: React.FC<CreateShipProps> = props => {
  const { data: shipCategoryType } = useRequest(listShipCategory, {
    manual: false,
    cacheKey: 'ship_category_type',
  });

  const { current, stepComponent } = useStep({ category: shipCategoryType! });

  return (
    <PageHeaderWrapper title="新船舶信息" content="按表单提示填入相应船舶信息">
      <Card bordered={false}>
        <>
          <Steps current={current} className={styles.steps}>
            <Steps.Step title="基本信息" />
            <Steps.Step title="船机信息" />
            <Steps.Step title="载重吨信息" />
            <Steps.Step title="证书信息" />
            <Steps.Step title="船员信息" />
            <Steps.Step title="完成" />
          </Steps>
          {stepComponent}
          <div>TODO</div>
        </>
      </Card>
    </PageHeaderWrapper>
  );
};

export default CreateShip;
