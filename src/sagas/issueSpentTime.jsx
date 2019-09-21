import { actionChannel, all, call, put, take } from 'redux-saga/effects';
import {
    ISSUE_SPENT_TIME_PARSE,
    setIssueSpentTime
} from '../actions/issueSpentTime';
import { parseIssueNotesSpentTime } from './issueSpentTimeParser';

function* parseIssueSpentTime(action) {
    const {projectId, issueId, issueNotes} = action.payload;
    const spentTimeEntries = yield call(parseIssueNotesSpentTime, issueNotes);
    yield put(setIssueSpentTime(projectId, issueId, spentTimeEntries));
}

function* watchParseIssueSpentTime() {
    const parseChannel = yield actionChannel(ISSUE_SPENT_TIME_PARSE);
    while (true) {
        const action = yield take(parseChannel);
        yield call(parseIssueSpentTime, action);
    }
}

export function* issueSpentTimeSaga() {
    yield all([
        watchParseIssueSpentTime()
    ]);
}
