const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp({
    credential: admin.credential.cert({
        projectId: functions.config().database.project_id,
        clientEmail: functions.config().database.client_email,
        privateKey: Buffer.from(functions.config().database.private_key, 'base64').toString()
    }),
    databaseURL: functions.config().database.database_url
});
