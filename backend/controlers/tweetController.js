import { Tweet } from "../models/tweetscems.js";
import { User } from "../models/userScema.js";
import multer from 'multer';
import path from 'path';

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'uploads/'); // 'uploads/' is the directory where files will be saved
//     },
//     filename: (req, file, cb) => {
//         cb(null, `${Date.now()}-${file.originalname}`);
//     }
// });

// const upload = multer({ storage });



export const createTweet = async (req, res) => {
    try {
        const { description, id } = req.body;

        if (!description || !id) {
            return res.status(401).json({
                message: "Fields are required",
                success: false
            });
        }

        const user = await User.findById(id).select("-password");

        const newTweet = new Tweet({
            description,
            userId: id,
            userDetails: user,
            image: req.file ? `/uploads/${req.file.filename}` : null // Save the image path if file is uploaded
        });

        await newTweet.save();

        return res.status(201).json({
            message: "Tweet created successfully",
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Server error",
            success: false
        });
    }
}

export const deleteTweet = async (req,res) =>{
    try {
        const {id} = req.params;
        await Tweet.findByIdAndDelete(id);
        return res.status(200).json({
            message:"Tweet deleted successfully",
            success:true
        })
    } catch (error) {
        console.log(error);
    }
}

export const likeorDislike = async (req,res) => {
    try {
        const loggedInUserId = req.body.id;
        const tweetId = req.params.id;
        const tweet = await Tweet.findById(tweetId);
        if(tweet.like.includes(loggedInUserId)){
            await Tweet.findByIdAndUpdate(tweetId,{$pull:{like:loggedInUserId}})
            return res.status(401).json({
                message:"usser dislike your tweet",
                success:true
            })
        }
        else
        {
            await Tweet.findByIdAndUpdate(tweetId,{$push:{like:loggedInUserId}})
            return res.status(401).json({
                message:"usser like your tweet",
                success:true
            })
        }
    } catch (error) {
        console.log(error);
    }
}

export const postComment = async (req, res) => {
    try {
        const { loggedInUserId, comment } = req.body;
        const tweetId = req.params.id;

        // Find the tweet by ID
        const tweet = await Tweet.findById(tweetId);
        const user = await User.findById(loggedInUserId).select("-password");


        if (!tweet) {
            return res.status(404).json({ message: 'Tweet not found' });
        }

        // Update the tweet document to add the new comment
        await Tweet.findByIdAndUpdate(tweetId, { $push: { comment: { user: user, text: comment } } });

        return res.status(201).json({ message: 'Comment added successfully', success: true });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};


export const getAllTweet = async (req,res) =>{

    try {
        const id = req.params.id;
        const loggedInUser = await User.findById(id);
        const loggedInUsertweet = await Tweet.find({userId:id})
        const followingUsertweet = await Promise.all(loggedInUser.following.map((otherUsersId)=>{
            return Tweet.find({userId:otherUsersId});
        }));
        return res.status(200).json({
            tweets:loggedInUsertweet.concat(...followingUsertweet)
        })
    } catch (error) {
        console.log(error);
    }
}

export const getfollowingTweet = async (req,res) =>{

    try {
        const id = req.params.id;
        const loggedInUser = await User.findById(id);
        const followingUsertweet = await Promise.all(loggedInUser.following.map((otherUsersId)=>{
            return Tweet.find({userId:otherUsersId});
        }));
        return res.status(200).json({
            tweets:[].concat(...followingUsertweet)
        })
    } catch (error) {
        console.log(error);
    }
}

