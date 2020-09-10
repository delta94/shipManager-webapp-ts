import React, { useState, useEffect } from 'react';
import { ISailor, ISailorCert, ISailorCertType } from '@/interfaces/ISailor';
import { IssueDepartmentType } from '@/interfaces/IIssueDepartment';
import { Button, Modal, Card, Col, Row, Divider, Popconfirm } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import styles from './styles/step2.less';
import EditSailorCertForm from "./editSailorCertForm";

interface EditSailorStep2Props {
  sailor?: ISailor;
  loading: boolean;
  onNext(sailor: Partial<ISailor>): void;
  onPrev(sailor: Partial<ISailor>): void;
  sailorCertTypes?: ISailorCertType[];
  issueDepartmentTypes?: IssueDepartmentType[];
}

const EditSailorStep2: React.FC<EditSailorStep2Props> = ({
  sailor,
  loading,
  onNext,
  onPrev,
  sailorCertTypes,
  issueDepartmentTypes,
}) => {
  const [visible, updateVisible] = useState(false);
  const [editCertificate, updateEditCertificate] = useState<ISailorCert>();
  const [sailorCerts, updateSailorCerts] = useState<ISailorCert[]>([]);

  useEffect(() => {
    if (sailor && Array.isArray(sailor.sailorCerts)) {
      updateSailorCerts(sailor.sailorCerts);
    }
  }, [sailor]);

  const onBack = () => {
    let newSailor = { ...sailor, ...{ sailorCerts } };
    onPrev(newSailor);
  };

  const onDone = () => {
    let newSailor = { ...sailor, ...{ sailorCerts } };
    onNext(newSailor);
  };

  const onSubmit = (certificate: ISailorCert) => {
    updateSailorCerts((data: ISailorCert[]) => {
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

  const onEdit = (certificate: ISailorCert) => {
    updateEditCertificate({ ...certificate });
    updateVisible(true);
  };

  const onDelete = (certificate: ISailorCert) => {
    updateSailorCerts(certificates => {
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
          {sailorCerts?.map(item => {
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
                    <span>类型</span>： {item.sailorCertTypeName}
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
      <Modal destroyOnClose width={620} visible={visible} onCancel={onCancel} footer={null} title="编辑船员证书">
        <EditSailorCertForm
          certificate={editCertificate}
          certificateType={sailorCertTypes}
          issueDepartmentType={issueDepartmentTypes}
          onCancel={onCancel}
          onSubmit={onSubmit}
        />
      </Modal>
    </div>
  );
};

export default EditSailorStep2;
