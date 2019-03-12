module.exports = function(api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo", "mobx"],
    env: {
      production: {
        plugins: ["react-native-paper/babel"]
      }
    }
  };
};
