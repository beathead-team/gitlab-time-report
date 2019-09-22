const webpack = require('webpack');
const basicAuth = require('basic-auth');

const env = process.env;
const
    NODE_ENV = env.NODE_ENV || 'development',
    LISTEN_HOST = env.LISTEN_HOST || 'localhost',
    LISTEN_PORT = env.LISTEN_PORT || 3030,
    GITLAB_URL = env.GITLAB_URL || 'localhost',
    GITLAB_TOKEN = env.GITLAB_TOKEN || '';
    GITLAB_MEMBERS_SEARCH_TERMS = env.GITLAB_MEMBERS_SEARCH_TERMS || '';
    GITLAB_PROJECTS_SEARCH_TERM = env.GITLAB_PROJECTS_SEARCH_TERM || '';
    WEBPACK_BASIC_AUTH = env.WEBPACK_BASIC_AUTH || false;

function checkWebpackBasicAuth(req, res, next) {
    const [requiredName, requiredPass] = WEBPACK_BASIC_AUTH.split('=');

    const unauthorized = (res) => {
        res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
        return res.send(401);
    };

    const {name, pass} = basicAuth(req) || {};

    if (!name || !pass) {
        console.warn(`Request: ${req.url} No credentials provided`);
        return unauthorized(res);
    }

    if (name === requiredName && pass === requiredPass) {
        return next();
    }

    console.warn(`Request: ${req.url} Wrong credentials`);
    return unauthorized(res);
}

module.exports = {
    entry: './src',
    output: {
        path: __dirname + '/src',
        filename: 'index.js'
    },
    devtool: NODE_ENV == 'development' ? 'inline-source-map' : false,
    devServer: {
        inline: true,
        host: LISTEN_HOST,
        port: LISTEN_PORT,
        contentBase: __dirname + '/src',
        before: function(app) {
            if (WEBPACK_BASIC_AUTH) {
                console.log('Content is protected by HTTP Basic authentication');
                app.get('/*', checkWebpackBasicAuth);
            }
        }
    },
    module: {
        loaders: [
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
