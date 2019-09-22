import { gitlabRequest } from './gitlabApi';


export const PROJECTS_SET = 'PROJECTS_SET';

export function fetchProjects(search = '') {
    return gitlabRequest('/projects', {search});
}

export function projectsSet(data) {
    return {
        type: PROJECTS_SET,
        payload: {
            data,
        },
    };
}
