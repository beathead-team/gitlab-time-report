const webpack = require('webpack');

const env = process.env;
const FUNCTIONS_URL = env.FUNCTIONS_URL || 'http://localhost:5000';
const BASE_URL = env.BASE_URL || 'http://localhost:3030';

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
            __FUNCTIONS_URL: JSON.stringify(FUNCTIONS_URL),
            __BASE_URL: JSON.stringify(BASE_URL)
        })
    ]
};
