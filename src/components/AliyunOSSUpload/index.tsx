import React, { useState, useCallback, useEffect } from 'react';
import { Upload, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { UploadFile, UploadChangeParam } from 'antd/lib/upload/interface';
import OssClient, { generateOSSFullPath, generateOSSKey, OSSResourceType } from '@/utils/OSSClient';
import usePrevious from '@/hooks/usePrevious';
import IOSSMetaFile from '@/interfaces/IOSSMetaFile';
import { formatOSSFilesToUploadFile } from '@/utils/parser';

interface AliyunOSSUploadProps {
  value?: IOSSMetaFile[];
  accept?: string;
  listType: 'text' | 'picture' | 'picture-card';
  onChange?(value: UploadFile[]): void;
  ossResourceType?: OSSResourceType;
}

const AliyunOSSUpload: React.FC<AliyunOSSUploadProps> = (props) => {
  const [fileList, setFileList] = useState<UploadFile[]>();
  const previousValue = usePrevious(props.value);

  const customRequest = useCallback(({ file, headers, onError, onProgress, onSuccess }) => {
    OssClient.getInstance()
      .then((ossClient) => {
        let resourceType = props.ossResourceType ? props.ossResourceType : OSSResourceType.CompanyCert;
        let key = generateOSSKey(file, resourceType);
        return ossClient.multipartUpload(key, file, {
          parallel: 1,
          partSize: 1024 * 1024,
          progress(p, cpt, res) {
            onProgress({ percent: Math.round(p * 100).toFixed(2), file });
            console.debug('multipartUpload progress: ', p, cpt, res);
          },
          headers,
        });
      })
      .then((result) => {
        if (result.name) {
          file.url = generateOSSFullPath(result.name);
          onSuccess(result, file);
        }
        console.log(result);
      })
      .catch((error) => {
        onError(error);
      });

    return {
      abort() {
        console.log('upload progress is aborted.');
      },
    };
  }, []);

  const onUploaderChange = useCallback((info: UploadChangeParam) => {
    if (props.onChange) {
      props.onChange(info.fileList);
    }
    setFileList([...info.fileList]);
  }, []);

  useEffect(() => {
    if (previousValue == undefined && props.value) {
      let fileList = formatOSSFilesToUploadFile(props.value);
      setFileList(fileList);
      if (props.onChange) {
        props.onChange(fileList);
      }
    }
  }, [previousValue, props.value]);

  return (
    <Upload
      fileList={fileList}
      listType={props.listType}
      onChange={onUploaderChange}
      accept={props.accept}
      customRequest={customRequest}
    >
      <Button>
        <UploadOutlined /> 上传文件
      </Button>
    </Upload>
  );
};

export default AliyunOSSUpload;
