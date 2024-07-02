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
                const token = localStorage.getItem('authToken'); // Retrieve token from storage

    if (!token) {
      throw new Error("No token available");
    }

                const res = await axios.get(`${USER_API_END_POINT}/otheruser/${id}`,
                    {
                        headers: {
                          'Authorization': `Bearer ${token}`,
                          'Content-Type': 'application/json'
                        },       
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
