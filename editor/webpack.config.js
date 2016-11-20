var CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: [
    'whatwg-fetch',
    './src/entry.ts'
  ],
  output: {
    filename: 'bundle.js'
  },
  resolve: {
    extensions: ['', '.webpack.js', '.web.js', '.ts', '.js']
  },
  module: {
    loaders: [
      { test: /\.ts$/, loader: 'ts-loader' }
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
