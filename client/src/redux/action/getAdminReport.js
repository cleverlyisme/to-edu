import { getAdminReport } from "../../utils/api/fetchData"
import setLoading from "./setLoading"

export default () => async (dispatch) => {
    dispatch(setLoading(true))

    try {
        const res = await getAdminReport()
        dispatch(setLoading(false))
        dispatch({
            type: "SET_STUDENT_OFF",
            payload: res.data.studentOff,
        })
        return res.data
    } catch (err) {
        console.log(err.message)
        dispatch(setLoading(false))
    }
}
