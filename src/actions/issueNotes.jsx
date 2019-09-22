import { gitlabRequest } from './gitlabApi';

export const ISSUE_NOTES_SET = 'ISSUE_NOTES_SET';

export const ACTIONS = {
    ISSUE_NOTES_SET
};

export function fetchIssueNotes(projectId, issueIid) {
    return gitlabRequest(`/projects/${projectId}/issues/${issueIid}/notes`, {
        sort: 'asc'
    });
}

export function issueNotesSet(issueId, data) {
    return {
        type: ACTIONS.ISSUE_NOTES_SET,
        payload: {
            issueId,
            data,
        },
    };
}
