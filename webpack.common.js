const webpack = require('webpack');

const env = process.env;
const CONFIG_URL = env.CONFIG_URL || 'http://localhost:5000/config';

module.exports = {
    entry: './src',
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    {loader: "style-loader"},
                    {loader: "css-loader"}
                ]
            },
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            }
        ]
    },
    resolve: {
        extensions: [
            '.webpack.js',
            '.jsx',
            '.js'
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            __CONFIG_URL: JSON.stringify(CONFIG_URL),
        })
    ]
};
