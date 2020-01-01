const express = require('express');
const router = express.Router();
const uniqid = require('uniqid');
const axios = require('axios');
const functions = require('firebase-functions');

if (!functions.config().gitlab) {
    throw new Error(`mandatory functions config section 'gitlab' is missing`);
}

if (!functions.config().gitlab.oauth) {
    throw new Error(`mandatory functions config section 'gitlab.oauth' is missing`);
}

router.get('/oauth', (request, response) => {
    if (!request.query.redirect_uri) {
        response.send(400, 'mandatory query parameter redirect_uri is missing');
        return;
    }

    if (!request.session.state) {
        request.session.state = uniqid();
    }

    request.session.redirect_uri = request.query.redirect_uri;

    const state = request.session.state;
    const { url: gitlabUrl, oauth: { client_id, redirect_uri } } = functions.config().gitlab;
    const url = `${gitlabUrl}/oauth/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&response_type=code&scope=api+read_user+read_repository+read_registry&state=${state}`;

    response.redirect(url);
});

router.get('/oauth/token', (request, response) => {
    if (!request.query.code ||
        !request.query.state ||
        !request.session.state ||
        request.session.state !== request.query.state) {
        response.send(401);
        return;
    }

    const { url: gitlabUrl, oauth: { client_id, redirect_uri, client_secret } } = functions.config().gitlab;

    axios.post(`${gitlabUrl}/oauth/token`, {
        client_id,
        redirect_uri,
        client_secret,
        code: request.query.code,
        grant_type: 'authorization_code',
    }).then(res => {
        const data = res.data;
        request.session.gitlab_token = data.access_token;

        const url = new URL(request.session.redirect_uri);
        url.searchParams.append('token', request.session.gitlab_token);
        response.redirect(url.href);
    }).catch(err => {
        response.send(500, "Can't get oauth token from gitlab");
        console.err(err);
    });
});

module.exports = router;
