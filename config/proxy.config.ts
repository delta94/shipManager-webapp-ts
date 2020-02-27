export default {
  dev: {
    '/api/': {
      target: 'http://127.0.0.1:8080/',
      changeOrigin: true,
    },
  },
  preview: {
    '/api/': {
      target: 'http://127.0.0.1:8080/',
      changeOrigin: true,
    },
  },
  prod: {
    '/api/': {
      target: 'http://127.0.0.1:8080/',
      changeOrigin: true,
    },
  },
} as ProxyConfigMap;
