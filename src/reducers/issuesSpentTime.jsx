import { ACTIONS } from '../actions/issueSpentTime';

let initialState = {};

export default function (state=initialState, action) {
    if (action.type === ACTIONS.ISSUE_SPENT_TIME_SET) {
        const {projectId, issueId, data} = action.payload;
        const projectIssueSpentTime = {...(state[projectId] || {}), [issueId]: data};
        return {...state, [projectId]: projectIssueSpentTime};
    }
    return state;
};
