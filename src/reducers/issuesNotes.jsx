import { ACTIONS } from '../actions/issueNotes';

let initialState = {};

export default function (state = initialState, action) {
    if (action.type === ACTIONS.ISSUE_NOTES_SET) {
        return {...state, [action.payload.issueId]: action.payload.data};
    }
    return state;
};
