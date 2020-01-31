import 'regenerator-runtime/runtime';
import React from 'react';
import ReactDOM from 'react-dom';
import {applyMiddleware, compose, createStore} from 'redux';
import {Provider} from 'react-redux';
// Styles import
import 'react-select/dist/react-select.css';
import 'react-bootstrap-table/dist/react-bootstrap-table.min.css';
import 'react-datepicker/dist/react-datepicker.css';

import App from './components/App';
import {createGitlabApiMiddleware} from './middlewares/gitlabApi';
import createSagaMiddleware from 'redux-saga';
import {extractGitlabToken, fetchGitlabConfig, hideRootLoader, redirectToOauth} from './functions';
import mainReducer from './reducers';
import {mainSaga} from './sagas';
import {removeParamsFromUrlQuery} from "./utils";

(async () => {
    try {
        let gitlabToken = extractGitlabToken();
        if (!gitlabToken) {
            gitlabToken = getGitlabTokenFromSession();
        } else {
            saveGitlabTokenToSession(gitlabToken);
            redirectToCurrentUrlWithoutToken();
            return;
        }
        if (!gitlabToken) {
            redirectToOauth();
            return;
        }
        const config = await fetchGitlabConfig(gitlabToken);
        initFromConfigAndToken(config, gitlabToken);
    } catch (err) {
        console.error(err);
    }
})();

function saveGitlabTokenToSession(gitlabToken) {
    sessionStorage.setItem('token', gitlabToken);
}

function redirectToCurrentUrlWithoutToken() {
    window.location.href = removeParamsFromUrlQuery(window.location.href, ['token']);
}

function getGitlabTokenFromSession() {
    return sessionStorage.getItem('token');
}

function initFromConfigAndToken(config, gitlabToken) {
    const {gitlab} = config;

    if (!gitlab || !gitlab.url || !gitlabToken) {
        throw new Error('gitlab config is invalid, url and token are mandatory fields!');
    }

    const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    const sagaMiddleware = createSagaMiddleware();
    const createStoreWithMiddleware = composeEnhancers(
        applyMiddleware(
            sagaMiddleware,
            createGitlabApiMiddleware(gitlab.url, gitlabToken)
        )
    )(createStore);
    const store = createStoreWithMiddleware(mainReducer, {
        settings: {
            gitlabUrl: gitlab.url,
            username: gitlab.username,
            membersSearchTerms: gitlab.membersSearchTerms ? gitlab.membersSearchTerms.split(';') : null,
            projectsSearchTerm: gitlab.projectSearchTerms || null,
        }
    });

    sagaMiddleware.run(mainSaga);

    ReactDOM.render(
        <Provider store={store}>
            <App/>
        </Provider>,
        document.getElementById('app')
    );

    hideRootLoader();
}
