import { LOGOUT } from '../actions/auth';
import { logout } from "../functions";

export default function filters (state={}, action) {
    if (action.type === LOGOUT) {
        logout(action.gitlabUrl, action.username);
    }
    return state;
};
