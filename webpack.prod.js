const merge = require('webpack-merge');
const common = require('./webpack.common');

module.exports = merge(common, {
    mode: 'production',
    devtool: false,
    output: {
        path: __dirname + '/public',
        filename: 'index.js'
    },
});

