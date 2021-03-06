export const MAX_DATE_VALUE = 8640000000000000;
export const MIN_DATE_VALUE = -MAX_DATE_VALUE;

export const removeParamsFromUrlQuery = (url, params) => {
    const x = new URL(url);
    if (params) {
        params.forEach(param => x.searchParams.delete(param));
    }
    return x.toString();
};

export const getHours = (seconds) => seconds / 3600;

export const formatHours = (hours, empty='-') => hours !== undefined ? hours.toFixed(1) : empty;

export const formatLoadingProgress = (loadingProgress) => {
    const toLoadCount = loadingProgress.itemsCountToLoad || 0;
    const loadedCount = loadingProgress.loadedItemsCount || 0;
    return `${toLoadCount}|${loadedCount}`;
};

export const createDateRange = (minDate, maxDate) => ({
    min_date: minDate ? new Date(minDate) : null,
    max_date: maxDate ? new Date(maxDate) : null
});

export const isDateWithinRange = (anyDate, dateRange) => {
    const {min_date: min, max_date: max} = dateRange;
    const date = new Date(anyDate);
    if (min && max) {
        return date >= min && date <= max;
    } else if (min) {
        return date >= min;
    } else if (max) {
        return date <= max;
    }
    return false;
};

export const isDateRangeEmpty = (dateRange) => !dateRange || (!dateRange.min_date && !dateRange.max_date);

export const isIssueSpentTimeInDateRange = (issueSpentTime, dateRange) =>
    isDateRangeEmpty(dateRange) || issueSpentTime.some(x => isDateWithinRange(x.created_at, dateRange));

export const isIssueInDateRange = (issue, dateRange, issueSpentTime) =>
    isDateRangeEmpty(dateRange) ||
    isDateWithinRange(issue.created_at, dateRange) ||
    isDateWithinRange(issue.updated_at, dateRange) ||
    isIssueSpentTimeInDateRange(issueSpentTime, dateRange);

export const filterIssues = (issues, filters, issuesSpentTime) => {
    return issues.filter((issue) => {
        if (filters) {
            if ((filters.members || []).length && (filters.members.indexOf((issue.assignee || {id: null}).id) < 0)) {
                return false;
            }
            if ((filters.projects || []).length && filters.projects.indexOf(issue.project_id) < 0) {
                return false;
            }
            if ((filters.milestones || []).length && (!issue.milestone || filters.milestones.indexOf(issue.milestone.id) < 0)) {
                return false;
            }
            const dateRange = createDateRange(filters.dateRangeMin, filters.dateRangeMax);
            if ((filters.dateRangeMin || filters.dateRangeMax) && !isIssueInDateRange(
                issue,
                dateRange,
                (issuesSpentTime && issuesSpentTime[issue.project_id] && issuesSpentTime[issue.project_id][issue.id]) || [])
            ) {
                return false;
            }
            if (filters.isSpentTimeRequired &&
                (!issuesSpentTime ||
                    !issuesSpentTime[issue.project_id] ||
                    !issuesSpentTime[issue.project_id][issue.id] ||
                    !issuesSpentTime[issue.project_id][issue.id].length ||
                    !isIssueSpentTimeInDateRange(issuesSpentTime[issue.project_id][issue.id], dateRange))
            ) {
                return false;
            }
        }
        return true;
    });
};

// TODO: 0 -> None
// times[issue.id] ? times[issue.id].total_time_spent : 0
const determineHoursWithinDateRange = (issueSpentTime, dateRange) => {
    const hours = issueSpentTime.hours || 0;
    if (!dateRange) {
        return hours;
    }
    const spentAt = new Date(issueSpentTime.spent_at);
    return ((!dateRange.min_date || spentAt >= dateRange.min_date) &&
        (!dateRange.max_date || spentAt <= dateRange.max_date)) ? hours : 0;
};

export const sumSpentHours = (issues, issuesSpentTime, dateRange) =>
    issues.map(issue => issuesSpentTime
        && issuesSpentTime[issue.project_id]
        && issuesSpentTime[issue.project_id][issue.id]
        && issuesSpentTime[issue.project_id][issue.id]
            .reduce((a, b) => a + determineHoursWithinDateRange(b, dateRange), 0) || 0)
        .reduce((a, b) => a + b, 0);

export const sumEstimateHours = (issues) => getHours(issues.map((issue) => issue.time_stats ? issue.time_stats.time_estimate : 0).reduce((a, b) => a + b, 0));

export const flattenObjects = (objects) => [].concat.apply([], Object.values(objects));

export const calcDateRange = (issues, issuesSpentTime) => {
    let minDate = new Date(MIN_DATE_VALUE);
    let maxDate = new Date(MAX_DATE_VALUE);

    issues.forEach(x => {
        const dates = [
            new Date(x.created_at),
            new Date(x.updated_at),
        ];
        if (issuesSpentTime && issuesSpentTime[x.project_id] && issuesSpentTime[x.project_id][x.id]) {
            issuesSpentTime[x.project_id][x.id].forEach(x => dates.push(new Date(x.created_at)));
        }
        minDate = Math.min(maxDate, ...dates);
        maxDate = Math.max(minDate, ...dates);
    });

    return createDateRange(minDate, maxDate);
};
