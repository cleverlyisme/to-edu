export default (state = {
    status: false
}, action) => {
    switch (action.type) {
        case 'SET_LOADING':
            return {
                ...state,
                status: action.payload
            }

        default:
            return state
    }
}