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
            ],
          },

          {
            component: './404',
          },
        ],
      },
      {
        component: './404',
      },
    ],
  },
];
