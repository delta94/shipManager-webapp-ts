import { defineConfig } from 'umi';

import routes from './routes.config';
import proxy from './proxy.config';
import environment from './env.config';
import webConfig from './web.config';

const { REACT_APP_ENV } = process.env;

export default defineConfig({
  hash: true,
  history: {
    type: 'browser',
  },
  antd: {},
  dva: {
    hmr: true,
  },
  request: {
    dataField: '',
  },
  locale: false,
  dynamicImport: {
    loading: '@/components/PageLoading/index',
  },
  targets: {
    ie: 11,
  },
  routes: routes,
  define: {
    ...environment[REACT_APP_ENV || 'dev'],
  },
  title: false,
  ignoreMomentLocale: true,
  proxy: proxy[REACT_APP_ENV || 'dev'],
  manifest: {
    basePath: '/',
  },
  publicPath: webConfig[REACT_APP_ENV || 'dev'].PUBLIC_PATH,
});
