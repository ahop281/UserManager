import { connect } from "react-redux"
import { bindActionCreators } from "redux"
import { addUser, deleteUser, fetchError, fetchPending, fetchSuccess, updateUser } from "../actions"
import fetchData from "../api"
import Home from "../components/Home"
import { getError, getPending, getUsers } from "../reducer"

const mapStateToProps = state => ({
    users: getUsers(state),
    pending: getPending(state),
    error: getError(state),
})

const mapDispatchToProps = dispatch => ({
    fetchDataPending: () => dispatch(fetchPending()),
    fetchDataSuccess: (res) => dispatch(fetchSuccess(res)),
    fetchDataError: (error) => dispatch(fetchError(error)),
    addUser: () => dispatch(addUser()),
    updateUser: (user) => dispatch(updateUser(user)),
    deleteUser: (id) => dispatch(deleteUser(id)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Home)