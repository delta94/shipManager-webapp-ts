import OSS from 'ali-oss';
import moment from 'moment';
import { getStsToken } from '@/services/global';
import env from '@/constants/env';
import { UploadFile } from 'antd/lib/upload/interface';

export enum OSSResourceType {
  CompanyCert = 'CompanyCert',
  ShipCert = 'ShipCert',
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

export function parseOSSFile(file: UploadFile[]) {
  if (file && file.length > 0) {
    return file.map(item => item.url).join(',');
  }
  return '';
}
