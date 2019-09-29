const functions = require('firebase-functions');
const express = require('express');
const basicAuth = require('basic-auth');

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

if (!functions.config().gitlab) {
    throw new Error(`There is no gitlab config setup found, please check readme and setup one`);
}

app.get('/config', (request, response) => {
    response.send({
        gitlab: {
            url: functions.config().gitlab.url,
            token: functions.config().gitlab.token,
            membersSearchTerms: functions.config().gitlab.members,
            projectSearchTerms: functions.config().gitlab.projects
        }
    });
});

exports.app = functions.https.onRequest(app);
