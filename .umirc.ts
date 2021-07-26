import { defineConfig } from 'dumi';

export default defineConfig({
  title: 'material-music-player',
  favicon:
    'https://user-images.githubusercontent.com/9554297/83762004-a0761b00-a6a9-11ea-83b4-9c8ff721d4b8.png',
  logo: 'https://user-images.githubusercontent.com/9554297/83762004-a0761b00-a6a9-11ea-83b4-9c8ff721d4b8.png',
  outputPath: 'docs-dist',
  mode: 'site',
  base:
    process.env.NODE_ENV === 'production' && process.env.isVercel !== 'true'
      ? '/material-music-player/'
      : '/',
  publicPath:
    process.env.NODE_ENV === 'production' && process.env.isVercel !== 'true'
      ? '/material-music-player/'
      : '/',
  themeConfig: {
    hd: {
      // 禁用高清方案
      rules: [],
    },
  },
  navs: [
    null, // null 值代表保留约定式生成的导航，只做增量配置
    {
      title: 'GitHub',
      path: 'https://github.com/normalHamal/material-music-player',
    },
  ],
  // more config: https://d.umijs.org/config
});
