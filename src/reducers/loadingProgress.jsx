import { ACTIONS } from '../actions/loadingProgress';

let initialState = {};

export default function (state=initialState, action) {
    if (action.type === ACTIONS.LOADING_PROGRESS_SET_TARGET) {
        return {...state,
            itemsCountToLoad: action.payload.itemsCountToLoad,
            loadedItemsCount: 0
        }
    } else if (action.type === ACTIONS.LOADING_PROGRESS_EXTEND_TARGET) {
        return {...state, itemsCountToLoad: state.itemsCountToLoad + action.payload.itemsCountToLoad}
    } else if (action.type === ACTIONS.LOADING_PROGRESS_ADD) {
        return {...state, loadedItemsCount: state.loadedItemsCount + action.payload.loadedItemsCount}
    }
    return state;
}
