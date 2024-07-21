import setLoading from "./setLoading"
import { getSemester } from "../../utils/api/fetchData"

export default () => async (dispatch) => {
    try {
        dispatch(setLoading(true))

        const res = await getSemester()

        dispatch({
            type: "SET_TIME",
            payload: res.data,
        })

        dispatch(setLoading(false))
    } catch (err) {
        dispatch(setLoading(false))
    }
}
