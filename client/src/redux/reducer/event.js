export default (
    state = {
        events: [],
    },
    action
) => {
    switch (action.type) {
        case "SET_EVENT":
            return {
                ...state,
                events: action.payload,
            }

        default:
            return state
    }
}
