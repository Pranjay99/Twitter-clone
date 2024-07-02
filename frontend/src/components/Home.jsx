import React,{useEffect} from 'react';
import Leftbar from './Leftbar';
import Feed from './Feed';
import Rightside from './Rightside';
import { Outlet, useNavigate } from 'react-router-dom';
import useGetProfile from '../hooks/useGetProfile';
import { useSelector } from 'react-redux';
import useOtherusers from '../hooks/useOtherusers';
import useGetMyTweet from '../hooks/useGetMyTweet';

const Home = () => {
  const { user, otherUsers } = useSelector(store => store.user);
    const navigate = useNavigate();


  useEffect(()=>{
    if (!user) {
      navigate("/login");
    }
  },[]);

  useOtherusers(user?._id);
  useGetMyTweet(user?._id);

  return (
    <div className='flex justify-between md:w-[80%] w-full mx-auto'>
        <Leftbar />
        <Outlet />
        <div className="hidden md:block md:w-[25%] ">
        <Rightside otherUsers={otherUsers} />
        </div>
    </div>
  );
}

export default Home;
