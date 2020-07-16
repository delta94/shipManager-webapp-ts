import React from 'react';
import { Result, Descriptions } from 'antd';
import { IManager } from '@/interfaces/IManager';
import {ManagerKeyMap} from "@/services/managerService";

interface EditManagerStep3Props {
  manager?: IManager;
}

const EditManagerStep3: React.FC<EditManagerStep3Props> = ({ manager }) => {
  const information = (
    <div>
      <Descriptions column={1}>
        <Descriptions.Item label={ManagerKeyMap.name}>{manager?.name} </Descriptions.Item>
        <Descriptions.Item label={ManagerKeyMap.identityNumber}>{manager?.identityNumber} </Descriptions.Item>
        <Descriptions.Item label={ManagerKeyMap.mobile}>{manager?.mobile} </Descriptions.Item>
        <Descriptions.Item label={ManagerKeyMap.educationLevel}>{manager?.educationLevel} </Descriptions.Item>
        <Descriptions.Item label={ManagerKeyMap.managerDutyName}>{manager?.managerDutyName} </Descriptions.Item>
        <Descriptions.Item label={ManagerKeyMap.managerPositionName}>{manager?.managerPositionName} </Descriptions.Item>
      </Descriptions>
    </div>
  );

  return (
    <div>
      <Result status="success" title="操作成功" subTitle="管理人员信息已经录入">
        {information}
      </Result>
    </div>
  );
};

export default EditManagerStep3;
