import axios from "axios"
import { USER_API_END_POINT } from "../utils/constants"
import { useEffect } from "react"
import { useDispatch } from "react-redux";
import { getMyProfile, getOtherUsers } from "../redux/userSlice";

const useOtherusers = (id)=>{
    const dispatch = useDispatch();
    useEffect(()=>
    {
        if (!id) {
            console.log("ID is undefined");
            return;
        }

        const fatchOtherusers = async () =>{
            try {
                const res = await axios.get(`${USER_API_END_POINT}/otheruser/${id}`,
                    {
                        withCredentials:true
                    }
                );
                console.log(res);
                dispatch(getOtherUsers(res.data.OtherUsers));
            } catch (error) {
                console.log(error);
            }
        }
        fatchOtherusers();
        
    },[id]);
     
};

export default useOtherusers;