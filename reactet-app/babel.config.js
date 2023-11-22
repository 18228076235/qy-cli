module.exports = {
  presets: ['react-app'],
  plugins: ['@babel/plugin-proposal-optional-chaining'],
  env: {
    test: {
      plugins: ['@babel/plugin-transform-modules-commonjs']
    }
  }
};
