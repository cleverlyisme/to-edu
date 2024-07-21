export default payload => async dispatch => {
    dispatch({
        type: 'SET_MODAL',
        payload
    })
}