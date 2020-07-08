import moment from 'moment';
import IOSSMetaFile from '@/interfaces/IOSSMetaFile';
import { UploadFile } from 'antd/lib/upload/interface';
import { Pagination } from '@/interfaces/ITableList';

export const dateFormatter = (values: any): any => {
  if (values.expiredAt && typeof values.expiredAt == 'string') {
    values.expiredAt = moment(values.expiredAt);
  }
  if (values.issuedAt && typeof values.issuedAt == 'string') {
    values.issuedAt = moment(values.issuedAt);
  }
  return values;
};

export const formatOSSFilesToUploadFile = (files: IOSSMetaFile[]): UploadFile[] => {
  if (files && Array.isArray(files) && files.length > 0) {
    return files.map(file => {
      if (file.id) {
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
      }
      // @ts-ignore
      return file as UploadFile;
    });
  }
  return [];
};

export const formatUploadFileToOSSFiles = (value: any): any => {
  if (value.ossFiles && Array.isArray(value.ossFiles) && value.ossFiles.length > 0) {
    value.ossFiles = value.ossFiles.map((file: UploadFile) => {
      let meta = {
        name: file.name || file.fileName,
        size: file.size,
        type: file.type,
        // @ts-ignore
        ossKey: file.url || file?.originFileObj?.url || '',
        uploadAt: moment().format('YYYY-MM-DD'),
      } as Partial<IOSSMetaFile>;

      if (file.linkProps) {
        meta.id = file.linkProps.id;
        meta.uploadBy = file.linkProps.uploadBy ? file.linkProps.uploadBy : '';
        meta.uploadAt = file.linkProps.uploadAt ? file.linkProps.uploadBy : '';
        meta.remark = file.linkProps.remark ? file.linkProps.remark : '';
      }
      return meta;
    });
  } else {
    value.ossFiles = [];
  }

  return value;
};

export const parsePagination = (headers: Headers): Pagination => {
  return {
    current: parseInt(headers.get('X-Page-Current') || '0'),
    total: parseInt(headers.get('X-Page-Total') || '0'),
    pageSize: parseInt(headers.get('X-Page-Size') || '0'),
  };
};
