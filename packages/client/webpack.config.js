const CopyWebpackPlugin = require('copy-webpack-plugin');
const ErrorOverlayPlugin = require('error-overlay-webpack-plugin');
const ForkTsCheckerPlugin = require('fork-ts-checker-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const LwcWebpackPlugin = require('lwc-webpack-plugin');
const path = require('path');
const webpack = require('webpack');

const mode = process.env.NODE_ENV || 'development';
const buildDir = path.join(__dirname, '..', '..', 'dist-client');

module.exports = {
    entry: [path.join(__dirname, 'src')],
    mode,
    devtool: mode === 'development' && 'source-map',
    output: {
        path: buildDir,
        filename: 'app.js',
        publicPath: '/'
    },
    module: {
        rules: [
            {
                test: /\.(js|ts)?$/,
                loader: 'esbuild-loader',
                options: {
                    loader: 'ts',
                    target: 'es2018'
                },
                exclude: /node_modules/
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(mode)
        }),
        new ForkTsCheckerPlugin(),
        new LwcWebpackPlugin({
            // https://www.npmjs.com/package/lwc-webpack-plugin
            modules: [
                {
                    dir: 'src/modules'
                },
                {
                    npm: 'lightning-base-components'
                }
            ]
        }),
        new HtmlWebpackPlugin({
            template: path.join(__dirname, 'src', 'index.html')
        }),
        new CopyWebpackPlugin([
            {
                from: path.join(__dirname, 'src', 'resources'),
                to: path.join(buildDir, 'resources')
            },
            {
                from: path.join(
                    __dirname,
                    '..',
                    '..',
                    'node_modules',
                    '@salesforce-ux',
                    'design-system',
                    'assets'
                ),
                to: path.join(buildDir, 'assets')
            }
        ]),
        new ErrorOverlayPlugin()
    ],
    devServer: {
        // https://webpack.js.org/configuration/dev-server
        proxy: { '/': 'http://localhost:3002' }
    }
};
