export const LOGOUT = 'LOGOUT';

export function logout(gitlabUrl, username) {
    return {
        type: LOGOUT,
        gitlabUrl,
        username
    }
}
