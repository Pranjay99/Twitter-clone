import React from 'react'
import { IoMdArrowBack } from "react-icons/io";
import { Link, useParams } from 'react-router-dom';
import Avatar from 'react-avatar'
import { useSelector,useDispatch } from 'react-redux'
import useGetProfile from '../hooks/useGetProfile';
import Tweet from './Tweet'
import axios from "axios";
import { USER_API_END_POINT } from '../utils/constants';
import toast from "react-hot-toast"
import { followingUpdate } from '../redux/userSlice';
import { getRefresh } from '../redux/tweetSlice';
import EditProfile from './EditProfile';
import { useState } from 'react';
import { IoLocationOutline } from "react-icons/io5";





const Profile = () => {
    const {profile} = useSelector(store => store.user);
    const {tweets} = useSelector(store => store.tweet);
    const {user} = useSelector(store => store.user);
    const dispatch = useDispatch();

    const [showEditProfile, setShowEditProfile] = useState(false);




    //const id = "eeefe343" 
    const {id} = useParams();
    console.log(id);
    useGetProfile(id);
    console.log(profile);

    const followAndUnfollowHandler = async () => {
        if(user.following.includes(id)){
            // unfollow
            try {
                axios.defaults.withCredentials = true;
                const res = await axios.post(`${USER_API_END_POINT}/unfollow/${id}`, {id:user?._id});
                console.log(res);
                dispatch(followingUpdate(id));
                dispatch(getRefresh());
                toast.success(res.data.message);
            } catch (error) {
                toast.error(error.response.data.message);
                console.log(error);
            }
            
        }else{
            // follow
            try {
                axios.defaults.withCredentials = true;
                const res = await axios.post(`${USER_API_END_POINT}/follow/${id}`, {id:user?._id});
                console.log(res);
                dispatch(followingUpdate(id));
                dispatch(getRefresh());
                toast.success(res.data.message);
            } catch (error) {
                toast.error(error.response.data.message);
                console.log(error);
            }
        }
    }
    const postCount = tweets.filter(tweet => tweet.userId === profile?._id).length;


  return (
    <div className='md:w-[50%] w-[85%] border-l border-r border-gray-200'>
        <div>
            <div className='flex items-center py-2' >
                <Link to="/" className='p-2 mr-2 rounded-full hover:bg-gray-200'>
                <IoMdArrowBack size="24px"/>
                </Link>
                <div>
                    <div className='flex'>
                    <h1 className='font-bold text-xl'>{profile?.name}</h1>
                    <img className='h-[20px] w-full items-center m-1' src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Twitter_Verified_Badge.svg/800px-Twitter_Verified_Badge.svg.png" alt="" />
                    </div>
                
                <p>{postCount} posts</p>
                </div>
            </div>
            <img className='h-[200px] w-full' src={`https://twitter-clone-backend-vx80.onrender.com${profile?.coverPhoto}`} alt="" />
            <div className='absolute top-52 ml-2 border-4 border-white rounded-full'>
                    <Avatar src={`https://twitter-clone-backend-vx80.onrender.com${profile?.profilePhoto}`} size="120" round={true} />
            </div>
            <div className='text-right m-4'>
            {
                        profile?._id === user?._id ? (
                            <button className='px-4 py-1 hover:bg-gray-200 rounded-full border border-gray-400'  onClick={() => setShowEditProfile(true)}>Edit Profile</button>

                        ) : (
                            <button onClick={followAndUnfollowHandler} className='px-4 py-1 bg-black text-white rounded-full'>{user.following.includes(id) ? "Following" : "Follow"}</button>
                        )
                    }
            </div>
            <div className='m-4'>
                <h1 className='font-bold text-xl'>{profile?.name}</h1>
                <p>{` @${profile?.username}`}</p>
            </div>
            <div className='m-4 text-md'>
                <p>{profile?.bio}</p>
            </div>
            <div className='flex m-3'>
            <IoLocationOutline size='24px' />
            <p className='items-center'>{profile?.location}</p>
            

            </div>
            <div className='flex mx-4 my-1'>
                <p className='mr-3'>{`${profile?.following?.length} Followings`}</p>
                <p>{`${profile?.followers?.length} Followers`}</p>

            </div>
        </div>
        {
          tweets?.map((tweet) => {
            if ((tweet.userId === id  && user.following.includes(id)) || (id === user?._id && tweet.userId === user?._id) ) {
                return <Tweet key={tweet?._id} tweet={tweet} />;
            }
            // else if(tweet.userId === user?._id)
            //     {
            //         return <Tweet key={tweet?._id} tweet={tweet} />;
            //     }
            else{
                return null;
            }
          })
        }
        <EditProfile
        show={showEditProfile}
        onClose={() => setShowEditProfile(false)}
        profile={profile}
      />
    </div>
  )
}

export default Profile
