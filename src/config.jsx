// Environment variables (see README and webpack.config.js)
export const fetchConfig = () => {
    if (!__CONFIG_URL) {
        throw new Error('CONFIG_URL environment variable hasn\'t been set during webpack build');
    }
    return fetch(__CONFIG_URL).then(response => response.json());
};
