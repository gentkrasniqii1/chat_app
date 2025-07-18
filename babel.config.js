module.exports = function(api) {
  api.cache(true); // Cache the Babel configuration for faster builds
  return {
    presets: ['babel-preset-expo'], // Use Expo's default Babel preset
    // You can add plugins here if needed, e.g., for reanimated or other libraries
    // plugins: [
    //   'react-native-reanimated/plugin', // Example for React Native Reanimated
    // ],
  };
};
