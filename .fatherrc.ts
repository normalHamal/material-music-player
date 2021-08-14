const isOnlyBuildWithESM = process.env.BUILD_MODE === 'esm';

const baseConfig = {
  entry: 'src/index.ts',
  disableTypeCheck: false,
  runtimeHelpers: true,
};

const cjsConfig = {
  cjs: 'babel',
  extraBabelPlugins: [
    [
      'babel-plugin-import',
      {
        libraryName: '@material-ui/core',
        // 此处不设置为esm是因为cjs模式不支持ES modules
        libraryDirectory: '',
        camel2DashComponentName: false,
      },
      'core',
    ],
  ],
};

const esmConfig = {
  esm: {
    type: 'babel',
    importLibToEs: true,
  },
  extraBabelPlugins: [
    [
      'babel-plugin-import',
      {
        libraryName: '@material-ui/core',
        libraryDirectory: 'esm',
        camel2DashComponentName: false,
      },
      'core',
    ],
  ],
};

export default {
  ...baseConfig,
  ...(isOnlyBuildWithESM ? esmConfig : cjsConfig),
};
