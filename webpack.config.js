const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    entry: path.join(__dirname, '/app.ts'),
    devtool: 'source-map',
    output: {
        filename: 'app.js',
        path: path.join(__dirname, '/dist'),
    },
    module: {
        rules: [{
            test: /\.tsx?$/,
            loader: 'ts-loader',
            exclude: /node_modules/,
        }, ]
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js", ".json"]
    },
    plugins: [
        new CleanWebpackPlugin()
    ],
    target: 'node',
    node: {
        __dirname: true,
        __filename: false,
    }
};