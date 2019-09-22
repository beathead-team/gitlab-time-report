import 'regenerator-runtime/runtime';
import React from 'react';
import ReactDOM from 'react-dom';
import {createStore, applyMiddleware, compose} from 'redux';
import {Provider} from 'react-redux';

// Styles import
import 'react-select/dist/react-select.css';
import 'react-bootstrap-table/dist/react-bootstrap-table.min.css';
import 'react-datepicker/dist/react-datepicker.css';

import App from './components/App';
import {createGitlabApiMiddleware} from './middlewares/gitlabApi';
import createSagaMiddleware from 'redux-saga';
import {GITLAB_URL, GITLAB_TOKEN, GITLAB_MEMBERS_SEARCH_TERMS, GITLAB_PROJECTS_SEARCH_TERM} from './config';
import mainReducer from './reducers';
import {mainSaga} from './sagas';


const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const sagaMiddleware = createSagaMiddleware();
const createStoreWithMiddleware = composeEnhancers(
    applyMiddleware(
        sagaMiddleware,
        createGitlabApiMiddleware(GITLAB_URL, GITLAB_TOKEN)
    )
)(createStore);
const store = createStoreWithMiddleware(mainReducer, {
    settings: {
        membersSearchTerms: GITLAB_MEMBERS_SEARCH_TERMS ? GITLAB_MEMBERS_SEARCH_TERMS.split(';') : null,
        projectsSearchTerm: GITLAB_PROJECTS_SEARCH_TERM || null,
    }
});

sagaMiddleware.run(mainSaga);

ReactDOM.render(
    <Provider store={store}>
        <App/>
    </Provider>,
    document.getElementById('app')
);
