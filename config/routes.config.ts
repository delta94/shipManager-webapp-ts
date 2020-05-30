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
            name: '更新证照',
            path: '/company/updateCert/:id',
            authority: ['ROLE_USER', 'ROLE_ADMIN'],
            hideInMenu: true,
            component: './company/updateCert',
          },
          {
            name: '证照详情',
            path: '/company/infoCert/:id',
            authority: ['ROLE_USER', 'ROLE_ADMIN'],
            hideInMenu: true,
            component: './company/infoCert',
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
          {
            name: '批文详情',
            path: '/company/infoLicense/:id',
            authority: ['ROLE_USER', 'ROLE_ADMIN'],
            hideInMenu: true,
            component: './company/infoLicense',
          },
          {
            name: '更新批文',
            path: '/company/updateLicense/:id',
            hideInMenu: true,
            authority: ['ROLE_USER', 'ROLE_ADMIN'],
            component: './company/updateLicense',
          },
        ],
      },
      // {
      //   path: '/ship',
      //   name: '船舶管理',
      //   icon: 'book',
      //   routes: [
      //     {
      //       name: '船舶列表',
      //       path: '/ship/list',
      //       authority: ['ROLE_USER', 'ROLE_ADMIN'],
      //       component: './ship/list',
      //     },
      //     {
      //       name: '新建船舶',
      //       path: '/ship/create',
      //       authority: ['ROLE_USER', 'ROLE_ADMIN'],
      //       component: './ship/create',
      //     },
      //     {
      //       name: '船舶详情',
      //       path: '/ship/profile/:id',
      //       authority: ['ROLE_USER', 'ROLE_ADMIN'],
      //       component: './ship/profile',
      //       hideInMenu: true,
      //     },
      //     {
      //       name: '更新船舶',
      //       path: '/ship/update/:id',
      //       authority: ['ROLE_USER', 'ROLE_ADMIN'],
      //       component: './ship/update',
      //       hideInMenu: true,
      //     },
      //   ],
      // },
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
          // {
          //   path: '/document/template/generate/:id',
          //   name: '自定义表单生成',
          //   hideInMenu: true,
          //   authority: ['ROLE_USER', 'ROLE_ADMIN'],
          //   component: './document/template/generate',
          // },
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
          },
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
