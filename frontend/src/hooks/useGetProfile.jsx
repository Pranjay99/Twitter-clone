import axios from "axios";
import { USER_API_END_POINT } from "../utils/constants";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getMyProfile, getUser } from "../redux/userSlice";

const useGetProfile = (id) => {
    const dispatch = useDispatch();
    //console.log(id);

    useEffect(() => {
        const fetchMyProfile = async () => {
            if (!id) {
                console.log("ID is undefined");
                return;
            }

            try {
            
                const res = await axios.get(`${USER_API_END_POINT}/profile/${id}`, {
                    withCredentials: true,
                });
                //console.log(res);
                dispatch(getMyProfile(res.data.user));
                //dispatch(getUser(res.data.user));

            } catch (error) {
                console.log(error);
            }
        };

        fetchMyProfile();
    }, [id, dispatch]);
};

export default useGetProfile;
