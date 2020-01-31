const functions = require('firebase-functions');
const express = require('express');
const basicAuth = require('basic-auth');
const admin = require('firebase-admin');

require('./admin');
const auth = require('./auth');
const config = require('./config');

function checkBasicAuth(req, res, next) {
    const {name: requiredName, pass: requiredPass} = functions.config().basicauth;

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

function allowCors(req, res, next) {
    res.append('Access-Control-Allow-Origin', [functions.config().express.cors]);
    res.append('Access-Control-Allow-Methods', 'GET');
    res.append('Access-Control-Allow-Headers', 'Content-Type');
    next();
}

const app = express();

app.use(allowCors);

if (functions.config().basicauth) {
    app.use(checkBasicAuth);
}

app.use('/auth', auth);
app.use('/config', config);

exports.app = functions.https.onRequest(app);
