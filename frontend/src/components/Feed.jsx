import React from 'react'
import CreatePost from './CreatePost'
import Tweet from './Tweet'
import { useSelector } from 'react-redux'


const Feed = () => {
  const {tweets} = useSelector(store => store.tweet);

  return (
    <div className='md:w-[50%] w-[85%] border-r border-l overflow-y-auto border-gray-300'>
      <div className=''>
        <CreatePost/>
        {
          tweets?.map((tweet) => <Tweet key ={tweet?._id} tweet ={tweet} />)
        }

        
       


      </div>
    </div>
  )
}

export default Feed