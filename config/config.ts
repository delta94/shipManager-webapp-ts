import { defineConfig } from 'umi';
import routes from './routes.config';

export default defineConfig({
  hash: true,
  history: {
    type: 'browser',
  },
  antd: {},
  devtool: false,
  dva: {
    hmr: true,
  },
  request: {
    dataField: '',
  },
  dynamicImport: {
    loading: '@/components/PageLoading/index',
  },
  targets: {
    ie: 11,
  },
  routes: routes,
  title: false,
  ignoreMomentLocale: true,
  manifest: {
    basePath: '/',
  },
});
