// import path from 'path';
const webpack = require('webpack');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const { resolve } = require('path');

const cssOutputLocation = process.env.NODE_ENV === 'production'
  ? 'style.css'
  : 'style.css';
// export default {
module.exports = {
  target: 'web',
  mode: 'production',

  /* entry: path.resolve(__dirname, 'src', 'app'), // index.jsx has special designation, always looked for */
  context: resolve(__dirname, 'src', 'app'),
  entry: [
    './index.jsx',
  ],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/',
    // crossOriginLoading: 'anonymous',


  },
  resolve: {
    extensions: ['.js', '.jsx', '.tsx', '.ts'],
  },
  plugins: [
    new webpack.NamedModulesPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new MiniCssExtractPlugin({
      filename: cssOutputLocation,
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    }),
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
          {
            loader: MiniCssExtractPlugin.loader,
          },
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
if (process.env.NODE_ENV === 'production') {
  /*  module.exports.plugins.push(new UglifyJsPlugin({
      compress: {
        warnings: false,
        screw_ie8: true,
        conditionals: true,
        //
        unused: true,
        comparisons: true,
        sequences: true,
        dead_code: true,
        evaluate: true,
        if_return: true,
        join_vars: true,
      },
      output: {
        comments: false,
      },
    })); */
  module.exports.plugins.push(new webpack.HashedModuleIdsPlugin());
  // Enables scope hoisting: gives preference to imports while using javascript, which as speed up diplay times
  module.exports.plugins.push(new webpack.optimize.ModuleConcatenationPlugin());
  // tells webpack that we are always in production mode, which
  // will cause it to eliminate a few extra thing it would otherwise output
  module.exports.plugins.push(
    new webpack.DefinePlugin(
      { 'process.env.NODE_ENV': JSON.stringify('development') },
    ),
  );
  module.exports.plugins.push(
    new CompressionPlugin({
      filename: '[path].gz[query]',
      algorithm: 'gzip',
      test: /\.js$|\.css$|\.html$|\.eot?.+$|\.ttf?.+$|\.woff?.+$|\.svg?.+$/,
      threshold: 10240,
      minRatio: 0.8,
    }),
  );
}
