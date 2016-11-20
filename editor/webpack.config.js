var CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: [
    'whatwg-fetch',
    './src/entry.ts'
  ],
  output: {
    filename: 'bundle.js'
  },
  devtool: "source-map",
  resolve: {
    extensions: ['', '.webpack.js', '.web.js', '.ts', '.js']
  },
  module: {
    loaders: [
      { test: /\.ts$/, loader: 'ts-loader' }
    ],
    preLoaders: [
      { test: /\.js$/, loader: "source-map-loader" }
    ]
  },
  plugins: [
    new CopyWebpackPlugin([
      {
        from: 'node_modules/monaco-editor/min/vs',
        to: 'vs'
      }
    ])
  ]
}
