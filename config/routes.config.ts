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
];
