import { changePassword } from "../../utils/api/fetchData"
import setLoading from "./setLoading"

export default (data) => async (dispatch) => {
    dispatch(setLoading(true))

    try {
        await changePassword(data)
        dispatch(setLoading(false))
        return true
    } catch (err) {
        console.log(err.message)
        dispatch(setLoading(false))
        return false
    }
}
