import { connect } from "react-redux"
import { addUser, deleteUser, fetchError, fetchPending, fetchSuccess, setSearchFilter, updateUser } from "../actions"
import Home from "../components/Home"
import { getFilter, getPending, getUsers } from "../reducer"

const mapStateToProps = state => ({
    users: getUsers(state),
    pending: getPending(state),
    filter: getFilter(state),
})

const mapDispatchToProps = dispatch => ({
    fetchDataPending: () => dispatch(fetchPending()),
    fetchDataSuccess: (res) => dispatch(fetchSuccess(res)),
    fetchDataError: (error) => dispatch(fetchError(error)),
    addUser: () => dispatch(addUser()),
    updateUser: (user) => dispatch(updateUser(user)),
    deleteUser: (id) => dispatch(deleteUser(id)),
    setSearchFilter: (text) => dispatch(setSearchFilter(text)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Home)