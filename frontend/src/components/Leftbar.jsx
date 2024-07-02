import React from 'react';
import { CiHome } from "react-icons/ci";
import { IoMdNotificationsOutline } from "react-icons/io";
import { IoLogIn } from "react-icons/io5";

import { FaSearch } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { FaRegBookmark } from "react-icons/fa";
import { IoLogOut } from "react-icons/io5";
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { USER_API_END_POINT } from '../utils/constants';
import toast from 'react-hot-toast';
import axios from 'axios';
import { getMyProfile, getOtherUsers, getUser } from '../redux/userSlice';

const Leftbar = () => {
  const { user } = useSelector(store => store.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const logouthandler = async () => {
    try {
      const res = await axios.get(`${USER_API_END_POINT}/logout`);
      dispatch(getUser(null));
      dispatch(getOtherUsers(null));
      dispatch(getMyProfile(null));

      navigate('/login');
      toast.success(res.data.message);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className='md:w-[20%] w-[15%]'>
      <div>
        <Link to="/">
          <img className="md:ml-4 ml-2" width="50" src="https://img.freepik.com/free-vector/twitter-new-2023-x-logo-white-background-vector_1017-45422.jpg?size=338&ext=jpg&ga=GA1.1.1141335507.1718755200&semt=ais_user" alt="" />
        </Link>
        <div className='my-4'>
          <Link to="/" className='flex items-center md:my-2 hover:bg-gray-300 rounded-full hover:cursor-pointer md:py-3 md:px-4 p-1 ml-3 my-4'>
            <CiHome size="24px" />
            <span className='font-bold hidden sm:block ml-2'> Home</span>
          </Link>
          <Link to="/trending" className='flex items-center  md:my-2 hover:bg-gray-300 rounded-full hover:cursor-pointer md:py-3 md:px-4 p-1 ml-3 my-4'>
            <FaSearch size="20px" />
            <span className='font-bold hidden sm:block ml-2'> Explore</span>
          </Link>
          <div className='flex items-center my-2 hover:bg-gray-300 rounded-full hover:cursor-pointer md:py-3 md:px-4 p-1 ml-3 my-4'>
            <IoMdNotificationsOutline size="26px" />
            <span className='font-bold hidden sm:block ml-2'> Notification</span>
          </div>
          <Link to={`/profile/${user?._id}`} className='flex items-center md:my-2 hover:bg-gray-300 rounded-full hover:cursor-pointer md:py-3 md:px-4 p-1 ml-3 my-4'>
            <CgProfile size="24px" />
            <span className='font-bold hidden sm:block ml-2'> Profile</span>
          </Link>
          <Link to={`/bookmark`} className='flex items-center md:my-2 hover:bg-gray-300 rounded-full hover:cursor-pointer md:py-3 md:px-4 p-1 ml-3 my-4'>
            <FaRegBookmark size="22px" />
            <span className='font-bold hidden sm:block ml-2'> Bookmark</span>
          </Link>
          <Link to={`/login`} className='flex items-center md:my-2 hover:bg-gray-300 rounded-full hover:cursor-pointer md:py-3 md:px-4 p-1 ml-3 my-4'>
            <IoLogIn  size="22px" />
            <span className='font-bold hidden sm:block ml-2'> login</span>
          </Link>
          <div onClick={logouthandler} className='flex items-center md:my-2 hover:bg-gray-300 rounded-full hover:cursor-pointer md:py-3 md:px-4 p-1 ml-3 my-4'>
            <IoLogOut size="24px" />
            <span className='font-bold hidden sm:block ml-2'> Log out</span>
          </div>
          <button className='bg-blue-400 px-9 py-2 w-full rounded-full font-bold text-white hidden sm:block'>Post</button>
        </div>
      </div>

      {/* Icons for medium and smaller screens */}
      {/* <div className="sm:hidden">
        <Link to="/" className='flex items-center my-2 hover:bg-gray-300 rounded-full hover:cursor-pointer py-3 px-4'>
          <CiHome size="24px" />
        </Link>
        <Link to="/trending" className='flex items-center my-2 hover:bg-gray-300 rounded-full hover:cursor-pointer py-3 px-4'>
          <FaSearch size="20px" />
        </Link>
        <div className='flex items-center my-2 hover:bg-gray-300 rounded-full hover:cursor-pointer py-3 px-4'>
          <IoMdNotificationsOutline size="26px" />
        </div>
        <Link to={`/profile/${user?._id}`} className='flex items-center my-2 hover:bg-gray-300 rounded-full hover:cursor-pointer py-3 px-4'>
          <CgProfile size="24px" />
        </Link>
        <Link to={`/bookmark`} className='flex items-center my-2 hover:bg-gray-300 rounded-full hover:cursor-pointer py-3 px-4'>
          <FaRegBookmark size="22px" />
        </Link>
        <div onClick={logouthandler} className='flex items-center my-2 hover:bg-gray-300 rounded-full hover:cursor-pointer py-3 px-4'>
          <IoLogOut size="24px" />
        </div>
      </div> */}
    </div>
  )
}

export default Leftbar;
