// webpack.config.js
const path = require('path');
const webpack = require('webpack');

module.exports = ['widgetUI.js', 'widgetUI.min.js'].map(filename => ({
  mode: filename.includes('.min.') ? 'production' : 'development',
  entry: './src/WidgetUI.tsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: filename,
    library: 'WidgetUI',
    libraryTarget: 'umd',
    libraryExport: 'default',
    globalObject: 'this',
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
  plugins: [
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1,
    }),
  ],
  optimization: {
    minimize: filename.includes('.min.')
  }
}));
