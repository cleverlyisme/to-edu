export default (state = {
    option: '0px'
}, action) => {
    switch (action.type) {
        case 'CHANGE_OPTION_NAVIGATE':
            return {
                ...state,
                option: action.payload
            }

        default:
            return state
    }
}