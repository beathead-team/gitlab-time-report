const merge = require('webpack-merge');
const common = require('./webpack.common');

const env = process.env;
const
    LISTEN_HOST = env.LISTEN_HOST || 'localhost',
    LISTEN_PORT = env.LISTEN_PORT || 3030;

module.exports = merge(common, {
    mode: 'development',
    devtool: 'inline-source-map',
    output: {
        path: __dirname + '/src',
        filename: 'index.js'
    },
    devServer: {
        inline: true,
        host: LISTEN_HOST,
        port: LISTEN_PORT,
        contentBase: __dirname + '/src',
    },
});

