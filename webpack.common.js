const webpack = require('webpack');

const env = process.env;
const
    GITLAB_URL = env.GITLAB_URL || 'localhost',
    GITLAB_TOKEN = env.GITLAB_TOKEN || '';
    GITLAB_MEMBERS_SEARCH_TERMS = env.GITLAB_MEMBERS_SEARCH_TERMS || '';
    GITLAB_PROJECTS_SEARCH_TERM = env.GITLAB_PROJECTS_SEARCH_TERM || '';
    WEBPACK_BASIC_AUTH = env.WEBPACK_BASIC_AUTH || false;

module.exports = {
    entry: './src',
    output: {
        path: __dirname + '/src',
        filename: 'index.js'
    },
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
            __GITLAB_URL: JSON.stringify(GITLAB_URL),
            __GITLAB_TOKEN: JSON.stringify(GITLAB_TOKEN),
            __GITLAB_MEMBERS_SEARCH_TERMS: JSON.stringify(GITLAB_MEMBERS_SEARCH_TERMS),
            __GITLAB_PROJECTS_SEARCH_TERM: JSON.stringify(GITLAB_PROJECTS_SEARCH_TERM),
        })
    ]
};
