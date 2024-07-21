import { upgradeSemester } from "../../utils/api/fetchData"
import setLoading from "./setLoading"

export default (data) => async (dispatch) => {
    dispatch(setLoading(true))

    try {
        const res = await upgradeSemester(data)
        dispatch(setLoading(false))
        if (res.status === 200) {
            return res.data
        }

        return false
    } catch (err) {
        console.log(err.message)
        dispatch(setLoading(false))
        return false
    }
}
