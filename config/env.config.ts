const environment: EnvironmentConfigMap = {
  dev: {
    OSS_BUCKET_NAME: 'ship-manager',
    OSS_REGION: 'oss-cn-shenzhen',
    OSS_ASSET_URL: 'ship-manager.oss-cn-shenzhen.aliyuncs.com',
    BASE_API_URL: '',
  },

  preview: {
    OSS_BUCKET_NAME: 'ship-manager',
    OSS_REGION: 'oss-cn-shenzhen',
    OSS_ASSET_URL: 'ship-manager.oss-cn-shenzhen.aliyuncs.com',
    BASE_API_URL: '',
  },

  prod: {
    OSS_BUCKET_NAME: 'ship-manager',
    OSS_REGION: 'oss-cn-shenzhen',
    OSS_ASSET_URL: 'ship-manager.oss-cn-shenzhen.aliyuncs.com',
    BASE_API_URL: '',
  },
};

export default environment;
