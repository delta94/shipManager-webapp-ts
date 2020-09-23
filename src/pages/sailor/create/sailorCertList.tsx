import React, { useState, useEffect } from 'react';
import { ISailorCert, ISailorCertType } from '@/interfaces/ISailor';
import { PlusOutlined } from '@ant-design/icons';
import { Button, List, Avatar, Modal, Popconfirm } from 'antd';
import { ReactComponent as CertificateIcon } from '@/assets/svg/certificate.svg';
import styles from './style.less';
import EditSailorCertForm from './editSailorCertForm';
import { IssueDepartmentType } from '@/interfaces/IIssueDepartment';
import usePrevious from '@/hooks/usePrevious';

interface SailorCertListProps {
  value?: ISailorCert[];
  onChange?: (value: ISailorCert[]) => void;
  onFileChange?: (value: ISailorCert, action: 'remove' | 'insert' | 'update') => void;
  issueDepartmentTypes?: IssueDepartmentType[];
  sailorCertTypes?: ISailorCertType[];
}

const ListExtraContent: React.FC<Partial<ISailorCert>> = ({ issueDepartmentTypeName, issuedAt, expiredAt }) => {
  return (
    <div className={styles.listContent}>
      <div className={styles.listContentItem}>
        <span>颁发机构</span>
        <p>{issueDepartmentTypeName}</p>
      </div>
      <div className={styles.listContentItem}>
        <span>颁发日期</span>
        <p>{issuedAt}</p>
      </div>
      <div className={styles.listContentItem}>
        <span>有效期至</span>
        <p>{expiredAt}</p>
      </div>
    </div>
  );
};

const SailorCertList: React.FC<SailorCertListProps> = ({
  value = [],
  onChange,
  onFileChange,
  sailorCertTypes,
  issueDepartmentTypes,
}) => {
  const [visible, updateVisible] = useState(false);
  const [editCertificate, setEditCertificate] = useState<ISailorCert>();
  const [data, setData] = useState<Partial<ISailorCert>[]>(value);
  const previous = usePrevious<ISailorCert[]>(value);

  useEffect(() => {
    if (previous && previous.length == 0 && Array.isArray(value) && value.length > 0) {
      setData(value);
    }
  }, [value]);

  const onCreate = () => {
    setEditCertificate(undefined);
    updateVisible(true);
  };

  const onRemove = (cert: ISailorCert) => {
    const newData = data?.filter((item) => item.id !== cert.id) as ISailorCert[];
    setData(newData);
    if (onFileChange) {
      onFileChange(cert, 'remove');
    }
    if (onChange) {
      onChange(newData);
    }
  };

  const onEdit = (certificate: ISailorCert) => {
    setEditCertificate(certificate);
    updateVisible(true);
  };

  const onCancel = () => {
    setEditCertificate(undefined);
    updateVisible(false);
  };

  const onSubmit = (certificate: ISailorCert) => {
    setEditCertificate(undefined);
    updateVisible(false);
    setData((data) => {
      let index = data.findIndex((item) => item.id == certificate.id);
      let newData = [...data];
      if (index > -1) {
        newData[index] = certificate;
      } else {
        newData.push(certificate);
      }

      if (onFileChange) {
        onFileChange(certificate, editCertificate ? 'update' : 'insert');
      }

      if (onChange) {
        onChange(newData as ISailorCert[]);
      }
      return newData;
    });
  };

  return (
    <div>
      <Button type="dashed" style={{ width: '100%', marginBottom: 8 }} onClick={() => onCreate()}>
        <PlusOutlined />
        添加证书
      </Button>

      <List<ISailorCert>
        size="large"
        rowKey="id"
        pagination={false}
        dataSource={data as ISailorCert[]}
        renderItem={(item: ISailorCert) => (
          <List.Item
            actions={[
              <Button type="link" key="edit" className="px-1" onClick={() => onEdit(item)}>
                编辑
              </Button>,
              <Popconfirm title="是否要删除此证书？" onConfirm={() => onRemove(item)} okText="确认" cancelText="取消">
                <a>删除</a>
              </Popconfirm>,
            ]}
          >
            <List.Item.Meta
              avatar={<Avatar shape="square" size="large" className="mt-1" icon={<CertificateIcon />} />}
              title={item.name}
              description={`证书编号：${item.identityNumber}`}
            />
            <ListExtraContent {...item} />
          </List.Item>
        )}
      />

      <Modal
        title={`${editCertificate ? '编辑' : '新建'}船员证书`}
        destroyOnClose
        width={620}
        visible={visible}
        onCancel={onCancel}
        footer={null}
      >
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

export default SailorCertList;
