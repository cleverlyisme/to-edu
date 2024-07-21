import { teacherGetStudentOff } from "../../utils/api/fetchData"
import setLoading from "./setLoading"

export default () => async (dispatch) => {
    dispatch(setLoading(true))

    try {
        const res = await teacherGetStudentOff()
        dispatch({
            type: "SET_STUDENT_OFF",
            payload: res.data,
        })
        dispatch(setLoading(false))
    } catch (err) {
        console.log(err.message)
        dispatch(setLoading(false))
    }
}
