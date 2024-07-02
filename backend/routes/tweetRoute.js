import express from "express"
import multer from 'multer';
import path from 'path';
import { createTweet, deleteTweet, getAllTweet, getfollowingTweet, likeorDislike, postComment } from "../controlers/tweetController.js";
import isAuthenticated from "../config/auth.js";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // 'uploads/' is the directory where files will be saved
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage });

const tweetrouter = express.Router();

tweetrouter.route("/create").post(upload.single('image'), createTweet);
//tweetrouter.route("/delete").post(isAuthenticated ,deleteTweet);
tweetrouter.route("/delete/:id").delete(deleteTweet);
tweetrouter.route("/like/:id").put(likeorDislike);
tweetrouter.route("/alltweets/:id").get(getAllTweet);
tweetrouter.route("/followerstweets/:id").get(getfollowingTweet);
tweetrouter.route("/comment/:id").post(postComment);



//tweetrouter.route("/bookmark/:id").put(isAuthenticated,bookmarks);







export default tweetrouter;
