export const LOADING_PROGRESS_SET_TARGET = 'LOADING_PROGRESS_SET_TARGET';
export const LOADING_PROGRESS_EXTEND_TARGET = 'LOADING_PROGRESS_EXTEND_TARGET';
export const LOADING_PROGRESS_ADD = 'LOADING_PROGRESS_ADD';

export const ACTIONS = {
    LOADING_PROGRESS_SET_TARGET,
    LOADING_PROGRESS_EXTEND_TARGET,
    LOADING_PROGRESS_ADD,
};

export function setLoadingProgressTarget(itemsCountToLoad) {
    return {
        type: LOADING_PROGRESS_SET_TARGET,
        payload: {
            itemsCountToLoad
        }
    }
}

export function extendLoadingProgressTarget(itemsCountToLoad) {
    return {
        type: LOADING_PROGRESS_EXTEND_TARGET,
        payload: {
            itemsCountToLoad
        }
    }
}

export function addLoadingProgress(loadedItemsCount) {
    return {
        type: LOADING_PROGRESS_ADD,
        payload: {
            loadedItemsCount
        }
    }
}
