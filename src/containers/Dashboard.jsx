import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import Select from 'react-select';

import {
    filterIssues,
    sumSpentHours,
    sumEstimateHours,
    flattenObjects,
    formatHours,
    createDateRange,
    formatLoadingProgress
} from '../utils';
import { fetchIssues, issuesSet } from '../actions/issue';
import { fetchMembers, membersAdd, membersInit, membersSet } from '../actions/member';
import { fetchMilestones, milestonesSet } from '../actions/milestone';
import { fetchProjects, projectsSet } from '../actions/project';
import { setFilters } from '../actions/filters';
import TitledValue from '../components/TitledValue';
import ProgressBar from '../components/ProgressBar';
import MemberTable from './MemberTable';
import { fetchIssueNotes, issueNotesSet } from '../actions/issueNotes';
import { parseIssueSpentTime } from '../actions/issueSpentTime';
import { addLoadingProgress, extendLoadingProgressTarget, setLoadingProgressTarget } from "../actions/loadingProgress";


class Dashboard extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            refreshing: false,
        };
    }

    componentWillMount() {
        this.refresh();
    }

    shouldComponentUpdate(np, ns) {
        return this.state.refreshing != ns.refreshing || !ns.refreshing
            // refresh only when progress changed
            || (!!this.props.loadingProgress
                && !!np.loadingProgress
                && (this.props.loadingProgress.loadedItemsCount !== np.loadingProgress.loadedItemsCount));
    }

    refresh(projects) { // (this.props.filters || {}).projects // To fetch only filtered projects
        this.setState({
            refreshing: true
        }, () => {
            this.props.refresh(projects, () => this.setState({
                refreshing: false
            }), this.props.settings);
        });
    }

    getProjectOptions() {
        return this.props.projects.map((project) => {return {value: project.id, label: project.name}});
    }

    getMilestoneOptions() {
        return (
            flattenObjects(this.props.milestones)
            .filter(milestone => (
                !this.props.filters ||
                !(this.props.filters.projects || []).length ||
                (this.props.filters.projects || []).indexOf(milestone.project_id) >= 0))
            .map((milestone) => {
                let projectName = this.props.projects.filter((project) => project.id == milestone.project_id)[0].name;
                return {value: milestone.id, label: `${projectName} - ${milestone.title}`}
            })
        );
    }

    getMemberOptions() {
        return this.props.allMembers.map((member) => {return {value: member.id, label: member.name}});
    }

    getEdgeDate(key, func) {
        return func(...
            flattenObjects(this.props.milestones)
            .filter(milestone => (
                !this.props.filters ||
                !(this.props.filters.milestones || []).length ||
                (this.props.filters.milestones || []).indexOf(milestone.id) >= 0))
            .map((milestone) => new Date(milestone[key]).getTime())
        );
    }

    getStartDate() {
        return this.getEdgeDate('start_date', Math.min);
    }

    getDueDate() {
        return this.getEdgeDate('due_date', Math.max);
    }

    getDateRangeMin() {
        return this.props.filters.dateRangeMin ? moment.utc(this.props.filters.dateRangeMin) : null;
    }

    getDateRangeMax() {
        return this.props.filters.dateRangeMax ? moment.utc(this.props.filters.dateRangeMax) : null;
    }

    getDateRange() {
        return createDateRange(this.getDateRangeMin(), this.getDateRangeMax());
    }

    render() {
        let now = Date.now(),
            minTime = this.getStartDate(),
            maxTime = this.getDueDate();
        return (
            <div className="dashboard">
                <div className="total">
                    <TitledValue title="Total Spent" value={formatHours(this.props.spentHours)}/>
                    <TitledValue title="Total Estimate" value={formatHours(this.props.estimateHours)} max={this.props.totalCapacity}/>
                    <TitledValue title="Total Capacity" value={formatHours(this.props.totalCapacity)}/>
                    <ProgressBar lines={[
                        {height: 10, current: this.props.spentHours, max: this.props.totalCapacity},
                        {height: 10, current: this.props.estimateHours, max: this.props.totalCapacity, className: 'progress-value-second'},
                        {height: 2, current: now - minTime, max: maxTime - minTime, className: 'progress-value-third'},
                    ]} className="big-progress"/>
                    <div className="refresh" onClick={() => !this.state.refreshing && this.refresh()}>
                        <img className={['refresh-icon', this.state.refreshing ? 'refreshing' : ''].join(' ')} src="/resources/image/refresh.svg"/>
                        {this.props.loadingProgress.itemsCountToLoad && formatLoadingProgress(this.props.loadingProgress)}
                    </div>
                </div>
                <div className="toolbar">
                    Projects
                    <Select
                      value={this.props.filters.projects}
                      options={this.getProjectOptions()}
                      disabled={this.state.refreshing}
                      multi={true}
                      onChange={this.props.filterProjects}
                    />
                    Milestones
                    <Select
                      value={this.props.filters.milestones}
                      options={this.getMilestoneOptions()}
                      disabled={this.state.refreshing}
                      multi={true}
                      onChange={this.props.filterMilestones}
                    />
                    Members
                    <Select
                      value={this.props.filters.members}
                      options={this.getMemberOptions()}
                      disabled={this.state.refreshing}
                      multi={true}
                      onChange={this.props.filterMembers}
                    />
                    <div className="row">
                        <div className="col-md-2">
                            Start date
                            <DatePicker
                                selected={this.getDateRangeMin()}
                                disabled={this.state.refreshing}
                                onChange={this.props.filterDateRangeMin}
                            />
                        </div>
                        <div className="col-md-2">
                            End date
                            <DatePicker
                                selected={this.getDateRangeMax()}
                                disabled={this.state.refreshing}
                                onChange={this.props.filterDateRangeMax}
                            />
                        </div>
                        <div className="col-md-2">
                            <button type="button"
                                    className="btn reset-button"
                                    disabled={this.state.refreshing}
                                    onClick={this.props.resetDateRange}>Reset date range</button>
                        </div>
                        <div className="col-md-6">
                            <label className="checkbox-inline spent-time-filter">
                                <input type="checkbox"
                                       disabled={this.state.refreshing}
                                       defaultChecked={this.props.filters.isSpentTimeRequired}
                                       onChange={this.props.filterIsSpentTimeRequired}/>
                                Filter issues with an empty spent time
                            </label>
                        </div>
                    </div>
                </div>
                <div className="members">
                    <MemberTable numberWidth="45"
                                 members={this.props.members}
                                 issues={this.props.issues}
                                 issuesSpentTime={this.props.issuesSpentTime}
                                 dateRange={this.getDateRange()}
                                 minTime={minTime}
                                 maxTime={maxTime}/>
                </div>
            </div>
        );
    }
}

