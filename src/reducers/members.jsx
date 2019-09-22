import {MEMBERS_ADD, MEMBERS_INIT, MEMBERS_SET} from '../actions/member';


let initialState = [];

export default function (state=initialState, action) {
    const noAssignee = {
        id: null,
        name: 'No assignee',
        avatar_url: '/resources/image/no-assignee.png',
        capacity: 0,
    };
    const concatMembers = (initial, data) => initial.concat(data.map(member => {
        // TODO: find a way to store capacity in some kind of gitlab custom fields
        let match = /\/capacity\s+(\d+)/.exec(member.bio);
        return {...member, capacity: match ? parseInt(match[1]): 30}
    }));

    if (action.type === MEMBERS_SET) {
        return concatMembers([noAssignee], action.payload.data);
    } else if (action.type === MEMBERS_ADD) {
        return concatMembers(state, action.payload.data);
    } else if (action.type === MEMBERS_INIT) {
        return [noAssignee];
    }
    return state;
};
