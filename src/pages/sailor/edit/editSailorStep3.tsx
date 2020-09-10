import React from 'react';
import { Result, Descriptions } from 'antd';
import { ISailor } from '@/interfaces/ISailor';
import { SailorKeyMap } from '@/services/sailorService';

interface EditSailorStep3Props {
  sailor?: ISailor;
}

const EditSailorStep3: React.FC<EditSailorStep3Props> = ({ sailor }) => {
  const information = (
    <div>
      <Descriptions column={1}>
        <Descriptions.Item label={SailorKeyMap.name}>{sailor?.name} </Descriptions.Item>
        <Descriptions.Item label={SailorKeyMap.identityNumber}>{sailor?.identityNumber} </Descriptions.Item>
        <Descriptions.Item label={SailorKeyMap.sailorDutyTypeName}>{sailor?.sailorDutyTypeName} </Descriptions.Item>
        <Descriptions.Item label={SailorKeyMap.mobile}>{sailor?.mobile} </Descriptions.Item>
        <Descriptions.Item label={SailorKeyMap.licenseNumber}>{sailor?.licenseNumber} </Descriptions.Item>
        <Descriptions.Item label={SailorKeyMap.address}>{sailor?.address} </Descriptions.Item>
      </Descriptions>
    </div>
  );

  return (
    <div>
      <Result status="success" title="操作成功" subTitle="船员信息已经录入">
        {information}
      </Result>
    </div>
  );
};

export default EditSailorStep3;
