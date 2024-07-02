import React from 'react';
import Tweet from './Tweet';
import { useSelector } from 'react-redux';

const Bookmark = () => {
  const { tweets } = useSelector((store) => store.tweet);
  const { user,profile } = useSelector((store) => store.user);

  console.log('User Bookmarks:', user?.bookmark);
  //console.log('All Tweets:', tweets);

  const bookmarkedTweets = tweets?.filter((tweet) => user?.bookmark.includes(tweet?._id));
  console.log('Bookmarked Tweets:', bookmarkedTweets);

  return (
    <div className='md:w-[50%] w-[85%] border-l border-r border-gray-200'>
      <div className='p-4'>
        <h1 className='text-2xl font-bold'>Bookmarks</h1>
      </div>
      <div>
        {bookmarkedTweets.length > 0 ? (
          bookmarkedTweets.map((tweet) => <Tweet key={tweet?._id} tweet={tweet} />)
        ) : (
          <p className='text-center mt-4'>No bookmarks yet.</p>
        )}
      </div>
    </div>
  );
};

export default Bookmark;
