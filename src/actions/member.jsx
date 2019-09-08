import { gitlabRequest } from './gitlabApi';


export const MEMBERS_SET = 'MEMBERS_SET';
export const MEMBERS_INIT = 'MEMBERS_INIT';
export const MEMBERS_ADD = 'MEMBERS_ADD';

export function fetchMembers(search = '') {
    return gitlabRequest('/users', {active: true, blocked: false, search});
}

export function membersInit() {
    return { type: MEMBERS_INIT };
}

export function membersSet(data) {
    return {
        type: MEMBERS_SET,
        payload: {
            data,
        },
    };
}

export function membersAdd(data) {
    return {
        type: MEMBERS_ADD,
        payload: {
            data,
        },
    };
}
