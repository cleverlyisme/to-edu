import { getEvent } from "../../utils/api/fetchData"
import setLoading from "./setLoading"

export default () => async (dispatch) => {
    dispatch(setLoading(true))

    try {
        const res = await getEvent()
        dispatch({
            type: "SET_EVENT",
            payload: res.data,
        })
        dispatch(setLoading(false))
    } catch (err) {
        console.log(err.message)
        dispatch(setLoading(false))
    }
}
