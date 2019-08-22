import OSS from 'ali-oss';
import moment from 'moment';
import { getStsToken } from '@/services/global';

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
          region: 'oss-cn-shenzhen',
          accessKeyId: data.accessKeyId,
          accessKeySecret: data.accessKeySecret,
          stsToken: data.securityToken,
          bucket: 'ship-manager',
        },
        data.expiration,
      );
    }
    throw new Error('STS token get error');
  }
}

export function generateOSSKey(file: File) {
  const fileType = file.name.split('.').pop();
  const fileName = file.name.split('.').unshift();
  const uuid = Math.random()
    .toString(36)
    .substring(2);
  return `${moment().format('YYYYMMDD')}/${fileName}_${uuid}.${fileType}`;
}

export function resolveOSSPath(bucket: string, key: string) {
  return `http://${bucket}.oss-cn-shenzhen.aliyuncs.com/${key}`;
}
