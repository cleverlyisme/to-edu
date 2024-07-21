import { getClassTranscript } from "../../utils/api/fetchData"
import setLoading from "./setLoading"

export default (classRoom) => async (dispatch) => {
    dispatch(setLoading(true))

    try {
        const res = await getClassTranscript(classRoom)
        dispatch(setLoading(false))
        return res.data
    } catch (err) {
        console.log(err.message)
        dispatch(setLoading(false))
    }
}
