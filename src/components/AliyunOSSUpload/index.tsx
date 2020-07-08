import React, { useState, useCallback, useEffect } from 'react';
import { Upload, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { UploadFile, UploadChangeParam } from 'antd/lib/upload/interface';
import OssClient, { generateOSSFullPath, generateOSSKey, OSSResourceType } from '@/utils/OSSClient';
import { usePrevious } from '@umijs/hooks';
import IOSSMetaFile from '@/interfaces/IOSSMetaFile';

interface AliyunOSSUploadProps {
  value?: IOSSMetaFile[];
  listType: 'text' | 'picture' | 'picture-card';
  onChange?(value: UploadFile[]): void;
  ossResourceType?: OSSResourceType;
}

let formatOSSFiles = (files: IOSSMetaFile[]): UploadFile[] => {
  if (files && Array.isArray(files) && files.length > 0) {
    return files.map(file => {
      return {
        uid: `uploaded_${file.id.toString()}`,
        type: file.type,
        size: file.size,
        name: file.name,
        url: file.ossKey,
        linkProps: {
          uploadBy: file.uploadBy,
          uploadAt: file.uploadAt,
          remark: file.remark,
          id: file.id,
        },
      };
    });
  }
  return [];
};

const AliyunOSSUpload: React.FC<AliyunOSSUploadProps> = props => {
  const [fileList, setFileList] = useState<UploadFile[]>();
  const previousValue = usePrevious(props.value);

  const customRequest = useCallback(({ file, headers, onError, onProgress, onSuccess }) => {
    OssClient.getInstance()
      .then(ossClient => {
        let resourceType = props.ossResourceType ? props.ossResourceType : OSSResourceType.CompanyCert;
        let key = generateOSSKey(file, resourceType);
        return ossClient.multipartUpload(key, file, {
          parallel: 4,
          partSize: 1024 * 1024,
          progress(p, cpt, res) {
            onProgress({ percent: Math.round(p * 100).toFixed(2), file });
            console.debug('multipartUpload progress: ', p, cpt, res);
          },
          headers,
        });
      })
      .then(result => {
        if (result.name) {
          file.url = generateOSSFullPath(result.name);
          onSuccess(result, file);
        }
        console.log(result);
      })
      .catch(error => {
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
      let fileList = formatOSSFiles(props.value);
      setFileList(fileList);
    }
  }, [previousValue, props.value]);

  return (
    <div>
      <Upload fileList={fileList} listType={props.listType} onChange={onUploaderChange} customRequest={customRequest}>
        <Button>
          <UploadOutlined /> 上传文件
        </Button>
      </Upload>
    </div>
  );
};

export default AliyunOSSUpload;
