import { it, describe, expect } from '../common';
import reducer from '../../src/reducers/issuesSpentTime';
import { setIssueSpentTime } from "../../src/actions/issueSpentTime";

describe('issueSpentTime reducer', function () {
    const projectId = 5;
    const firstIssueId = 10;
    const firstIssueData = [
        {note_id: 100},
        {note_id: 200},
    ];
    const secondIssueId = 20;
    const secondIssueData = [
        {note_id: 300},
        {note_id: 400},
    ];
    it('it should set issue spent time when state is blank', function () {
        expect(reducer({}, setIssueSpentTime(projectId, firstIssueId, firstIssueData))).to.deep.equalInAnyOrder({
            [projectId]: {
                [firstIssueId]: firstIssueData
            }
        })
    });
    it('it should set issue spent time for existing project without erasing its data', function () {
        const initialState = reducer({}, setIssueSpentTime(projectId, firstIssueId, firstIssueData));
        expect(reducer(initialState, setIssueSpentTime(projectId, secondIssueId, secondIssueData))).to.deep.equalInAnyOrder({
            [projectId]: {
                [firstIssueId]: firstIssueData,
                [secondIssueId]: secondIssueData
            }
        })
    });
});
