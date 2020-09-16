export default [
  {
    path: '/user',
    routes: [
      {
        path: '/user',
        component: '../layouts/UserLayout',
        routes: [
          {
            name: 'login',
            path: '/user/login',
            component: './user/login',
          },
        ],
      },
    ],
  },

  {
    path: '/',
    component: '../layouts/SecurityLayout',
    routes: [
      {
        path: '/',
        component: '../layouts/BasicLayout',
        authority: ['ROLE_USER', 'ROLE_ADMIN'],
        routes: [
          {
            path: '/',
            redirect: '/dashboard',
          },
          {
            path: '/dashboard',
            name: '工作台',
            icon: 'dashboard',
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
                component: './ship/list',
              },
              {
                name: '船舶详情',
                path: '/ship/profile/:id',
                component: './ship/profile',
                hideInMenu: true,
              },
              {
                name: '新建船舶',
                path: '/ship/create',
                component: './ship/create',
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
              },
              {
                path: '/person/manager/profile/:id',
                name: '管理人员详情',
                hideInMenu: true,
                component: './manager/profile',
              },
              {
                path: '/person/sailor/list',
                name: '船员管理',
                component: './sailor/list',
              },
              {
                path: '/person/sailor/profile/:id',
                name: '船员详情',
                component: './sailor/profile',
                hideInMenu: true,
              },
            ],
          },

          {
            path: '/company',
            name: '公司信息管理',
            icon: 'home',
            routes: [
              {
                name: '基础信息',
                path: '/company/info',
                component: './company/infoCompany',
              },
              {
                name: '证书信息',
                path: '/company/certificate/:id',
                component: './company/infoCertificate',
                hideInMenu: true,
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
              },
              {
                path: '/setting/personal',
                name: '用户管理',
                component: './setting/personal',
              },
            ],
          },

          {
            component: './404',
          },
        ],
      },
    ],
  },

  {
    component: './404',
  },
];
