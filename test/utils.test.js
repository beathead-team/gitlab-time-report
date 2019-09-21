import { assert, expect, describe, it } from './common';
import { calcDateRange, sumSpentHours } from '../src/utils';

describe('utils', function() {
    const issues = [
        // updated_at > created_at
        {project_id: 1, id: 100, created_at: new Date(2019, 11, 1), updated_at: new Date(2019, 11, 10)},
        // updated_at > created_at
        {project_id: 1, id: 110, created_at: new Date(2019, 9, 1), updated_at: new Date(2019, 9, 10)},
        // updated_at = created_at
        {project_id: 1, id: 150, created_at: new Date(2019, 4, 1), updated_at: new Date(2019, 4, 10)},
    ].map(x => Object.assign({}, x, {
        created_at: x.created_at.toISOString(),
        updated_at: x.updated_at.toISOString()
    }));
    const issuesSpentTime = {
        1: {
            // spent time created_at > than updated_at from issue
            100: [
                {hours: 2, created_at: new Date(2019, 11, 11)},
                {hours: 2.5, created_at: new Date(2019, 11, 12)},
                {hours: -0.5, created_at: new Date(2019, 11, 13)},
            ],
            // spent time created_at < than updated_at from issue
            110: [
                {hours: 1, created_at: new Date(2019, 11, 3)},
                {hours: 2, created_at: new Date(2019, 11, 4)},
                {hours: 3, created_at: new Date(2019, 11, 5)}
            ],
            // there is no spent time for issue with id 150
        }
    };
    Object.keys(issuesSpentTime).map(p => {
        Object.keys(issuesSpentTime[p]).map(i => {
            issuesSpentTime[p][i] = issuesSpentTime[p][i].map(st => Object.assign({}, st, {
                created_at: st.created_at.toISOString()
            }));
        });
    });

    it('it should calc total spent hours sum', function() {
        assert.equal(sumSpentHours(issues, issuesSpentTime), 10);
    });
    it('it should calc spent hours sum withing date range', function() {
        assert.equal(sumSpentHours(issues, issuesSpentTime, {
            min_date: new Date(2019, 11, 3),
            max_date: new Date(2019, 11, 5)
        }), 6);
        assert.equal(sumSpentHours(issues, issuesSpentTime, {
            min_date: new Date(2019, 11, 4),
            max_date: new Date(2019, 11, 11)
        }), 7);
        assert.equal(sumSpentHours(issues, issuesSpentTime, {
            min_date: new Date(2019, 11, 12),
            max_date: new Date(2019, 11, 13)
        }), 2);
    });
    it('it should calc spent hours sum when start date specified', function() {
        assert.equal(sumSpentHours(issues, issuesSpentTime, {
            min_date: new Date(2019, 11, 3),
        }), 10);
        assert.equal(sumSpentHours(issues, issuesSpentTime, {
            min_date: new Date(2019, 11, 12),
        }), 2);
        assert.equal(sumSpentHours(issues, issuesSpentTime, {
            min_date: new Date(2019, 11, 11),
        }), 4);
    });
    it('it should calc spent hours sum when end date specified', function() {
        assert.equal(sumSpentHours(issues, issuesSpentTime, {
            max_date: new Date(2019, 11, 5)
        }), 6);
        assert.equal(sumSpentHours(issues, issuesSpentTime, {
            max_date: new Date(2019, 11, 4)
        }), 3);
        assert.equal(sumSpentHours(issues, issuesSpentTime, {
            max_date: new Date(2019, 11, 12),
        }), 10.5);
    });
    it('it should calc date range', function() {
        expect(calcDateRange(issues, issuesSpentTime)).to.deep.equalInAnyOrder({
            min_date: new Date(2019, 4, 1),
            max_date: new Date(2019, 11, 13)
        })
    });
});
