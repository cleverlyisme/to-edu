export default (state = {
    userInformation: {}
}, action) => {
    switch (action.type) {
        case 'SET_USER_INFORMATION':
            return {
                ...state,
                userInformation: action.payload
            }

        default: 
            return state
    }
}