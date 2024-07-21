export default (state = {
    isOpen: false,
    type: null,
    message: null,
    onConfirm: null
}, action) => {
    switch (action.type) {
        case 'SET_MODAL': 
            return {
                ...state,
                ...action.payload
            }

        default: 
            return state
    }
}