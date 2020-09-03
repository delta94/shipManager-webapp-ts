import React, { useMemo, useState, useCallback } from 'react';
import { List, Modal, message } from 'antd';
import EditPasswordForm from './EditPasswordForm';
import { useDispatch } from 'dva';

type Unpacked<T> = T extends (infer U)[] ? U : T;

const SecurityView: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const dispatch = useDispatch();

  const handleFormSubmit = useCallback((values: any) => {
    dispatch({
      type: 'user/updateCurrentPassword',
      payload: values,
      callback: (error: any) => {
        if (error) {
          message.error('密码修改失败, 请输入正确的当前密码');
        } else {
          message.success('密码修改成功');
          setVisible(false);
        }
      },
    });
  }, []);

  const data = useMemo(() => {
    return [
      {
        title: '账户密码',
        description: '当前密码强度：：强',
        actions: [
          <a key="Modify" onClick={() => setVisible(true)}>
            修改
          </a>,
        ],
      },
    ];
  }, []);

  return (
    <>
      <List<Unpacked<typeof data>>
        itemLayout="horizontal"
        dataSource={data}
        renderItem={item => (
          <List.Item actions={item.actions}>
            <List.Item.Meta title={item.title} description={item.description} />
          </List.Item>
        )}
      />
      <Modal
        destroyOnClose
        width={620}
        visible={visible}
        onCancel={() => setVisible(false)}
        footer={null}
        title="更改用户密码"
      >
        <EditPasswordForm onCancel={() => setVisible(false)} onSubmit={handleFormSubmit} />
      </Modal>
    </>
  );
};

export default SecurityView;
