
const logger = reducer => {
    return (state, action) => {
        console.group(action.type)
        console.log('Action: ', action)
        console.log('Prev State: ', state)

        const newState = reducer(state, action)
        console.log('New State: ', newState)
        console.groupEnd()

        return newState
    }
}

export default logger