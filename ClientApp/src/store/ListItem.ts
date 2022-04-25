import { Action, Reducer } from 'redux';
import { AppThunkAction } from '.';

// -----------------
// STATE - This defines the type of data maintained in the Redux store.

export interface ListItemState {
    isLoading: boolean;
    listId?: number;
    listItems: ListItem[];
}

export interface ListItem {
    id: number;
    listId: number;
    name: string;
    description: string;
    image: File;
    imageSrc: string;
}

// -----------------
// ACTIONS - These are serializable (hence replayable) descriptions of state transitions.
// They do not themselves have any side-effects; they just describe something that is going to happen.

interface RequestListItemsAction {
    type: 'REQUEST_LIST_ITEMS';
    listId: number;
}

interface ReceiveListItemsAction {
    type: 'RECEIVE_LIST_ITEMS';
    listId: number;
    listItems: ListItem[];
}

interface RequestInsertListItemAction {
    type: 'REQUEST_INSERT_LIST_ITEM';
    listItem: ListItem;
}

interface ResponseInsertListItemAction {
    type: 'RESPONSE_INSERT_LIST_ITEM';
    listItems: ListItem[];
}

interface RequestUpdateListItemAction {
    type: 'REQUEST_UPDATE_LIST_ITEM';
    listItem: ListItem;
}

interface ResponseUpdateListItemAction {
    type: 'RESPONSE_UPDATE_LIST_ITEM';
    listItems: ListItem[];
}

interface RequestDeleteListItemAction {
    type: 'REQUEST_DELETE_LIST_ITEM';
    id: number;
}

interface ResponseDeleteListItemAction {
    type: 'RESPONSE_DELETE_LIST_ITEM';
    listItems: ListItem[];
}

// Declare a 'discriminated union' type. This guarantees that all references to 'type' properties contain one of the
// declared type strings (and not any other arbitrary string).

type KnownAction = RequestListItemsAction | ReceiveListItemsAction | RequestInsertListItemAction | ResponseInsertListItemAction | RequestUpdateListItemAction | ResponseUpdateListItemAction | RequestDeleteListItemAction | ResponseDeleteListItemAction;

// ----------------
// ACTION CREATORS - These are functions exposed to UI components that will trigger a state transition.
// They don't directly mutate state, but they can have external side-effects (such as loading data).

export const actionCreators = {
    requestListItems: (id: number): AppThunkAction<KnownAction> => (dispatch, getState) => {
        // Only load data if it's something we don't already have (and are not already loading)
        const appState = getState();
        if (appState && appState.listItems && id !== appState.listItems.listId) {
            
            fetch(`list/${id}/items`)
                .then(response => response.json() as Promise<ListItem[]>)
                .then(data => {
                    dispatch({ type: 'RECEIVE_LIST_ITEMS', listItems: data, listId: id });
                });

            dispatch({ type: 'REQUEST_LIST_ITEMS', listId: id });
        }
    },

    insertListItem: (item: ListItem): AppThunkAction<KnownAction> => (dispatch, getState) => {
        let form = new FormData();
        form.append('name', item.name);
        form.append('description', item.description);
        form.append('image', item.image);
        form.append('imageSrc', item.imageSrc);

        const requestOptions = {
            method: 'POST',
            //headers: { 'Content-Type': 'application/json' },
            body: form //JSON.stringify(item)
        };

        fetch(`list/${item.listId}/item`, requestOptions)
            .then(response => response.json() as Promise<ListItem[]>)
            .then(data => {
                dispatch({ type: 'RESPONSE_INSERT_LIST_ITEM', listItems: data });
            });
        
        dispatch({ type: 'REQUEST_INSERT_LIST_ITEM', listItem: item });
    },

    updateListItem: (item: ListItem): AppThunkAction<KnownAction> => (dispatch, getState) => {
        const requestOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(item)
        };

        fetch(`list/${item.listId}/item`, requestOptions)
            .then(response => response.json() as Promise<ListItem[]>)
            .then(data => {
                dispatch({ type: 'RESPONSE_UPDATE_LIST_ITEM', listItems: data });
            });
        
        dispatch({ type: 'REQUEST_UPDATE_LIST_ITEM', listItem: item });
    },

    deleteListItem: (item: ListItem): AppThunkAction<KnownAction> => (dispatch, getState) => {
        const requestOptions = {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(item.id)
        };

        fetch(`list/${item.listId}/item`, requestOptions)
            .then(response => response.json() as Promise<ListItem[]>)
            .then(data => {
                dispatch({ type: 'RESPONSE_DELETE_LIST_ITEM', listItems: data });
            });
        
        dispatch({ type: 'REQUEST_DELETE_LIST_ITEM', id: item.id });
    }
};

// ----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.

const unloadedState: ListItemState = { listItems: [], isLoading: false };

export const reducer: Reducer<ListItemState> = (state: ListItemState | undefined, incomingAction: Action): ListItemState => {
    if (state === undefined) {
        return unloadedState;
    }

    const action = incomingAction as KnownAction;
    switch (action.type) {
        case 'REQUEST_LIST_ITEMS':
            return {
                listId: action.listId,
                listItems: state.listItems,
                isLoading: true
            };
        case 'RECEIVE_LIST_ITEMS':
            // Only accept the incoming data if it matches the most recent request. This ensures we correctly
            // handle out-of-order responses.
            if (action.listId === state.listId) {
                return {
                    listId: action.listId,
                    listItems: action.listItems,
                    isLoading: false
                };
            }
            break;
        case 'REQUEST_INSERT_LIST_ITEM':
            return {
                listItems: state.listItems,
                isLoading: true
            };
        case 'RESPONSE_INSERT_LIST_ITEM':
            return {
                listItems: action.listItems,
                isLoading: false
            };
        case 'REQUEST_UPDATE_LIST_ITEM':
            return {
                listItems: state.listItems,
                isLoading: true
            };
        case 'RESPONSE_UPDATE_LIST_ITEM':
            return {
                listItems: action.listItems,
                isLoading: false
            };
        case 'REQUEST_DELETE_LIST_ITEM':
            return {
                listItems: state.listItems,
                isLoading: true
            };
        case 'RESPONSE_DELETE_LIST_ITEM':
            return {
                listItems: action.listItems,
                isLoading: false
            };
    }

    return state;
};
