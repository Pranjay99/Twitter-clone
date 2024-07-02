import axios from "axios";
import { TWEET_API_END_POINT } from "../utils/constants";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMyProfile } from "../redux/userSlice";
import { getTweet } from "../redux/tweetSlice";
import store from "../redux/store";


const useGetMyTweet = (id) => {
    const dispatch = useDispatch();
    const {refresh, isActive} = useSelector(store=>store.tweet);
    console.log(id);

    const fetchAllTweets = async () => {
        if (!id) {
            console.log("ID is undefined");
            return;
        }

        try {
        
            const res = await axios.get(`${TWEET_API_END_POINT}/alltweets/${id}`, {
                withCredentials: true,
            });
            console.log(id);
            console.log(res.data.tweets);
            dispatch(getTweet(res.data.tweets));
        } catch (error) {
            console.log(error);
        }
    };
    const followingTweetHandler = async () => { 
        try {
            axios.defaults.withCredentials = true;
            const res = await axios.get(`${TWEET_API_END_POINT}/followerstweets/${id}`);
            console.log(res);
            dispatch(getTweet(res.data.tweets));
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if(isActive){
            fetchAllTweets();
        }else{
            followingTweetHandler();
        }
    }, [isActive,refresh]);
};

export default useGetMyTweet;
