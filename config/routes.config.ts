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