const getFilters = items => {
    let filters = {};
    Object.entries(items).map((keyval) => {
        let key = keyval[0],
            val = keyval[1];
        filters[key] = (val || []).length ? val.map(item => item.value) : undefined;
    });
    return filters;
};

export default connect(
    (state) => {
        let issuesSpentTime = state.issuesSpentTime,
            issues = filterIssues(flattenObjects(state.issues), state.filters, issuesSpentTime),
            allMembers = state.members,
            members = allMembers.filter(member => !state.filters || !(state.filters.members || []).length || state.filters.members.indexOf(member.id) >= 0);
        return {
            issues,
            issuesSpentTime,
            allMembers,
            members,
            settings: state.settings,
            milestones: state.milestones,
            projects: state.projects,
            filters: state.filters,
            loadingProgress: state.loadingProgress,
            spentHours: sumSpentHours(
                issues,
                issuesSpentTime,
                createDateRange(state.filters.dateRangeMin, state.filters.dateRangeMax)
            ),
            estimateHours: sumEstimateHours(issues),
            totalCapacity: members.map(member => member.capacity).reduce((a, b) => a + b, 0)
        }
    },
    (dispatch) => {
        return {
            refresh: (projectIds, callback, settings) => {
                if (settings.membersSearchTerms) {
                    settings.membersSearchTerms.forEach(searchTerm => {
                        dispatch(membersInit());
                        dispatch(fetchMembers(searchTerm)).then(members => {
                            dispatch(membersAdd(members));
                        });
                    })
                } else {
                    dispatch(fetchMembers()).then(members => {
                        dispatch(membersSet(members));
                    });
                }
                dispatch(fetchProjects(settings.projectsSearchTerm)).then(projects => {
                    dispatch(setLoadingProgressTarget(projects.length * 2));
                    dispatch(projectsSet(projects));
                    return projects.filter(project => !projectIds || projectIds.indexOf(project.id) >= 0).map(project => {
                        return Promise.all([
                            dispatch(fetchIssues(project.id)).then(issues => {
                                dispatch(addLoadingProgress(1));
                                dispatch(extendLoadingProgressTarget(issues.length));
                                dispatch(issuesSet(project.id, issues));
                                // dispatch sequentially to avoid GitLab API Rate Limit error
                                const issueNotesDispatches = issues.map(issue => () =>
                                    dispatch(fetchIssueNotes(project.id, issue.iid)).then(notes => {
                                        dispatch(addLoadingProgress(1));
                                        dispatch(issueNotesSet(issue.id, notes));
                                        dispatch(parseIssueSpentTime(project.id, issue.id, notes));
                                    }));
                                return issueNotesDispatches.reduce((p, x) => p.then(x), Promise.resolve());
                            }),
                            dispatch(fetchMilestones(project.id)).then(milestones => {
                                dispatch(addLoadingProgress(1));
                                dispatch(milestonesSet(project.id, milestones));
                            }),
                        ]);
                    });
                }).then(projectPromises => {
                    Promise.all(projectPromises).then(issuePromises => {
                        Promise.all(issuePromises.map(result => result[0])).then(issueTimePromises => {
                            callback();
                        });
                    });
                });
            },
            filterProjects: (projects) => {
                dispatch(setFilters(getFilters({projects})));
            },
            filterMilestones: (milestones) => {
                dispatch(setFilters(getFilters({milestones})));
            },
            filterMembers: (members) => {
                dispatch(setFilters(getFilters({members})));
            },
            filterDateRangeMin: (dateRangeMin) => {
                dispatch(setFilters({dateRangeMin: dateRangeMin.format('L')}));
            },
            filterDateRangeMax: (dateRangeMax) => {
                dispatch(setFilters({dateRangeMax: dateRangeMax.format('L')}));
            },
            filterIsSpentTimeRequired: (event) => {
                dispatch(setFilters({isSpentTimeRequired: event.target.checked}));
            },
            resetDateRange: () => {
                dispatch(setFilters({dateRangeMin: null, dateRangeMax: null}));
            }
        }
    },
)(Dashboard);
