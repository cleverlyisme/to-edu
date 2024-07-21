export default (
    state = {
        studentOff: [],
    },
    action
) => {
    switch (action.type) {
        case "SET_STUDENT_OFF":
            return {
                ...state,
                studentOff: action.payload,
            }

        default:
            return state
    }
}
