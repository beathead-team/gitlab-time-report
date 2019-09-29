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
import {fetchConfig} from './config';
import mainReducer from './reducers';
import {mainSaga} from './sagas';

fetchConfig().then(config => {
    const {gitlab} = config;

    if (!gitlab || !gitlab.url || !gitlab.token) {
        throw new Error('gitlab config is invalid, url and token are mandatory fields!');
    }

    const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    const sagaMiddleware = createSagaMiddleware();
    const createStoreWithMiddleware = composeEnhancers(
        applyMiddleware(
            sagaMiddleware,
            createGitlabApiMiddleware(gitlab.url, gitlab.token)
        )
    )(createStore);
    const store = createStoreWithMiddleware(mainReducer, {
        settings: {
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
});
