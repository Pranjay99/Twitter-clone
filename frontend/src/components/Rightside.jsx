import React, { useState } from 'react';
import { CiSearch } from "react-icons/ci";
import Avatar from 'react-avatar';
import { Link } from 'react-router-dom';

const Rightside = ({ otherUsers }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Ensure otherUsers is initialized as an empty array if it's null or undefined
  if (!otherUsers) {
    otherUsers = [];
  }

  const filteredUsers = otherUsers.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const displayUsers = searchTerm ? filteredUsers : otherUsers.slice(0, 5);

  return (
    <div className='w-0 hidden md:block md:w-full'>
      <div className='flex p-3 bg-gray-200 items-center rounded-full mt-2'>
        <div className='mr-2'><CiSearch size='24px' /></div>
        <input
          className="bg-gray-200 border-none outline-none"
          type='text'
          placeholder='Search'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className='p-4 bg-gray-200 rounded-xl mt-2'>
        <h1 className='font-bold text-lg'>Who to follow</h1>
        {
          displayUsers.map((user) => (
            <div key={user._id} className='flex items-center justify-between my-3'>
              <div className='flex p-1 '>
                <Avatar src={`https://twitter-clone-backend-vx80.onrender.com${user.profilePhoto}`} size="40px" round={true} />
                <div className='ml-2 items-center'>
                  <h1 className='font-bold'>{user.name}</h1>
                  <p className='text-sm -my-1'>{`@${user.username}`}</p>
                </div>
              </div>
              <div className='items-center py-2'>
                <Link to={`/profile/${user._id}`}>
                  <button className='px-3 py-1 bg-black text-white rounded-full'>Profile</button>
                </Link>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  );
}

export default Rightside;
