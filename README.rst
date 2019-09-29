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
        firebase functions:config:set gitlab.url="http://gitlab.localhost" \
        gitlab.token="personal_access_token" \
        gitlab.members="user1;user2;user3" \
        gitlab.projects="projects_search_term" \
        express.cors="http://localhost:3030"

        npm run firebase-serve

        npm start


   - ``gitlab.url`` is the home page for your GitLab instance
   - ``gitlab.token`` is an GitLab personal access token you got at previous step
   - ``gitlab.projects`` allows to filter initial set of projects
   - ``gitlab.members`` allows to filter initial set of members (semicolon separated)
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
        gitlab.token="personal_access_token" \
        gitlab.members="user1;user2;user3" \
        gitlab.projects="projects_search_term" \
        basicauth.name="username" \
        basicauth.password="password" \
        express.cors="https://your.firebase-app.url"

        # deploy

        CONFIG_URL="https://your.firebase-app.url/config" \
        npm run build

        npm run firebase-deploy

   - ``basicauth.name`` basic auth name for getting config
   - ``basicauth.pass`` basic auth password for getting config
