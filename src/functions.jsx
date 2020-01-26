// Environment variables (see README and webpack.config.js)
if (!__FUNCTIONS_URL) {
    throw new Error('FUNCTIONS_URL environment variable hasn\'t been set during webpack build');
}

if (!__BASE_URL) {
    throw new Error('BASE_URL environment variable hasn\'t been set during webpack build');
}

const functionsBaseUrl = __FUNCTIONS_URL;
const baseUrl = __BASE_URL;

export function extractGitlabToken() {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    return token || null;
}

export function redirectToOauth() {
    window.location.href = `${functionsBaseUrl}/auth/oauth`;
}

export function fetchGitlabConfig(gitlabToken) {
    return fetch(`${functionsBaseUrl}/config/gitlab?token=${gitlabToken}`)
        .then(response => response.json());
}

export function hideRootLoader() {
    document.getElementById('rootLoader').style.display = 'none';
}

export function logout(gitlabUrl, username) {
    sessionStorage.removeItem('token');
    // gitlab logout url doesn't work currently
    // a use should logout there manually
    window.location.href = `${gitlabUrl}/${username}`;
}
