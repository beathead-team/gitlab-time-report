import {combineReducers} from 'redux';

import auth from './auth';
import issues from './issues';
import members from './members';
import filters from './filters';
import milestones from './milestones';
import projects from './projects';
import settings from './settings';
import issueNotes from './issuesNotes';
import issuesSpentTime from './issuesSpentTime';
import loadingProgress from './loadingProgress';

let mainReducer = combineReducers({
    auth,
    issues,
    issueNotes,
    issuesSpentTime,
    members,
    filters,
    milestones,
    projects,
    settings,
    loadingProgress,
});

export default mainReducer;
