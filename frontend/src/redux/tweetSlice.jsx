import { createSlice } from "@reduxjs/toolkit";

const tweetSlice = createSlice({
  name: "tweet",
  initialState: {
    tweets: null,
    refresh: false,
    isActive: true,
  },
  reducers: {
    // multiple actions
    getTweet: (state, action) => {
      state.tweets = action.payload;
    },
    getRefresh: (state) => {
      state.refresh = !state.refresh;
    },
    getisActive: (state, action) => {
      state.isActive = action.payload;
    },
    updateUserDetailsInTweets: (state, action) => {
      if (state.tweets) {
        state.tweets = state.tweets.map((tweet) => {
          if (tweet.userId === action.payload._id) {
            return {
              ...tweet,
              user: {
                ...tweet.user,
                name: action.payload.name,
                username: action.payload.username,
                bio: action.payload.bio,
                profilePhoto: action.payload.profilePhoto,
              },
            };
          }
          return tweet;
        });
      }
    },
  },
});

export const { getTweet, getRefresh, getisActive, updateUserDetailsInTweets } = tweetSlice.actions;
export default tweetSlice.reducer;
