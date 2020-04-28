// import path from 'path';
const webpack = require('webpack');
const path = require('path');
// const NodemonPlugin = require('nodemon-webpack-plugin'); // Ding
const proxy = require('http-proxy-middleware');

/* const onProxyRes = function(proxyRes, req, res) {
    // add new header to response
    proxyRes.headers['x-added'] = 'foobar';

    // remove header from response
    delete proxyRes.headers['x-removed'];
}; */

// export default {
module.exports = {
  target: 'web',
  mode: 'development',

  entry: path.resolve(__dirname, 'src', 'app'), // index.jsx has special designation, always looked for
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/',
    sourceMapFilename: '[name].js.map',
    // crossOriginLoading: 'anonymous',

    // devtoolModuleFilenameTemplate: '[absolute-resource-path]'
    devtoolModuleFilenameTemplate: (info) => `${info.resourcePath}`,

  },
  resolve: {
    extensions: ['.js', '.jsx', '.tsx', '.ts'],
  },
  devServer: {
    historyApiFallback: true, // needed for react router in later module
    port: 8080,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': '*',
      'Access-Control-Allow-Methods': '*',
    },
    proxy: {
      // target: "http://localhost:9229/",
      '/dashboard': {
        target: 'http://localhost:9229/',
        // changeOrigin: true,
        // secure:false,
        // pathRewrite: {'^/api': '/'}
      },
    },
  },
  devtool: 'source-map',
  // devtool: 'false',
  plugins: [
    // new webpack.SourceMapDevToolPlugin({
    // filename:'[name].js.map',
    // sourceRoot: '/',
    // noSources: true,

    // devtoolModuleFilenameTemplate: info => {
    // return `webpack:///${info.resourcePath}?${info.loaders}`;
    // 'webpack://[namespace]/
    // devtoolModuleFilenameTemplate: '[absolute-resource-path]',
    // fallbackModuleFilenameTemplate: '[absolute-resource-path]',
    // }),
    // new NodemonPlugin(),
  ],
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        // : /(node_modules)/,
        loader: 'babel-loader',
      },
      // TS
      {
        test: /\.ts(x?)$/,
        loader: 'ts-loader',
        // exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader' },
        ],
      },
      {
        test: /\.(less)$/,
        use: [{
          loader: 'style-loader', // creates style nodes from JS strings
        }, {
          loader: 'css-loader', // translates CSS into CommonJS
        }, {
          loader: 'less-loader', // compiles Less to CSS
        }],
      },
    ],
  },
};
