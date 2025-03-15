const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");

module.exports = {
  resolve: {
    fallback: {
      "worker_threads": false,
      "path": require.resolve("path-browserify")
    }
  },
  plugins: [new NodePolyfillPlugin()]
};
