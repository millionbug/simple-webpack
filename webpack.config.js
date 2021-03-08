const resolve = dir => require('path').join(__dirname, dir);
// babel-loader 无法脱离 webpack 使用，所以导出babel-core的方法
const babelLoader = require('./webpack/babelLoader.js');

module.exports = {
    // 入口文件
    entry: './app/index.js',
    output: {
        path: resolve('dist'),
        fileName: 'bundle.js'
    },
    module: {
        rules: [{
            test: /\.(js|jsx)$/,
            include: [resolve('app')],
            use: [{
                loader: babelLoader
            }]
        }]
    },
    plugins: [
        // new HtmlWebpackPlugin()
    ]
}