import { Action, Reducer } from 'redux';
import { AppThunkAction } from './';

// -----------------
// STATE - This defines the type of data maintained in the Redux store.

export interface ListState {
    isLoading: boolean;
    lists: List[];
}

export interface List {
    id: number;
    name: string;
}

// -----------------
// ACTIONS - These are serializable (hence replayable) descriptions of state transitions.
// They do not themselves have any side-effects; they just describe something that is going to happen.

interface RequestListsAction {
    type: 'REQUEST_LISTS';
}

interface ReceiveListsAction {
    type: 'RECEIVE_LISTS';
    lists: List[];
}

interface RequestInsertListAction {
    type: 'REQUEST_INSERT_LISTS';
    list: List;
}

interface ResponseInsertListAction {
    type: 'RESPONSE_INSERT_LISTS';
    lists: List[];
}

interface RequestUpdateListAction {
    type: 'REQUEST_UPDATE_LISTS';
    id: number;
    list: List;
}

interface ResponseUpdateListAction {
    type: 'RESPONSE_UPDATE_LISTS';
    lists: List[];
}

interface RequestDeleteListAction {
    type: 'REQUEST_DELETE_LISTS';
    id: number;
}

interface ResponseDeleteListAction {
    type: 'RESPONSE_DELETE_LISTS';
    lists: List[];
}

// Declare a 'discriminated union' type. This guarantees that all references to 'type' properties contain one of the
// declared type strings (and not any other arbitrary string).

type KnownAction = RequestListsAction | ReceiveListsAction | RequestInsertListAction | ResponseInsertListAction | RequestUpdateListAction | ResponseUpdateListAction | RequestDeleteListAction | ResponseDeleteListAction;

// ----------------
// ACTION CREATORS - These are functions exposed to UI components that will trigger a state transition.
// They don't directly mutate state, but they can have external side-effects (such as loading data).

export const actionCreators = {
    requestLists: (): AppThunkAction<KnownAction> => (dispatch, getState) => {
        // Only load data if it's something we don't already have (and are not already loading)
        const appState = getState();
        if (appState && appState.lists) {
            fetch(`list`)
                .then(response => response.json() as Promise<List[]>)
                .then(data => {
                    dispatch({ type: 'RECEIVE_LISTS', lists: data });
                });

            dispatch({ type: 'REQUEST_LISTS' });
        }
    }
};

// ----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.

const unloadedState: ListState = { lists: [], isLoading: false };

export const reducer: Reducer<ListState> = (state: ListState | undefined, incomingAction: Action): ListState => {
    if (state === undefined) {
        return unloadedState;
    }

    const action = incomingAction as KnownAction;
    switch (action.type) {
        case 'REQUEST_LISTS':
            return {
                lists: state.lists,
                isLoading: true
            };
        case 'RECEIVE_LISTS':
            // Only accept the incoming data if it matches the most recent request. This ensures we correctly
            // handle out-of-order responses.
            return {
                lists: action.lists,
                isLoading: false
            };
            break;
    }

    return state;
};
