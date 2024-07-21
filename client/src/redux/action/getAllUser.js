import { getAllUser } from "../../utils/api/fetchData";
import setLoading from "./setLoading";

export default (
    role,
    searchString = "",
    filterClass = "",
    filterGrade = "",
    filterSubject = "",
    currentPage = 0
) => async (dispatch) => {
    dispatch(setLoading(true));

    try {
        const res = await getAllUser(
            role,
            searchString,
            filterClass,
            filterGrade,
            filterSubject,
            currentPage
        );
        dispatch(setLoading(false));
        return res.data;
    } catch (err) {
        console.log(err.message);
    }

    dispatch(setLoading(false));
};
