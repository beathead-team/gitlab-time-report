import { all } from 'redux-saga/effects';
import { issueSpentTimeSaga } from './issueSpentTime';

export function* mainSaga() {
    yield all([
        issueSpentTimeSaga(),
    ]);
}
