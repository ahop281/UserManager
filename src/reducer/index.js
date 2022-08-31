import { ADD_USER, DELETE_USER, FETCH_ERROR, FETCH_PENDING, FETCH_SUCCESS, UPDATE_USER } from "../constaints";

// Initial state
const initialState = {
    users: [],
    pending: false,
    error: null,
}

function reducer(state = initialState, action) {
    switch(action.type) {
        case FETCH_PENDING:
            return {
                ...state,
                pending: true,
                error: null,
            }
        case FETCH_SUCCESS:
            const newState = {
                ...state,
                pending: false,
                error: null
            }
            if(!!action.payload)
                newState.users = action.payload
            return newState
        case FETCH_ERROR:
            return {
                ...state,
                pending: false,
                error: action.payload
            }
        case ADD_USER:
            const newUser = {
                id: 'add-user',
                name: '',
                email: '',
                dob: '',
                address: '',
            }
            return {
                ...state,
                users: [newUser, ...state.users]
            }
        case UPDATE_USER:
            return {
                ...state,
                users: state.users.map(user => user.id === action.payload?.id ? action.payload : user)
            }
        case DELETE_USER:
            return {
                ...state,
                users: state.users.filter(user => user.id !== action.payload)
            }

        default:
            break;
    }
}

export const getUsers = state => state?.users
export const getPending = state => state?.pending
export const getError = state => state?.error

export default reducer