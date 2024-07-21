import axios from "axios";
import { BASE_URL } from "../../utils/constant";
import setLoading from "./setLoading";
import setUserInformation from "./setUserInformation";

export default (loginInfo) => async (dispatch) => {
    dispatch(setLoading(true));

    try {
        const res = await axios.post(`${BASE_URL}login`, loginInfo, {
            timeout: 3000,
        });

        if (res.status === 200) {
            dispatch(setUserInformation(res.data));
            localStorage.setItem("access_token", res.data.access_token);
            localStorage.setItem("refresh_token", res.data.refresh_token);
            localStorage.setItem("access_from", res.data.access_from);
            dispatch(setLoading(false));
            return true;
        } else {
            dispatch(setLoading(false));
            throw new Error("Log in failed");
        }
    } catch (err) {
        console.log(err.message);
        dispatch(setLoading(false));
    }

    dispatch(setLoading(false));
};
