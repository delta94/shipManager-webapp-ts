import React, { useState, useEffect } from 'react';
import { IManager, IManagerCert, IManagerCertType } from '@/interfaces/IManager';
import { Button, Modal, Card, Col, Row, Divider, Popconfirm } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import styles from './styles/step2.less';
import { IssueDepartmentType } from '@/interfaces/IIssueDepartment';
import EditManagerCertForm from '@/pages/manager/edit/editManagerCertForm';

interface EditManagerStep2Props {
  manager?: IManager;
  loading: boolean;
  onNext(manager: Partial<IManager>): void;
  onPrev(manager: Partial<IManager>): void;
  managerCertTypes?: IManagerCertType[];
  issueDepartmentTypes?: IssueDepartmentType[];
}

const EditManagerStep2: React.FC<EditManagerStep2Props> = ({
  manager,
  loading,
  onNext,
  onPrev,
  managerCertTypes,
  issueDepartmentTypes,
}) => {
  const [visible, updateVisible] = useState(false);
  const [editCertificate, updateEditCertificate] = useState<IManagerCert>();
  const [managerCerts, updateManagerCerts] = useState<IManagerCert[]>([]);

  useEffect(() => {
    if (manager && Array.isArray(manager.managerCerts)) {
      updateManagerCerts(manager.managerCerts);
    }
  }, [manager]);

  const onBack = () => {
    let newManager = { ...manager, ...{ managerCerts } };
    onPrev(newManager);
  };

  const onDone = () => {
    let newManager = { ...manager, ...{ managerCerts } };
    onNext(newManager);
  };

  const onSubmit = (certificate: IManagerCert) => {
    updateManagerCerts((data: IManagerCert[]) => {
      let index = data.findIndex(item => item.id == certificate.id);
      let newData = [...data];
      if (index > -1) {
        newData[index] = certificate;
      } else {
        newData.push(certificate);
      }
      return newData;
    });
    updateEditCertificate(undefined);
    updateVisible(false);
  };

  const onCancel = () => {
    updateEditCertificate(undefined);
    updateVisible(false);
  };

  const onEdit = (certificate: IManagerCert) => {
    updateEditCertificate({ ...certificate });
    updateVisible(true);
  };

  const onDelete = (certificate: IManagerCert) => {
    updateManagerCerts(certificates => {
      let index = certificates.findIndex(item => item.id == certificate.id);
      let newData = [...certificates];
      if (index > -1 && !certificate.id.toString().startsWith('new_')) {
        newData[index].isRemoved = true;
      } else {
        newData = newData.filter(item => item.id != certificate.id);
      }
      return newData;
    });
  };

  return (
    <div>
      <div className={styles.wrapper}>
        <Row gutter={8}>
          {managerCerts?.map(item => {
            if (item.isRemoved) return null;
            return (
              <Col span={8} key={item.id}>
                <Card
                  size="small"
                  title={item.name}
                  extra={[
                    <a onClick={() => onEdit(item)}>编辑</a>,
                    <Divider type="vertical" />,
                    <Popconfirm title="是否要删除此证书？" onConfirm={() => onDelete(item)}>
                      <a>删除</a>
                    </Popconfirm>,
                  ]}
                >
                  <p>
                    <span>编号</span>： {item.identityNumber}
                  </p>
                  <p>
                    <span>过期日期</span>： {item.expiredAt}
                  </p>
                  <p>
                    <span>颁发日期</span>： {item.issuedAt}
                  </p>
                  <p>
                    <span>类型</span>： {item.managerCertTypeName}
                  </p>
                </Card>
              </Col>
            );
          })}
          <Col span={3}>
            <Button type="dashed" className={styles.newButton} onClick={() => updateVisible(true)}>
              <PlusOutlined />
            </Button>
          </Col>
        </Row>
      </div>
      <div style={{ height: 30 }} />
      <div className="g-ant-modal-footer">
        <Button style={{ marginRight: 12 }} onClick={onBack}>
          上一步
        </Button>
        <Button type="primary" onClick={onDone} loading={loading}>
          提交
        </Button>
      </div>
      <Modal destroyOnClose width={620} visible={visible} onCancel={onCancel} footer={null} title="编辑人员证书">
        <EditManagerCertForm
          certificate={editCertificate}
          certificateType={managerCertTypes}
          issueDepartmentType={issueDepartmentTypes}
          onCancel={onCancel}
          onSubmit={onSubmit}
        />
      </Modal>
    </div>
  );
};

export default EditManagerStep2;
