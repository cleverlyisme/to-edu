import { getAllHighlight } from "../../utils/api/fetchData"
import setLoading from "./setLoading"

export default (searchString = "", currentPage = 0) => async (dispatch) => {
    dispatch(setLoading(true))

    try {
        const res = await getAllHighlight(searchString, currentPage)
        dispatch(setLoading(false))
        return res.data
    } catch (err) {
        console.log(err.message)
        dispatch(setLoading(false))
    }
}
