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
            path: '/company',
            name: '公司信息管理',
            icon: 'home',
            routes: [
              {
                name: '基础信息',
                path: '/company/infoCompany',
                component: './company/infoCompany',
              }
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
