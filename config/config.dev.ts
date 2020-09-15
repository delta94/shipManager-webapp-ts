import { defineConfig } from 'umi';

export default defineConfig({
  proxy: {
    '/api/': {
      target: 'http://127.0.0.1:8080/',
      changeOrigin: true,
    },
  },

  define: {
    OSS_BUCKET_NAME: 'ship-manager',
    OSS_REGION: 'oss-cn-shenzhen',
    OSS_ASSET_URL: 'ship-manager.oss-cn-shenzhen.aliyuncs.com',
    BASE_API_URL: '',
  },
});
