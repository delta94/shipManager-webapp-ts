import { IRoute } from 'umi-types';

export default [
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      {
        path: '/user',
        redirect: '/user/login',
      },
      {
        name: '用户登录',
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
          // {
          //   name: '船舶详情',
          //   path: '/ship/profile/:id',
          //   authority: ['ROLE_USER', 'ROLE_ADMIN'],
          //   component: './ship/profile',
          //   hideInMenu: true,
          // },
          // {
          //   name: '更新船舶',
          //   path: '/ship/update/:id',
          //   authority: ['ROLE_USER', 'ROLE_ADMIN'],
          //   component: './ship/update',
          //   hideInMenu: true,
          // },
        ],
      },
      {
        path: '/document',
        name: '表单管理',
        icon: 'profile',
        routes: [
          {
            path: '/',
            redirect: '/document/common/list',
          },
          {
            path: '/document/common/list',
            name: '固定表单',
            authority: ['ROLE_USER', 'ROLE_ADMIN'],
            component: './document/listCommon',
          },
          {
            path: '/document/template/list',
            name: '自定义表单',
            authority: ['ROLE_USER', 'ROLE_ADMIN'],
            component: './document/listTemplate',
          },
          {
            path: '/document/profile/:id',
            name: '表单详情',
            hideInMenu: true,
            authority: ['ROLE_USER', 'ROLE_ADMIN'],
            component: './document/profile',
          },
          {
            path: '/document/create/:type',
            name: '表单详情',
            hideInMenu: true,
            authority: ['ROLE_USER', 'ROLE_ADMIN'],
            component: './document/create',
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
            redirect: '/person/manager/list',
          },

          {
            path: '/person/manager/list',
            name: '管理人员',
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
          //
          // {
          //   path: '/person/sailor/list',
          //   name: '船员管理',
          //   authority: ['ROLE_USER', 'ROLE_ADMIN'],
          //   component: './sailor/list',
          // },
          // {
          //   path: '/person/sailor/create',
          //   name: '新建船员',
          //   component: './sailor/create',
          //   authority: ['ROLE_USER', 'ROLE_ADMIN'],
          // },
          // {
          //   path: '/person/sailor/profile/:id',
          //   name: '船员详情',
          //   component: './sailor/profile',
          //   authority: ['ROLE_USER', 'ROLE_ADMIN'],
          //   hideInMenu: true,
          // },
          // {
          //   name: '更新船员',
          //   path: '/person/sailor/update/:id',
          //   component: './sailor/update',
          //   authority: ['ROLE_USER', 'ROLE_ADMIN'],
          //   hideInMenu: true,
          // },
          // {
          //   path: '/person/manager/create',
          //   name: '新增管理人员',
          //   component: './manager/create',
          //   authority: ['ROLE_USER', 'ROLE_ADMIN'],
          // },
          // {
          //   path: '/person/manager/update/:id',
          //   name: '更新管理人员',
          //   hideInMenu: true,
          //   authority: ['ROLE_USER', 'ROLE_ADMIN'],
          //   component: './manager/update',
          // },
        ],
      },
      {
        path: '/company',
        name: '公司信息管理',
        icon: 'home',
        routes: [
          {
            name: '基础信息',
            path: '/company/infoCompany',
            authority: ['ROLE_USER', 'ROLE_ADMIN'],
            component: './company/infoCompany',
          }
        ],
      },
      // {
      //   path: '/setting',
      //   name: '设置',
      //   icon: 'setting',
      //   routes: [
      //     {
      //       path: '/',
      //       redirect: '/setting/personal',
      //     }, // sailor
      //     {
      //       path: '/setting/personal',
      //       name: '用户管理',
      //       authority: ['ROLE_USER', 'ROLE_ADMIN'],
      //       component: './setting/personal',
      //     },
      //     {
      //       path: '/setting/outline',
      //       name: '大纲管理',
      //       authority: ['ROLE_USER', 'ROLE_ADMIN'],
      //       component: './setting/outline',
      //     },
      //     {
      //       path: '/setting/system',
      //       name: '系统管理',
      //       authority: ['ROLE_USER', 'ROLE_ADMIN'],
      //       component: './setting/system',
      //     },
      //   ],
      // },
      // {
      //   name: '403',
      //   path: '/exception/403',
      //   component: './exception/403',
      //   hideInMenu: true,
      // },
    ],
  },
  {
    component: './404',
  },
] as IRoute[];
