const path = require('path');
const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
    mode: 'production',
    entry: {
        'vue-mount': './src/index.js'
    },
    externals: {
        'vue': 'Vue'
    },
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: '[name].min.js',
        libraryTarget: 'umd',
        library: 'VueMount',
        globalObject: 'typeof self !== \'undefined\' ? self : this',
    },
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: "babel-loader"
        }]
    },
    plugins: [
        new webpack.BannerPlugin({
            banner: `Vue-Mount.js v${require('./package.json').version}\n(c) ${new Date().getFullYear()} Calvin Von\nReleased under the MIT License.`
        }),
        new UglifyJsPlugin({
            uglifyOptions: {
                compress: {
                }
            },
            parallel: true
        })
    ]
}