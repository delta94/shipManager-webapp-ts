import OSS from 'ali-oss';
import moment from 'moment';
import { getStsToken } from '@/services/globalService';
import env from '@/constants/env';
import { UploadFile } from 'antd/lib/upload/interface';

export enum OSSResourceType {
  CompanyCert = 'CompanyCert',
  CompanyLicense = 'CompanyLicense',
  CompanySheet = 'CompanySheet',
  ShipCert = 'ShipCert',
  SailorCert = 'SailorCert',
  ManagerCert = 'MangerCert'
}

export default class OssClient extends OSS {
  private static instance: OssClient;

  private expiration: Date;

  constructor(options: OSS.Options, expiration: string) {
    super(options);
    this.expiration = new Date(expiration);
  }

  public checkStsTokenExpired(): boolean {
    return new Date() > this.expiration;
  }

  public static async getInstance(): Promise<OssClient> {
    if (!OssClient.instance) {
      OssClient.instance = await OssClient.createInstance();
    }
    return OssClient.instance;
  }

  public static async createInstance(): Promise<OssClient> {
    const data = await getStsToken();
    if (data) {
      return new OssClient(
        {
          region: env.OSS_REGION,
          bucket: env.OSS_BUCKET_NAME,
          accessKeyId: data.accessKeyId,
          accessKeySecret: data.accessKeySecret,
          stsToken: data.securityToken,
        },
        data.expiration,
      );
    }
    throw new Error('STS token get error');
  }

  resolveOSSPath(key: string): string {
    return this.signatureUrl(key);
  }
}

export function generateOSSKey(file: File, type: OSSResourceType) {
  const fileType = file.name.split('.').pop();
  const fileName = file.name.split('.').unshift();
  const uuid = Math.random()
    .toString(36)
    .substring(2);
  return `${type}/${moment().format('YYYY_MM_DD')}/${fileName}_${uuid}.${fileType}`;
}

export function generateOSSFullPath(ossKey: string): string {
  return `http://${env.OSS_ASSET_URL}/${ossKey}`
}

export function parseOSSFile(files: UploadFile[]) {
  if (files && files.length > 0) {
    let values = files.map((file, idx) => {
      return {
        uid: idx,
        url: file.url,
        size: file.size,
        name: file.name,
        type: file.type,
      };
    });
    return JSON.stringify(values);
  }
  return '';
}

export function parseUploadData(str: string, client?: OssClient): UploadFile[] {
  if (str === '') return [];
  try {
    let data = JSON.parse(str) as UploadFile[];
    if (client) {
      data.forEach(item => {
        item.thumbUrl = client.signatureUrl(item.url!);
      });
    }
    return data;
  } catch (e) {
    return [];
  }
}
