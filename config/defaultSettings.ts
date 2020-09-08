import { Settings as ProSettings } from '@ant-design/pro-layout';

export type DefaultSettings = ProSettings & {
  pwa: boolean;
};

const proSettings: DefaultSettings = {
  navTheme: 'dark',
  primaryColor: '#1890ff',
  layout: 'side',
  contentWidth: 'Fluid',
  fixedHeader: true,
  fixSiderbar: true,
  colorWeak: false,
  menu: {
    locale: false,
  },
  title: '船务管理系统',
  pwa: false,
  iconfontUrl: '',
};

export default proSettings;
