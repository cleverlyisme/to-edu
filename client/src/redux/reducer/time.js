export default (
    state = {
        semester: null,
        year: null,
    },
    action
) => {
    switch (action.type) {
        case "SET_TIME":
            return {
                ...state,
                ...action.payload,
            }

        default:
            return state
    }
}
