export default option => async dispatch => {
    dispatch({
        type: 'CHANGE_OPTION_NAVIGATE',
        payload: option
    })
}