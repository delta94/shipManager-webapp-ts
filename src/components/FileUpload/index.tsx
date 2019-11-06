import { Upload, Icon, Modal, message, Button } from 'antd';
import React from 'react';

import OssClient, { generateOSSKey, resolveOSSPath } from '@/utils/OSSClient';
import { UploadListType } from 'antd/es/upload/interface';

interface FileUploadState {
  previewVisible: boolean;
  fileList: any[];
  limit: number;
  previewImage: string;
}

interface FileUploadProps {
  onChange?: (values: any) => void;
  listType?: UploadListType;
}

class FileUpload extends React.Component<FileUploadProps, FileUploadState> {
  static getDerivedStateFromProps(nextProps: any) {
    // Should be a controlled component.
    if ('value' in nextProps) {
      return {
        ...(nextProps.value || {}),
      };
    }
    return null;
  }

  state = {
    previewVisible: false,
    limit: 3,
    previewImage: '',
    fileList: [],
  };

  handleCancel = () => {
    this.setState({
      previewVisible: false,
    });
  };

  handlePreview = (file: any) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  };

  handleRemove = (file: any) => {
    // @ts-ignore
    const newValues = this.state.fileList.filter(item => item.url != file.url);

    this.setState(({ fileList }) => ({ fileList: newValues }));

    const { onChange } = this.props;

    if (onChange) {
      onChange({ fileList: newValues });
    }
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
        .then(({ bucket, name, res }) => {
          message.success('文件上传成功');
          const url = resolveOSSPath(bucket, name);

          const newImage = {
            uid: file.uid,
            name: file.name,
            status: file.status,
            type: file.type,
            size: res.size,
            result: name,
            url,
          };

          const newValues = [...this.state.fileList, newImage];

          const { onChange } = this.props;

          if (onChange) {
            onChange({ fileList: newValues });
          }

          this.setState(({ fileList }) => ({ fileList: newValues }));
        })
        .catch(error => {
          message.error('文件上传失败');
          console.error(error);
        });
    };
    return false;
  };

  render() {
    const { previewVisible, previewImage, fileList, limit } = this.state;

    const uploadButton = (
      <Button>
        <Icon type="upload" /> 上传文件
      </Button>
    );

    return (
      <div>
        <Upload
          listType={this.props.listType}
          fileList={fileList}
          onRemove={this.handleRemove}
          onPreview={this.handlePreview} // 点击图片缩略图，进行预览
          beforeUpload={this.handleBeforeUpload} // 上传之前，对图片的格式做校验，并获取图片的宽高
        >
          {fileList.length >= limit ? null : uploadButton}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}

export default FileUpload;
