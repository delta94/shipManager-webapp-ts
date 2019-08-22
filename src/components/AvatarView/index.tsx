import { Upload, Button, message } from 'antd';
import React from 'react';
import OssClient, { generateOSSKey, resolveOSSPath } from '@/utils/OSSClient';

import styles from './styles.less';

interface AvatarViewState {
  avatar: string;
}

interface AvatarViewProps {
  onChange?: (values: any) => void;
}

class AvatarView extends React.Component<AvatarViewProps, AvatarViewState> {
  static getDerivedStateFromProps(nextProps: any) {
    // Should be a controlled component.
    if ('value' in nextProps) {
      return {
        avatar: nextProps.value,
      };
    }
    return null;
  }

  state = {
    avatar: '',
  };

  // 参考链接：https://www.jianshu.com/p/f356f050b3c9
  handleBeforeUpload = (file: any) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = async () => {
      const ossClient = await OssClient.getInstance();
      const key = generateOSSKey(file);

      ossClient
        .multipartUpload(key, file, {})
        .then(({ bucket, name }) => {
          message.success('头像上传成功');

          const url = resolveOSSPath(bucket, name);

          if (this.props.onChange) {
            this.props.onChange(url);
          }

          this.setState({ avatar: url });
        })
        .catch(error => {
          message.error('头像上传失败');
          console.error(error);
        });
    };
    return false;
  };

  render() {
    return (
      <div>
        <div className={styles.avatar_title}> 个人头像</div>
        <div className={styles.avatar}>
          <img src={this.state.avatar} alt="avatar" />
        </div>
        <Upload beforeUpload={this.handleBeforeUpload} fileList={[]}>
          <div className={styles.button_view}>
            <Button icon="upload">修改头像</Button>
          </div>
        </Upload>
      </div>
    );
  }
}

export default AvatarView;
