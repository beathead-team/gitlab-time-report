const merge = require('webpack-merge');
const common = require('./webpack.common');
const basicAuth = require('basic-auth');

const env = process.env;
const
    LISTEN_HOST = env.LISTEN_HOST || 'localhost',
    LISTEN_PORT = env.LISTEN_PORT || 3030,WEBPACK_BASIC_AUTH = env.WEBPACK_BASIC_AUTH || false;

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

module.exports = merge(common, {
    mode: 'development',
    devtool: 'inline-source-map',
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
});

