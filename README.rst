==================
GitLab Time Report
==================

GitLab report view for issues/members time tracking

Inspired by https://gitlab.com/gitlab-org/gitlab-ee/issues/1271

Setup development environment
=============================

#. Install `node` and `gulp`

#. Install dependencies

    .. code-block:: bash

        npm i && cd functions && npm i

#. Build styles

    .. code-block:: bash

        gulp sass


#. Create GitLab personal access token with at least ``api`` access (more info on `GitLab Documentation page <https://docs.gitlab.com/ee/user/profile/personal_access_tokens.html>`_)

#. Set up firebase config and start webpack dev server

    .. code-block:: bash

        # it is expected that you configured firebase-cli https://firebase.google.com/docs/cli

        # change firebase project if necessary
        firebase use projectname

        # set firebase config
        # localhost:3030 should be replaced with your project root url
        # localhost:5000 should be replaced with your project firebase functions root url
        firebase functions:config:set gitlab.url="http://gitlab.localhost" \
        gitlab.members="user1;user2;user3" \
        gitlab.projects="projects_search_term" \
        gitlab.oauth.client_id="gitlab_oauth_client_id" \
        gitlab.oauth.redirect_uri="http://localhost:5000/auth/oauth/token" \
        gitlab.oauth.client_secret="gitlab_oauth_client_secret" \
        database.database_url="https://database_url.firebaseio.com" \
        database.project_id="project_id" \
        database.private_key="base64_private_key_string" \
        database.client_email="firebase-adminsdk-73ubs@your_project.iam.gserunt.com" \
        session.secret="session_secret" \
        express.cors="http://localhost:3030"

        npm run firebase-serve

        npm start


   - ``gitlab.url`` is the home page for your GitLab instance
   - ``gitlab.projects`` allows to filter initial set of projects,
    this is the default value, more specific value could be configure for each gitlab user in firestore
   - ``gitlab.members`` allows to filter initial set of members (semicolon separated), this is the default value,
    this is the default value, more specific value could be configure for each gitlab user in firestore
   - ``gitlab.oauth.client_id`` client_id from gitlab app
   - ``gitlab.oauth.client_secret`` client_secret from gitlab app
   - ``gitlab.oauth.redirect_uri`` the url in the firebase functions to redirect from gitlab
   - ``database.database_url`` firestore url from firebase console
   - ``database.project_id`` project_id from firebase console
   - ``database.client_email`` client_email from firebase console
   - ``database.private_key`` base64 encoded string of the private key to access firebase admin sdk
   - ``session.secret`` secret value to be used for session
   - ``express.cors`` sets cors Access-Control-Allow-Origin for getting the config
   - ``LISTEN_HOST`` is ``localhost`` by default
   - ``LISTEN_PORT`` is ``3030`` by default

#. Open http://localhost:3030/ in browser (for default ``LISTEN_HOST`` and ``LISTEN_PORT``)

#. Set up firebase config and deploy

    .. code-block:: bash

        # it is expected that you configured firebase-cli https://firebase.google.com/docs/cli

        # change firebase project if necessary
        firebase use projectname

        # set firebase config
        firebase functions:config:set gitlab.url="http://gitlab.localhost" \
        gitlab.members="user1;user2;user3" \
        gitlab.projects="projects_search_term" \
        gitlab.oauth.client_id="gitlab_oauth_client_id" \
        gitlab.oauth.redirect_uri="http://localhost:5000/auth/oauth/token" \
        gitlab.oauth.client_secret="gitlab_oauth_client_secret" \
        database.database_url="https://database_url.firebaseio.com" \
        database.project_id="project_id" \
        database.private_key="base64_private_key_string" \
        database.client_email="firebase-adminsdk-73ubs@your_project.iam.gserunt.com" \
        session.secret="session_secret" \
        basicauth.name="username" \
        basicauth.password="password" \
        express.cors="https://your.firebase-app.url"

        # deploy

        BASE_URL="https://your.firebase-app.url" \
        FUNCTIONS_URL="https://your.firebase-app.url" \
        npm run build

        npm run firebase-deploy

   - ``basicauth.name`` basic auth name for getting config
   - ``basicauth.pass`` basic auth password for getting config

# Firestore structure

    As it has been mentioned above, it is possible to configure ``gitlab.memebers`` and ``gitlab.projects`` for each user.
    To do so, you should configure database and add ``configs`` collection to Firestore where each document should have
    the following structure: (username: string; projects: string; members: string)
