// webpack.config.js
// const path = require('path');
// const webpack = require('webpack');
import path from 'node:path';
import webpack from 'webpack';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isProd = process.env.NODE_ENV === 'production';

// module.exports = ['widgetUI.js', 'widgetUI.min.js'].map(filename => ({
const config = ['widgetUI.js', 'widgetUI.min.js'].map(filename => ({
  mode: filename.includes('.min.') ? 'production' : 'development',
  entry: './src/WidgetUI.tsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: filename,
    library: 'WidgetUI',
    libraryTarget: 'umd',
    libraryExport: 'default',
    globalObject: 'this',
    // publicPath: '/',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    // mainFields: ["require", "module", "main", "browser"],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        // use: 'ts-loader',
        // use: ["babel-loader"],
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                '@babel/preset-env',
                '@babel/preset-react',
                '@emotion/babel-preset-css-prop',
                '@babel/preset-typescript', // add this preset
              ],
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      }
    ]
  },
  externals: {
    react: 'React',
    'react-dom': 'ReactDOM',
    '@emotion/react': 'EmotionReact',
    '@emotion/cache': 'EmotionCache',
  },
  ...(!filename.endsWith('.min.js') && {
    devServer: {
      static: {
        directory: path.join(__dirname, '.'),
      },
      compress: false,
      port: 8081,
      hot: true,
      watchFiles: ['src/**/*'],
      devMiddleware: {
        writeToDisk: true,
      },
      client: {
        overlay: {
          errors: true,
          warnings: false,
        },
      },
    },
  }),
  plugins: [
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1,
    }),
  ],
  optimization: {
    minimize: isProd ?  true : filename.includes('.min.')
  }
}));


export default config;
