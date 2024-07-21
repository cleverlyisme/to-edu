import { sendMessageToMainTeacher } from "../../utils/api/fetchData"
import setLoading from "./setLoading"

export default (data) => async (dispatch) => {
    dispatch(setLoading(true))

    try {
        await sendMessageToMainTeacher(data)
        dispatch(setLoading(false))
    } catch (err) {
        console.log(err.message)
        dispatch(setLoading(false))
    }
}
