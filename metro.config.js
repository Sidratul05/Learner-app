//const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

/*
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * //@type {import('@react-native/metro-config').MetroConfig}
 */
//const config = {};

//module.exports = mergeConfig(getDefaultConfig(__dirname), config);
// metro.config.js

const { getDefaultConfig } = require('@react-native/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

module.exports = {
  ...defaultConfig,
  transformer: {
    ...defaultConfig.transformer,
    babelTransformerPath: require.resolve('react-native-svg-transformer'),
  },
  resolver: {
    assetExts: defaultConfig.resolver.assetExts.filter(ext => ext !== 'svg'),
    sourceExts: [...defaultConfig.resolver.sourceExts, 'svg'],
  },
};
