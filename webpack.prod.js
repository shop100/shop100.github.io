const merge = require('webpack-merge');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const common = require('./webpack.common.js');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = merge(common, {
    plugins: [
        new UglifyJSPlugin(),
        new HtmlWebpackPlugin({
            title: 'Shop100.vn',
            hash: true,
            template: 'src/index.html',
            filename: '../index.html'
        })
    ]
});
