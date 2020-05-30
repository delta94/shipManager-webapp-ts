import { IConfig, IPlugin } from 'umi-types';
import slash from 'slash2';
import webpackPlugin from './plugin.config';
import routes from './routes.config';
import proxy from './proxy.config';
import environment from './env.config';

const APP_ENV = (process.env.APP_ENV || 'dev') as EnvironmentType;
const isProd = process.env.NODE_ENV === 'production';

const plugins: IPlugin[] = [
  [
    'umi-plugin-react',
    {
      antd: true,
      dva: {
        hmr: true,
        immer: true,
      },
      locale: {
        enable: false,
        default: 'zh-CN',
        baseNavigator: true,
      },
      dynamicImport: {
        loadingComponent: './components/PageLoading/index',
        webpackChunkName: true,
        level: 3,
      },
      pwa: false,
    },
  ],
];
export default {
  plugins,
  hash: true,
  history: 'hash',
  publicPath: isProd ? 'https://ship-manager-cdn.oss-cn-shenzhen.aliyuncs.com/' : '',
  targets: {
    ie: 11,
  },
  devtool: false,
  routes: routes,
  define: {
    ...environment[APP_ENV],
  },
  ignoreMomentLocale: true,
  lessLoaderOptions: {
    javascriptEnabled: true,
  },
  disableRedirectHoist: true,
  cssLoaderOptions: {
    modules: true,
    getLocalIdent: (
      context: {
        resourcePath: string;
      },
      _: string,
      localName: string,
    ) => {
      if (
        context.resourcePath.includes('node_modules') ||
        context.resourcePath.includes('ant.design.pro.less') ||
        context.resourcePath.includes('global.less')
      ) {
        return localName;
      }

      const match = context.resourcePath.match(/src(.*)/);

      if (match && match[1]) {
        const antdProPath = match[1].replace('.less', '');
        const arr = slash(antdProPath)
          .split('/')
          .map((a: string) => a.replace(/([A-Z])/g, '-$1'))
          .map((a: string) => a.toLowerCase());
        return `antd-pro${arr.join('-')}-${localName}`.replace(/--/g, '-');
      }

      return localName;
    },
  },
  manifest: {
    basePath: '/',
  },
  chainWebpack: webpackPlugin,
  proxy: proxy[APP_ENV],
} as IConfig;
