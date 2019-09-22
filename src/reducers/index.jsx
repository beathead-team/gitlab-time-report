import {combineReducers} from 'redux';

import issues from './issues';
import members from './members';
import filters from './filters';
import milestones from './milestones';
import projects from './projects';
import settings from './settings';
import issueNotes from './issuesNotes';
import issuesSpentTime from "./issuesSpentTime";

let mainReducer = combineReducers({
    issues,
    issueNotes,
    issuesSpentTime,
    members,
    filters,
    milestones,
    projects,
    settings,
});

export default mainReducer;
