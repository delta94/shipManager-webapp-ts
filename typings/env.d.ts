type EnvironmentType = 'dev' | 'prod';

declare const REACT_APP_ENV: EnvironmentType | boolean;

interface EnvironmentConfig {
  OSS_BUCKET_NAME: string;
  OSS_REGION: string;
  BASE_API_URL: string;
  OSS_ASSET_URL: string;
}

interface ProxyConfig {
  '/api/': object;
}

type EnvironmentConfigMap = Record<EnvironmentType, EnvironmentConfig>;

type ProxyConfigMap = Record<EnvironmentType, ProxyConfig>;
