import { assert, expect, describe, it } from '../common';
import { parseIssueNotesSpentTime, parseTime } from '../../src/sagas/issueSpentTimeParser';

describe('issueSpentTimeParser', function () {
    describe('parseTime', function () {
        it('it should parse 1d as 8 hours', function () {
            assert.equal(parseTime('1d'), 8);
        });
        it('it should parse 1w as 40 hours', function () {
            assert.equal(parseTime('1w'), 40);
        });
        it('it should parse 30m as 0.5 hour', function () {
            assert.equal(parseTime('30m'), 0.5);
        });
        it('it should parse 5h as 5 hours', function () {
            assert.equal(parseTime('5h'), 5);
        });
        it('it should fail to parse 1x', function () {
            assert.throws(() => parseTime('1x'), Error);
        });
    });
    describe('parseIssueNotesSpentTime', function () {
        const testNote2 = {
            "id": 123,
            "type": null,
            "body": "added 1d 4h 30m of time spent at 2019-06-09",
            "attachment": null,
            "author": {
                "id": 100,
                "name": "XYZ",
                "username": "xyz",
                "state": "active",
                "avatar_url": "",
                "web_url": "https://gitlab.com/xyz"
            },
            "created_at": "2019-02-19T21:36:29.395Z",
            "updated_at": "2019-02-19T21:36:29.395Z",
            "system": true,
            "noteable_id": 123,
            "noteable_type": "Issue",
            "resolvable": false,
            "noteable_iid": 100
        };

        const testNote1 = {
            "id": 122,
            "type": null,
            "body": "Some comment here",
            "attachment": null,
            "author": {
                "id": 100,
                "name": "XYZ",
                "username": "xyz",
                "state": "active",
                "avatar_url": "",
                "web_url": "https://gitlab.com/xyz"
            },
            "created_at": "2019-02-19T21:36:27.395Z",
            "updated_at": "2019-02-19T21:36:27.395Z",
            "system": true,
            "noteable_id": 122,
            "noteable_type": "Issue",
            "resolvable": false,
            "noteable_iid": 100
        };

        it('it should parse `added 1d 4h 30m of time spent at 2019-06-09` as 12.5 hours time spent', function () {
            expect(parseIssueNotesSpentTime([testNote2])).to.deep.equalInAnyOrder([{
                "note_id": 123,
                "spent_at": "2019-06-09",
                "created_at": "2019-02-19T21:36:29.395Z",
                "hours": 12.5,
                "description": null,
            }]);
        });
        it('it should set description from previous author\'s note', function () {
            expect(parseIssueNotesSpentTime([testNote1, testNote2])).to.deep.equalInAnyOrder([{
                "note_id": 123,
                "spent_at": "2019-06-09",
                "created_at": "2019-02-19T21:36:29.395Z",
                "hours": 12.5,
                "description": "Some comment here",
            }]);
        });
    });
});
