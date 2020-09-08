import { defineConfig } from 'umi';

import routes from './routes.config';
import proxy from './proxy.config';
import environment from './env.config';

const { REACT_APP_ENV } = process.env;

export default defineConfig({
  hash: false,
  history: {
    type: "browser",
  },
  antd: {},
  dva: {
    hmr: true,
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
});
