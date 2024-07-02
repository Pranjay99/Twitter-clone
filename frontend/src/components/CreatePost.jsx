import React, { useState } from 'react';
import Avatar from 'react-avatar';
import { CiImageOn } from "react-icons/ci";
import { BsEmojiSmile } from "react-icons/bs";
import axios from 'axios';
import { TWEET_API_END_POINT } from '../utils/constants';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { getRefresh, getisActive } from '../redux/tweetSlice';
import EmojiPicker from 'emoji-picker-react';

const CreatePost = () => {
    const { user } = useSelector(store => store.user);
    const { isActive } = useSelector(store => store.tweet);
    const { profile } = useSelector(store => store.user);
    const dispatch = useDispatch();

    const [description, setDescription] = useState("");
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    const submitHandler = async () => {
        const formData = new FormData();
        formData.append('description', description);
        formData.append('id', user?._id);
        if (image) {
            formData.append('image', image);
        }

        try {
            const res = await axios.post(`${TWEET_API_END_POINT}/create`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true,
            });
            dispatch(getRefresh());
            if (res.data.success) {
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
        }
        setDescription("");
        setShowEmojiPicker(false);
        setImage(null);
        setImagePreview(null);
    }

    const followingHandler = async () => {
        dispatch(getisActive(false));
    }

    const foryouHandler = async () => {
        dispatch(getisActive(true));
    }

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    }

    const triggerFileInput = () => {
        document.getElementById('image-input').click();
    }

    const handleEmojiClick = (emojiObject) => {
        setDescription(prevDescription => prevDescription + emojiObject.emoji);
    };

    return (
        <div className='w-[100%]'>
            <div className='my-3'>
                <div className='flex item-center justify-evenly p-2'>
                    <div onClick={foryouHandler} className={`${isActive ? "border-b-4 border-blue-600 " : null} hover:bg-gray-300 text-center w-full`}>
                        <h1 className='font-semibold text-gray-600 text-lg cursor-pointer'>For you</h1>
                    </div>
                    <div onClick={followingHandler} className={`${!isActive ? "border-b-4 border-blue-600 " : null} hover:bg-gray-300 text-center w-full`}>
                        <h1 className='font-semibold text-gray-600 text-lg cursor-pointer'>Following</h1>
                    </div>
                </div>
            </div>
            <div className='my-4'>
                <div className='flex item-center p-4'>
                    <Avatar src={`https://twitter-clone-backend-vx80.onrender.com${user?.profilePhoto}`} size="40px" round={true} />
                    <input
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className='w-full text-lg mx-2 border-none outline-none'
                        type="text"
                        placeholder='What is Happening?...'
                    />
                </div>
                {imagePreview && (
                    <div className='flex justify-center p-4'>
                        <img src={imagePreview} alt="Preview" className='max-h-64' />
                    </div>
                )}
                <div className='flex justify-between p-4 border-b border-grey-500 '>
                    <div className='flex my-2 mx-4 '>
                        <CiImageOn size="24px" onClick={triggerFileInput} />
                        <input type="file" id="image-input" accept="image/*" style={{ display: 'none' }} onChange={handleImageChange} />
                        <BsEmojiSmile size="22px" onClick={() => setShowEmojiPicker(!showEmojiPicker)} />
                        {showEmojiPicker && (
                            <div className='absolute z-10 mt-6'>
                                <EmojiPicker onEmojiClick={handleEmojiClick} />
                            </div>
                        )}
                    </div>
                    <button onClick={submitHandler} className='bg-blue-400 px-3 py-2 border-none rounded-full py-1 px-3 font-bold text-l text-white '>Post</button>
                </div>
            </div>
        </div>
    );
}

export default CreatePost;
