import React, { useState, useEffect } from 'react';
import { IManagerCert } from '@/interfaces/IManager';
import { PlusOutlined } from '@ant-design/icons';
import { Button, List, Avatar, Modal, Popconfirm } from 'antd';
import { ReactComponent as CertificateIcon } from '@/assets/svg/certificate.svg';
import styles from './style.less';
import EditManagerCertForm from './editManagerCertForm';
import usePrevious from '@/hooks/usePrevious';

interface ManagerCertListProps {
  value?: IManagerCert[];
  onChange?: (value: IManagerCert[]) => void;
  onFileChange?: (value: IManagerCert, action: 'remove' | 'insert' | 'update') => void;
}

const ListExtraContent: React.FC<Partial<IManagerCert>> = ({ issueDepartmentTypeName, issuedAt, expiredAt }) => {
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

const ManagerCertList: React.FC<ManagerCertListProps> = ({ value = [], onChange, onFileChange }) => {
  const [visible, updateVisible] = useState(false);
  const [editCertificate, setEditCertificate] = useState<Partial<IManagerCert>>();
  const [data, setData] = useState<Partial<IManagerCert>[]>(value);
  const previous = usePrevious<IManagerCert[]>(value);

  useEffect(() => {
    if (previous && previous.length == 0 && Array.isArray(value) && value.length > 0) {
      setData(value);
    }
  }, [value]);

  const onCreate = () => {
    setEditCertificate(undefined);
    updateVisible(true);
  };

  const onRemove = (cert: IManagerCert) => {
    const newData = data?.filter((item) => item.id !== cert.id) as IManagerCert[];
    setData(newData);
    if (onFileChange) {
      onFileChange(cert, 'remove');
    }
    if (onChange) {
      onChange(newData);
    }
  };

  const onEdit = (certificate: IManagerCert) => {
    setEditCertificate(certificate);
    updateVisible(true);
  };

  const onCancel = () => {
    setEditCertificate(undefined);
    updateVisible(false);
  };

  const onSubmit = (certificate: IManagerCert) => {
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
        onChange(newData as IManagerCert[]);
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

      <List<IManagerCert>
        size="large"
        rowKey="id"
        pagination={false}
        dataSource={data as IManagerCert[]}
        renderItem={(item: IManagerCert) => (
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
              title={`${item.name}`}
              description={`${item.managerCertTypeName} | 证书编号：${item.identityNumber}`}
            />
            <ListExtraContent {...item} />
          </List.Item>
        )}
      />

      <Modal
        title={`${editCertificate ? '编辑' : '新建'}管理人员证书`}
        destroyOnClose
        width={620}
        visible={visible}
        onCancel={onCancel}
        footer={null}
      >
        <EditManagerCertForm managerCert={editCertificate} onCancel={onCancel} onSubmit={onSubmit} />
      </Modal>
    </div>
  );
};

export default ManagerCertList;
