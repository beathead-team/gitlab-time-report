const express = require('express');
const router = express.Router();
const uniqid = require('uniqid');
const axios = require('axios');
const functions = require('firebase-functions');
const url = require('url');
const querystring = require('querystring');

if (!functions.config().gitlab) {
    throw new Error(`mandatory functions config section 'gitlab' is missing`);
}

if (!functions.config().gitlab.oauth) {
    throw new Error(`mandatory functions config section 'gitlab.oauth' is missing`);
}

router.get('/oauth', (request, response) => {
    const { url: gitlabUrl, oauth: { client_id, redirect_uri } } = functions.config().gitlab;
    const url = `${gitlabUrl}/oauth/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&response_type=code&scope=api+read_user+read_repository+read_registry`;

    response.redirect(url);
});

router.get('/oauth/token', (request, response) => {
    if (!request.query.code) {
        response.send(401, 'code is missing');
        return;
    }

    const { url: gitlabUrl, oauth: { client_id, redirect_uri, authorized_uri, client_secret } } = functions.config().gitlab;

    axios.post(`${gitlabUrl}/oauth/token`, querystring.stringify({
        client_id,
        redirect_uri,
        client_secret,
        code: request.query.code,
        grant_type: 'authorization_code',
    })).then(res => {
        const data = res.data;
        const returnUrl = new url.URL(authorized_uri);
        returnUrl.searchParams.append('token', data.access_token);
        response.redirect(returnUrl.href);
    }).catch(err => {
        response.send(500);
        console.error(err);
    });
});

module.exports = router;
