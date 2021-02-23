/**
 * 配置loaders
 */
'use strict';

const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const config = require('./../config.js');
//env
const env = require('./env');
//工作空间
const __include__dirname = path.resolve(__dirname, config.src);
if (!__include__dirname) {
    throw '请在config.js中指定src目录';
}
const babelLoader = {
    test: /\.(js|jsx)$/,
    use: {
        loader: 'babel-loader',
        options: {
            presets: [
                ['@babel/preset-env', {
                    targets: "defaults"
                }]
            ],
            plugins: [
                //支持装饰器语法
                ["@babel/plugin-proposal-decorators", {
                    "legacy": true
                }]
            ]
        }
    }
};
const cssLoader = {
    test: /\.css$/,
    use: [
        MiniCssExtractPlugin.loader,
        {
            loader: 'style-loader'
        },
        {
            loader: 'css-loader'
        }
    ],
    include: __include__dirname,
    exclude: /node_modules/
};
const lessLoader = {
    test: /\.less$/,
    use: [
        MiniCssExtractPlugin.loader,
        {
            loader: 'css-loader'
        },
        {
            loader: 'less-loader', // compiles Less to CSS
            options: {
                lessOptions: {
                    javascriptEnabled: true
                }
            }
        }
    ]
};
const scssLoader = {
    test: /\.scss$/,
    use: [
        MiniCssExtractPlugin.loader,
        {
            loader: 'css-loader'
        },
        {
            loader: 'sass-loader'
        }
    ]
};
const sassLoader = {
    test: /\.scss$/,
    use: [
        MiniCssExtractPlugin.loader,
        {
            loader: 'css-loader'
        },
        {
            loader: 'sass-loader'
        }
    ],
    include: __include__dirname,
    exclude: /node_modules/
};
const imgLoader = {
    test: /\.(png|jpg|jpeg|gif)$/,
    use: [{
        loader: 'url-loader',
        options: {
            // limit: 128,
            limit: 8 * 1024,
            // 关闭es6
            esModule: false,
            name: env.dev ? 'static/img/[name]_[hash:8].[ext]' : env.prod && '/static/img/[name]_[hash:8].[ext]'
        }
    }],
    include: __include__dirname,
    exclude: /node_modules/
};
const fileLoader = {
    test: /\.(eot|svg|ttf|otf|woff|woff2|mp3|mp4|glb)/,
    use: [{
        loader: 'file-loader',
        options: {
            limit: 128,
            name: env.dev ? 'static/fonts/[name]_[hash:8].[ext]' : env.prod && '/static/fonts/[name]_[hash:8].[ext]'
        }
    }],
    include: __include__dirname,
    exclude: /node_modules/
};
module.exports = [
    babelLoader, cssLoader, lessLoader, scssLoader, sassLoader, imgLoader, fileLoader
];