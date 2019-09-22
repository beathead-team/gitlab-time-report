export const ISSUE_SPENT_TIME_SET = 'ISSUE_SPENT_TIME_SET';
export const ISSUE_SPENT_TIME_PARSE = 'ISSUE_SPENT_TIME_PARSE';

export const ACTIONS = {
    ISSUE_SPENT_TIME_SET,
    ISSUE_SPENT_TIME_PARSE
};

export function parseIssueSpentTime(projectId, issueId, issueNotes) {
    return {
        type: ISSUE_SPENT_TIME_PARSE,
        payload: {
            projectId,
            issueId,
            issueNotes,
        }
    }
}

export function setIssueSpentTime(projectId, issueId, data) {
    return {
        type: ISSUE_SPENT_TIME_SET,
        payload: {
            projectId,
            issueId,
            data,
        },
    };
}
