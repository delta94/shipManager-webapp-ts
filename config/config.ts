import { IConfig, IPlugin } from 'umi-types';
import defaultSettings from './defaultSettings'; // https://umijs.org/config/

import slash from 'slash2';
import webpackPlugin from './plugin.config';
const { pwa, primaryColor } = defaultSettings; // preview.pro.ant.design only do not use in your production ;

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
        // default false
        enable: false,
        // default zh-CN
        default: 'zh-CN',
        // default true, when it is true, will use `navigator.language` overwrite default
        baseNavigator: true,
      },
      dynamicImport: {
        loadingComponent: './components/PageLoading/index',
        webpackChunkName: true,
        level: 3,
      },
      pwa: pwa
        ? {
            workboxPluginMode: 'InjectManifest',
            workboxOptions: {
              importWorkboxFrom: 'local',
            },
          }
        : false,
    },
  ],
  [
    'umi-plugin-pro-block',
    {
      moveMock: false,
      moveService: false,
      modifyRequest: true,
      autoAddMenu: true,
    },
  ],
];
export default {
  plugins,
  block: {
    defaultGitUrl: 'https://github.com/ant-design/pro-blocks',
  },
  hash: true,
  history: 'hash',
  publicPath:
    process.env.NODE_ENV === 'production'
      ? 'http://ship-manager-cdn.oss-cn-shenzhen.aliyuncs.com/'
      : '',
  targets: {
    ie: 11,
  },
  devtool: false,
  routes: [
    {
      path: '/user',
      component: '../layouts/UserLayout',
      routes: [
        {
          path: '/user',
          redirect: '/user/login',
        },
        {
          name: 'login',
          path: '/user/login',
          component: './user/login',
        },
      ],
    },
    {
      path: '/',
      component: '../layouts/BasicLayout',
      Routes: ['src/pages/Authorized'],
      routes: [
        {
          path: '/',
          redirect: '/dashboard',
        },
        {
          path: '/dashboard',
          name: '工作台',
          icon: 'dashboard',
          authority: ['ROLE_USER', 'ROLE_ADMIN'],
          component: './dashboard',
        },
        {
          path: '/company',
          name: '企业信息管理',
          icon: 'home',
          routes: [
            {
              name: '证照列表',
              path: '/company/listCert',
              authority: ['ROLE_USER', 'ROLE_ADMIN'],
              component: './company/listCert',
            },
            {
              name: '新增证照',
              path: '/company/addCert',
              authority: ['ROLE_USER', 'ROLE_ADMIN'],
              component: './company/addCert',
            },
            {
              name: '批文列表',
              path: '/company/listLicense',
              authority: ['ROLE_USER', 'ROLE_ADMIN'],
              component: './company/listLicense',
            },
            {
              name: '新增批文',
              path: '/company/addLicense',
              authority: ['ROLE_USER', 'ROLE_ADMIN'],
              component: './company/addLicense',
            },
          ],
        },
        {
          path: '/ship',
          name: '船舶管理',
          icon: 'book',
          routes: [
            {
              name: '船舶列表',
              path: '/ship/list',
              authority: ['ROLE_USER', 'ROLE_ADMIN'],
              component: './ship/list',
            },
            {
              name: '新建船舶',
              path: '/ship/create',
              authority: ['ROLE_USER', 'ROLE_ADMIN'],
              component: './ship/create',
            },
            {
              name: '船舶详情',
              path: '/ship/profile/:id',
              authority: ['ROLE_USER', 'ROLE_ADMIN'],
              component: './ship/profile',
              hideInMenu: true,
            },
            {
              name: '更新船舶',
              path: '/ship/update/:id',
              authority: ['ROLE_USER', 'ROLE_ADMIN'],
              component: './ship/update',
              hideInMenu: true,
            },
          ],
        },
        {
          path: '/document',
          name: '表单管理',
          icon: 'file-search',
          routes: [
            {
              path: '/',
              redirect: '/document/listPreset',
            },
            {
              path: '/document/listPreset',
              name: '固定表单',
              authority: ['ROLE_USER', 'ROLE_ADMIN'],
              component: './document/listPreset',
            },
            {
              path: '/document/listCustom',
              name: '自定义表单',
              authority: ['ROLE_USER', 'ROLE_ADMIN'],
              component: './document/listCustom',
            },
          ],
        },
        {
          path: '/person',
          name: '人员管理',
          icon: 'profile',
          routes: [
            {
              path: '/',
              redirect: '/person/sailor/list',
            }, // sailor
            {
              path: '/person/sailor/list',
              name: '船员管理',
              authority: ['ROLE_USER', 'ROLE_ADMIN'],
              component: './sailor/list',
            },
            {
              path: '/person/sailor/create',
              name: '新建船员',
              component: './sailor/create',
              authority: ['ROLE_USER', 'ROLE_ADMIN'],
            },
            {
              path: '/person/sailor/profile/:id',
              name: '船员详情',
              component: './sailor/profile',
              authority: ['ROLE_USER', 'ROLE_ADMIN'],
              hideInMenu: true,
            },
            {
              name: '更新船员',
              path: '/person/sailor/update/:id',
              component: './sailor/update',
              authority: ['ROLE_USER', 'ROLE_ADMIN'],
              hideInMenu: true,
            }, // manager
            {
              path: '/person/manager/list',
              name: '管理人员列表',
              component: './manager/list',
              authority: ['ROLE_USER', 'ROLE_ADMIN'],
            },
            {
              path: '/person/manager/profile/:id',
              name: '管理人员详情',
              hideInMenu: true,
              authority: ['ROLE_USER', 'ROLE_ADMIN'],
              component: './manager/profile',
            },
            {
              path: '/person/manager/create',
              name: '新增管理人员',
              component: './manager/create',
              authority: ['ROLE_USER', 'ROLE_ADMIN'],
            },
            {
              path: '/person/manager/update/:id',
              name: '更新管理人员',
              hideInMenu: true,
              authority: ['ROLE_USER', 'ROLE_ADMIN'],
              component: './manager/update',
            },
          ],
        },
        {
          path: '/setting',
          name: '设置',
          icon: 'setting',
          routes: [
            {
              path: '/',
              redirect: '/setting/personal',
            }, // sailor
            {
              path: '/setting/personal',
              name: '用户管理',
              authority: ['ROLE_USER', 'ROLE_ADMIN'],
              component: './setting/personal',
            },
            {
              path: '/setting/outline',
              name: '大纲管理',
              authority: ['ROLE_USER', 'ROLE_ADMIN'],
              component: './setting/outline',
            },
            {
              path: '/setting/system',
              name: '系统管理',
              authority: ['ROLE_USER', 'ROLE_ADMIN'],
              component: './setting/system',
            },
          ],
        },
        {
          name: '403',
          path: '/exception/403',
          component: './exception/403',
          hideInMenu: true,
        },
      ],
    },
    {
      component: './404',
    },
  ],
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    'primary-color': primaryColor,
  },
  define: {
    ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION: '',
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
  proxy: {
    '/api/': {
      target: 'http://127.0.0.1:8080/',
      changeOrigin: true,
    },
  },
} as IConfig;
