import moment from 'moment';
import IOSSMetaFile from '@/interfaces/IOSSMetaFile';
import { UploadFile } from 'antd/lib/upload/interface';
import { Pagination } from '@/interfaces/ITableList';
import { IShip } from '@/interfaces/IShip';

export const dateFormatter = (values: any): any => {
  if (values.expiredAt) {
    if (typeof values.expiredAt == 'string') {
      values.expiredAt = moment(values.expiredAt);
    }
  }
  if (values.issuedAt) {
    if (typeof values.issuedAt == 'string') {
      values.issuedAt = moment(values.issuedAt);
    }
  }

  if (values.buildAt) {
    if (typeof values.buildAt == 'string') {
      values.buildAt = moment(values.buildAt);
    }
  }

  if (values.assembleAt) {
    if (typeof values.assembleAt == 'string') {
      values.assembleAt = moment(values.assembleAt);
    }
  }

  if (values.birthDate) {
    if (typeof values.birthDate == 'string') {
      values.birthDate = moment(values.birthDate);
    }
  }

  if (values.contractWorkAt) {
    if (typeof values.contractWorkAt == 'string') {
      values.contractWorkAt = moment(values.contractWorkAt);
    }
  }

  if (values.contractExpiryAt) {
    if (typeof values.contractExpiryAt == 'string') {
      values.contractExpiryAt = moment(values.contractExpiryAt);
    }
  }

  return values;
};

export const transferMomentToString = (values: object): object => {
  // @ts-ignore
  Object.keys(values).forEach((key) => {
    if (values[key] != null && typeof values[key] == 'object' && values[key]._isAMomentObject) {
      // @ts-ignore
      values[key] = values[key].format('YYYY-MM-DD');
    }
  });
  return values;
};

export const dateFormatterToString = (values: any): any => {
  if (values.expiredAt && moment.isMoment(values.expiredAt)) {
    values.expiredAt = values.expiredAt.format('YYYY-MM-DD');
  }

  if (values.issuedAt && moment.isMoment(values.issuedAt)) {
    values.issuedAt = values.issuedAt.format('YYYY-MM-DD');
  }

  if (values.birthDate && moment.isMoment(values.birthDate)) {
    values.birthDate = values.birthDate.format('YYYY-MM-DD');
  }

  if (values.contractWorkAt && moment.isMoment(values.contractWorkAt)) {
    values.contractWorkAt = values.contractWorkAt.format('YYYY-MM-DD');
  }

  if (values.contractExpiryAt && moment.isMoment(values.contractExpiryAt)) {
    values.contractExpiryAt = values.contractExpiryAt.format('YYYY-MM-DD');
  }

  if (values.buildAt && moment.isMoment(values.buildAt)) {
    values.buildAt = values.buildAt.format('YYYY-MM-DD');
  }

  if (values.assembleAt && moment.isMoment(values.assembleAt)) {
    values.assembleAt = values.assembleAt.format('YYYY-MM-DD');
  }

  return values;
};

export const formatOSSFilesToUploadFile = (files: IOSSMetaFile[]): UploadFile[] => {
  if (files && Array.isArray(files) && files.length > 0) {
    return files.map((file) => {
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
  if (Array.isArray(value)) {
    return value.map((file: UploadFile) => {
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
        meta.uploadAt = file.linkProps.uploadAt ? file.linkProps.uploadAt : '';
        meta.remark = file.linkProps.remark ? file.linkProps.remark : '';
      }
      return meta;
    });
  }

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
        meta.uploadAt = file.linkProps.uploadAt ? file.linkProps.uploadAt : '';
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


export const parseShipExtra = (value: IShip): IShip => {
  if (value.shipMachines && value.shipMachines.length > 0) {
    let mainHost = value.shipMachines.find((item) => item.shipMachineTypeId == 1013001);
    if (mainHost) {
      value.exHostPower = mainHost.power;
    }
  }

  return value;
};
