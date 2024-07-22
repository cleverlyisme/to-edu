import { getStudentFees } from "../../utils/api/fetchData";
import setLoading from "./setLoading";

export default (
    { searchString = "", filterStatus = "", currentPage = 0 },
    id
  ) =>
  async (dispatch) => {
    dispatch(setLoading(true));

    try {
      const res = await getStudentFees(
        {
          searchString,
          filterStatus,
          currentPage,
        },
        id
      );
      dispatch(setLoading(false));
      return res.data;
    } catch (err) {
      console.log(err.message);
    }

    dispatch(setLoading(false));
  };
