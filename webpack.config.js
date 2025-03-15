const webpack = require('webpack');
console.log("Custom webpack config loaded");

module.exports = {
  resolve: {
    fallback: {
      "path": require.resolve("path-browserify"),
      "worker_threads": false,
    },
  },
  plugins: [
    new webpack.IgnorePlugin({
      resourceRegExp: /closewords/,
    }),
    new webpack.ProvidePlugin({
        process: 'process/browser',  // Provide process for older code that uses it
      }),
  ],
};
