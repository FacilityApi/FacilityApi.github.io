var CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './src/entry.js',
  output: {
    filename: 'bundle.js',
    path: '.'
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
