import React from 'react';
import { Upload, Modal, message, Button } from 'antd';
import OssClient, { generateOSSKey, OSSResourceType } from '@/utils/OSSClient';
import { UploadOutlined } from '@ant-design/icons';
import { UploadFile, UploadListType } from 'antd/lib/upload/interface';

interface FileUploadState {
  visible: boolean;
  fileList: UploadFile[];
  previewImage: string;
}

interface FileUploadProps {
  value?: UploadFile[];
  onChange?(value: any): void;
  listType?: UploadListType;
  limit?: number;
}

export default class FileUpload extends React.Component<FileUploadProps, FileUploadState> {
  static getDerivedStateFromProps(nextProps: FileUploadProps, prevState: FileUploadState) {
    if (
      nextProps.value &&
      nextProps.value.length > 0 &&
      prevState.fileList &&
      prevState.fileList.length == 0
    ) {
      return { fileList: nextProps.value };
    }
    return null;
  }

  static defaultProps = {
    listType: 'picture-card',
    limit: 3,
  };

  state: FileUploadState = {
    visible: false,
    previewImage: '',
    fileList: [],
  };

  handleCancel = () => {
    this.setState({ visible: false });
  };

  handlePreview = (file: UploadFile) => {
    this.setState({
      previewImage: file.thumbUrl || '',
      visible: true,
    });
  };

  handleRemove = (file: UploadFile) => {
    const newValues = this.state.fileList.filter(item => item.uid != file.uid);
    this.setState({ fileList: newValues });
    this.props.onChange && this.props.onChange(newValues);
  };

  handleBeforeUpload = (file: any) => {
    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onloadend = async () => {
      const ossClient = await OssClient.getInstance();
      const key = generateOSSKey(file, OSSResourceType.CompanyCert);
      const hideLoading = message.loading('文件上传中...');
      ossClient
        .multipartUpload(key, file, {})
        .then(({ name }) => {
          hideLoading();
          message.success('文件上传成功');

          const newImage: UploadFile = {
            uid: file.uid,
            name: file.name,
            type: file.type,
            size: file.size,
            thumbUrl: ossClient.resolveOSSPath(name),
            url: name,
          };

          const newValues = [...this.state.fileList, newImage];

          this.setState({ fileList: newValues }, () => {
            this.props.onChange && this.props.onChange(newValues);
          });
        })
        .catch(error => {
          hideLoading();
          message.error('文件上传失败');
          console.error(error);
        });
    };
    return false;
  };

  render() {
    const { visible, previewImage, fileList } = this.state;
    const { limit, listType } = this.props;

    const uploadButton = (
      <Button>
        <UploadOutlined /> 上传文件
      </Button>
    );

    return (
      <div>
        <Upload
          listType={listType!}
          fileList={fileList}
          onRemove={this.handleRemove}
          onPreview={this.handlePreview}
          beforeUpload={this.handleBeforeUpload}
        >
          {fileList.length >= limit! ? null : uploadButton}
        </Upload>
        <Modal visible={visible} destroyOnClose footer={null} onCancel={this.handleCancel}>
          <img alt="preview" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}
