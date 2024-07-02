import React, { useState } from 'react';
import Avatar from 'react-avatar';
import { FaRegComment, FaRegHeart, FaHeart } from 'react-icons/fa';
import { MdOutlineDeleteOutline } from 'react-icons/md';
import { CiBookmark, CiBookmarkCheck } from 'react-icons/ci';
import axios from 'axios';
import { TWEET_API_END_POINT, USER_API_END_POINT } from '../utils/constants';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { getRefresh } from '../redux/tweetSlice';
import { timeSince } from "../utils/constants";
import { updateUser } from '../redux/userSlice';

const Tweet = ({ tweet }) => {
    const { user, profile } = useSelector(store => store.user);
    const dispatch = useDispatch();
    const [isCommentOpen, setIsCommentOpen] = useState(false); // State to manage comment section visibility
    const [commentText, setCommentText] = useState(''); // State to manage comment text

    const toggleCommentSection = () => {
        setIsCommentOpen(!isCommentOpen);
    };

    const handleCommentSubmit = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.post(`${TWEET_API_END_POINT}/comment/${tweet?._id}`, {
                comment: commentText,
                loggedInUserId: user?._id
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                withCredentials: true
            });
            toast.success(res.data.message);
            setCommentText(''); 
            setIsCommentOpen(false);// Clear comment text after successful submission
            dispatch(getRefresh());
        } catch (error) {
            toast.error(error.response.data.message);
        }
    };

    const likeOrDislikeHandler = async (uid) => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.put(`${TWEET_API_END_POINT}/like/${uid}`, { id: user?._id }, {
                headers: {
                    'Content-Type': "application/json",
                    'Authorization': `Bearer ${token}`
                },
                withCredentials: true
            });
            dispatch(getRefresh());
            toast.success(res.data.message);
        } catch (error) {
            toast.success(error.response.data.message);
            dispatch(getRefresh());
        }
    };

    
    const bookmarkHandler = async (uid) => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.put(`${USER_API_END_POINT}/bookmark/${uid}`, { id: user?._id }, {
                headers: {
                    'Content-Type': "application/json",
                    'Authorization': `Bearer ${token}`
                },
                withCredentials: true
            });
            console.log(res.data);
            dispatch(getRefresh());
            dispatch(updateUser(res.data.user));
            dispatch(getRefresh());
            toast.success(res.data.message);
        } catch (error) {
            toast.error(error.response.data.message);
            dispatch(getRefresh());
        }
    };

    const bookhandler= async(uid) => {
        dispatch(getRefresh());
        bookmarkHandler(uid);
        dispatch(getRefresh());

    }

    const deleteTweetHandler = async (id) => {
        try {
            axios.defaults.withCredentials = true;
            const res = await axios.delete(`${TWEET_API_END_POINT}/delete/${id}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            dispatch(getRefresh());
            toast.success(res.data.message);
        } catch (error) {
            toast.error(error.response.data.message);
        }
    };

    return (
        <div className='w-[100%] border-b border-gray-300'>
            <div className='flex p-4 w-auto'>
                <Avatar className='mr-2' src={`http://localhost:8080${tweet?.userDetails[0]?.profilePhoto}`} size="40" round={true} />
                <div className='item-center w-full'>
                    <div className='flex item-center'>
                        <h1 className='font-bold mr-2'>{`${tweet?.userDetails[0]?.name}`}</h1>
                        <h2>{` @${tweet?.userDetails[0]?.username} · ${timeSince(tweet?.createdAt)}`}</h2>
                    </div>
                    <div>
                        <p>{tweet?.description}</p>
                    </div>
                    {tweet?.image && (
                        <div className='mt-2'>
                            <img src={`http://localhost:8080${tweet.image}`} alt="Tweet" className='max-h-90 rounded' />
                        </div>
                    )}
                    <div className='flex justify-between p-3'>
                        <div className='flex items-center hover:bg-blue-200 rounded-full px-2 cursor-pointer' onClick={toggleCommentSection}>
                            <FaRegComment size='24px' /> <p className='ml-1'>{tweet?.comment?.length}</p>
                        </div>
                        <div onClick={() => likeOrDislikeHandler(tweet?._id)} className='flex items-center hover:bg-red-200 rounded-full px-2 cursor-pointer'>
                            {tweet?.like.includes(user?._id) ? (
                                <FaHeart size="24px" color='red' />
                            ) : (
                                <FaRegHeart size="24px" />
                            )}
                            <p className='ml-1'>{tweet?.like?.length}</p>
                        </div>
                        <div onClick={() => bookhandler(tweet?._id)} className=' flex items-center hover:bg-green-200  rounded-full px-2 cursor-pointer'>
                            {user?.bookmark.includes(tweet?._id) ? (
                                <CiBookmarkCheck size='24px' color='green' />
                            ) : (
                                <CiBookmark size='24px' />
                            )}
                        </div>
                        {user?._id === tweet?.userId && (
                            <div onClick={() => deleteTweetHandler(tweet?._id)} className='flex items-center'>
                                <div className='p-2 hover:bg-red-300 rounded-full cursor-pointer'>
                                    <MdOutlineDeleteOutline size="24px" />
                                </div>
                            </div>
                        )}
                    </div>
                    {isCommentOpen && (
                        <div className="p-3 border-t border-gray-300">
                            <textarea
                                className="w-full p-2 border border-gray-300 rounded"
                                rows="2"
                                placeholder="Write a comment..."
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                            ></textarea>
                            <button
                                className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600"
                                onClick={handleCommentSubmit}
                            >
                                Post Comment
                            </button>
                            <div>
                        {tweet?.comment?.map((comment, index) => (
                            <div key={index} className='border-b border-gray-200 p-2'>
                              <div className='flex items-center'>
                                            <Avatar className='mr-2' src={`http://localhost:8080${comment?.user?.profilePhoto}`} size="30" round={true} />
                                            <p className='font-bold'>{comment?.user?.name}</p>
                                </div>
                                
                                <p className='ml-6'>{comment?.text}</p>
                            </div>
                        ))}
                    </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Tweet;
