const express = require('express');
const router = express.Router();
const functions = require('firebase-functions');
const admin = require('firebase-admin');

if (!functions.config().database) {
    throw new Error(`mandatory functions config section 'database' is missing`);
}

if (!functions.config().gitlab) {
    throw new Error(`mandatory functions config section 'gitlab' is missing`);
}

const db = admin.firestore();

async function getUsername(oauthToken) {
    const gitlab = require('gitlab');
    const gitlabApi = new gitlab.Gitlab({
        oauthToken
    });
    return gitlabApi.Users.current().then(user => (user && user.username) || null);
}

async function getConfig(username) {
    const config = {
        gitlab: {
            username,
            url: functions.config().gitlab.url,
            membersSearchTerms: functions.config().gitlab.members,
            projectSearchTerms: functions.config().gitlab.projects
        }
    };
    const configsRef = db.collection('configs');

    try {
        const snapshot = await configsRef
            .where('username', '==', username)
            .limit(1)
            .get();

        if (snapshot.docs.length > 0) {
            const userConfig = snapshot.docs[0].data();
            config.gitlab.membersSearchTerms = userConfig.members;
            config.gitlab.projectSearchTerms = userConfig.projects;
        }
    } catch(error) {
        console.error(error);
    }

    return config;
}

router.get('/gitlab', async (request, response) => {
    if (!request.query.token) {
        response.send(400, `mandatory query parameter 'token' is missing`);
        return;
    }

    let username = null;

    try {
        username = await getUsername(request.query.token);
    } catch (err) {
        console.error(err);
        response.send(500, `can't get username from gitlab api by provided token`);
        return;
    }
    const config = await getConfig(username);

    response.send(config);
});

module.exports = router;
