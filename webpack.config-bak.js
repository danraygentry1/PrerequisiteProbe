const { resolve } = require('path');
const webpack = require('webpack');
const path = require('path');
const CompressionPlugin = require('compression-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const cssOutputLocation = process.env.NODE_ENV === 'production'
  ? 'public/stylesheets/style-prod.css'
  : 'stylesheets/style.css';

const jsProdOutput = {
  filename: 'public/javascripts/build-prod.js',
  path: resolve(__dirname),
  publicPath: '/',
};

/* sourceMapFilename: 'javascripts/build.js.map', */
const jsDevOutput = {
  filename: 'javascripts/build.js',
  path: '/',
  publicPath: '/',
};

const jsOutputLocation = process.env.NODE_ENV === 'production' ? jsProdOutput : jsDevOutput;


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
  // default optimization.minimize for production mode is "true"
  optimization: {
    minimize: true,
  },
  // context: resolve(__dirname, 'src', 'app'),
  // entry: [
  //   './index.jsx',
  // ],
  entry: path.resolve(__dirname, 'src', 'app'), // index.jsx has special designation, always looked for
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/',
    sourceMapFilename: '[name].js.map',
  },

  resolve: {
    extensions: ['.js', '.jsx', '.tsx', '.ts'],
  },

  devtool: 'source-map',
  // devtool: 'false',
  // call a couple of plugins webpack needs to hot module replacement,
  // which is technical term for updating your react bundle without having to
  // rebuild the entire thing each time
  // new webpack.NoEmitOnErrorsPlugin()
  // ExtractTextPlugin gets server from public path "/" + stylesheets/style.css
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

if (process.env.NODE_ENV !== 'production') {
  // array.unshift sticks stuff at the beginning of an array
  // as opposed to array.push, which puts stuff at the end
  module.exports.entry.unshift(
    'react-hot-loader/patch',
    'react-hot-loader/babel',
    'webpack-hot-middleware/client',
  );
  module.exports.plugins.unshift(new webpack.HotModuleReplacementPlugin());
}
