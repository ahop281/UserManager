import { fetchError, fetchPending, fetchSuccess } from "../actions";

const baseUrl = 'https://localhost:44330/api/Userapi/User'

function fetchData(dispatch) {
    dispatch(fetchPending())
    fetch(`https://localhost:44330/api/Userapi/User/GetAllUsers`)
        .then(res => res.json())
        .then(res => {
            console.log('Res:', res);
            if(res.error) {
                throw (res.error)
            }
            dispatch(fetchSuccess(res))
            return res
        })
        .catch(error => {
            dispatch(fetchError(error))
        })
}

export default fetchData