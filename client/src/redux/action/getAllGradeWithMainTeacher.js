import { getAllGradeWithMainTeacher } from "../../utils/api/fetchData"
import setLoading from "./setLoading"

export default () => async (dispatch) => {
    dispatch(setLoading(true))

    try {
        const res = await getAllGradeWithMainTeacher()
        dispatch(setLoading(false))
        return res.data
    } catch (err) {
        console.log(err.message)
    }

    dispatch(setLoading(false))
}
