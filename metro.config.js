const { getDefaultConfig } = require('expo/metro-config');

// Get the default Metro configuration for Expo projects
const config = getDefaultConfig(__dirname);

// You can customize the configuration here if needed.
// For example, to add support for SVG files:
// config.resolver.assetExts.push('svg');
// config.transformer.babelTransformerPath = require.resolve('react-native-svg-transformer');

module.exports = config;
