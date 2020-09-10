import React, { useCallback, useEffect, useState, useRef } from 'react';
import styles from './BaseView.less';
import { Form, Input, Typography, Avatar, Button, message } from 'antd';
import { useDispatch, useSelector } from 'dva';
import { UserKeyMap } from '@/services/userService';
import { ConnectState } from '@/models/connect';
import AliyunOSSUpload from '@/components/AliyunOSSUpload';
import { OSSResourceType } from '@/utils/OSSClient';
import defaultAvatar from '@/assets/icons/avatar.png';
import { UploadFile } from 'antd/lib/upload/interface';
import { MessageType } from 'antd/lib/message';

const BaseView: React.FC = () => {
  const dispatch = useDispatch();

  const currentUser = useSelector((s: ConnectState) => s.user.currentUser!);

  const [image, setImage] = useState<string>(defaultAvatar);

  const [loading, setLoading] = useState(false);

  const [form] = Form.useForm();

  const uploading = useRef<MessageType>();

  useEffect(() => {
    if (currentUser?.id) {
      form.setFieldsValue(currentUser);
    }
    if (currentUser?.imageUrl) {
      setImage(currentUser.imageUrl);
    }
  }, [currentUser]);

  const handleFinish = useCallback(
    values => {
      let image_url = image?.startsWith('http') ? image : currentUser.imageUrl;
      setLoading(true);

      dispatch({
        type: 'user/updateCurrent',
        payload: {
          ...values,
          imageUrl: image_url,
        },
        callback() {
          setLoading(false);
          message.success('用户信息更新成功');
        },
      });
    },
    [image],
  );

  const onReset = useCallback(() => {
    if (currentUser?.id) {
      form.setFieldsValue(currentUser);
    }
    if (currentUser?.imageUrl) {
      setImage(currentUser.imageUrl);
    }
  }, [form, currentUser]);

  const onAvatarChange = useCallback((files: UploadFile[]) => {
    if (files && files.length > 0) {
      //@ts-ignore
      if (files[0]?.originFileObj?.url) {
        //@ts-ignore
        setImage(files[0]?.originFileObj?.url);
        uploading.current?.();
        //@ts-ignore
        uploading.current = null;
        message.success('头像上传成功');
      } else if (files[0].thumbUrl) {
        setImage(files?.[0].thumbUrl);
        if (!uploading.current) {
          uploading.current = message.loading('头像正在上传');
        }
      }
    }
  }, []);

  return (
    <div className={styles.baseView}>
      <div className={styles.left}>
        <Form layout="vertical" form={form} onFinish={handleFinish} onReset={onReset}>
          <Form.Item label="id" name="id" noStyle>
            <Input type="hidden" />
          </Form.Item>

          <Form.Item label="login" name="login" noStyle>
            <Input type="hidden" />
          </Form.Item>

          <Form.Item>
            <Typography.Text>登录名：{currentUser?.login}</Typography.Text>
          </Form.Item>

          <Form.Item
            name="firstName"
            label={UserKeyMap.firstName}
            rules={[
              {
                required: true,
                message: `请输入 ${UserKeyMap.firstName}`,
              },
            ]}
          >
            <Input placeholder={`请输入 ${UserKeyMap.firstName}`} />
          </Form.Item>

          <Form.Item
            name="email"
            label={UserKeyMap.email}
            rules={[
              {
                required: true,
                message: `请输入 ${UserKeyMap.email}`,
              },
            ]}
          >
            <Input placeholder={`请输入 ${UserKeyMap.email}`} />
          </Form.Item>

          <Form.Item
            name="mobile"
            label={UserKeyMap.mobile}
            rules={[
              {
                required: false,
                message: `请输入 ${UserKeyMap.mobile}`,
              },
            ]}
          >
            <Input placeholder={`请输入 ${UserKeyMap.mobile}`} />
          </Form.Item>

          <Form.Item
            name="address"
            label={UserKeyMap.address}
            rules={[
              {
                required: false,
                message: `请输入 ${UserKeyMap.address}`,
              },
            ]}
          >
            <Input.TextArea placeholder={`请输入 ${UserKeyMap.address}`} />
          </Form.Item>

          <Button style={{ marginRight: 12 }} htmlType="reset">
            取消
          </Button>
          <Button type="primary" htmlType="submit" loading={loading}>
            保存
          </Button>
        </Form>
      </div>

      <div className={styles.right}>
        <p>个人头像</p>
        <Avatar size={120} src={image} />
        <br />
        <br />
        <AliyunOSSUpload
          accept={'image/*'}
          listType="picture"
          ossResourceType={OSSResourceType.Account}
          onChange={onAvatarChange}
        />
      </div>
    </div>
  );
};

export default BaseView;
