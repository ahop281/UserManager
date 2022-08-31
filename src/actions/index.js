import { ADD_USER, DELETE_USER, FETCH_ERROR, FETCH_PENDING, FETCH_SUCCESS, UPDATE_USER } from "../constaints"

export const fetchPending = () => {
    return {
        type: FETCH_PENDING
    }
}

export const fetchSuccess = (res) => {
    return {
        type: FETCH_SUCCESS,
        payload: res
    }
}

export const fetchError = (error) => {
    return {
        type: FETCH_ERROR,
        payload: error
    }
}

export const addUser = (data) => {
    return {
        type: ADD_USER,
        payload: data
    }
}

export const updateUser = (data) => {
    return {
        type: UPDATE_USER,
        payload: data
    }
}

export const deleteUser = (data) => {
    return {
        type: DELETE_USER,
        payload: data
    }
}