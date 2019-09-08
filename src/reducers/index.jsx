import {combineReducers} from 'redux';

import issues from './issues';
import members from './members';
import filters from './filters';
import milestones from './milestones';
import projects from './projects';
import settings from './settings';


let mainReducer = combineReducers({
    issues,
    members,
    filters,
    milestones,
    projects,
    settings,
});

export default mainReducer;
