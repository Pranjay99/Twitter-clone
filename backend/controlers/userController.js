import bcryptjs from "bcryptjs"
import { User } from "../models/userScema.js";
import jwt from "jsonwebtoken"
import { Tweet } from "../models/tweetscems.js";
import upload from "../config/upload.js";

export const Register = async(req,res) =>{
    try{
        const {name,username,email,password} = req.body;
        //check all fileds are filled or not
        if(!name || !username || !email || !password)
            {
                 return res.status(401).json({
                    message:"All fileds are required",
                    success:false
                 })
            }
            //check if user already exist or not
            const user = await User.findOne({email});
            if(user)
                {
                    return res.status(401).json({
                        message:"User already exist",
                        success:false
                    })
                }
            // hash the password for security
            const hashedPassword = await bcryptjs.hash(password,16);

            // create new user
            await User.create({
                name,
                username,
                email,
                password:hashedPassword
            });

            return res.status(200).json({
                message:"Account created successfully. ",
                success:true
            })
    } catch(error) {
        console.log(error);
    }
}

export const Login = async (req,res) =>{

    try{
        const {email,password} = req.body;

        if(!email || !password)
            {
                return res.status(401).json({
                    message:"All files are required",
                    success:false
                })
               
            }
        const user = await User.findOne({email});
    
        if(!user)
            {
                return res.status(401).json({
                    message:"user dont have account",
                    success:false
                })
            }
        
        const isMatch = await bcryptjs.compare(password,user.password);
    
        if(!isMatch)
            {
                return res.status(401).json({
                    message:"Incorrect email Id or password",
                    success:false
                })
            }
            const tokenData ={
                userId:user._id
            }
        const token = await jwt.sign(tokenData,process.env.TOKEN_SECRET,{expiresIn:"1d"})
    
        return res.status(200).cookie("token",token,{expiresIn:"1d",httpOnly:true}).json({
            message:`welcome back ${user.name}`,
            token,
            user,
            success:true
        })
    } catch(error) {
        console.log(error);
    }
        

   
}

export const logout = (req, res) => {
    return res.cookie("token", "", { expiresIn: new Date(Date.now()) }).json({
        message: "user logged out successfully.",
        success: true
    })
}

export const bookmarks = async (req,res) => {
    try {
        const loggedInUserId = req.body.id;
        const tweetId = req.params.id;
        const user = await User.findById(loggedInUserId);
        if(user.bookmark.includes(tweetId)){
            await User.findByIdAndUpdate(loggedInUserId,{$pull:{bookmark:tweetId}})
            return res.status(200).json({
                user,
                message:"user dis bookmarked your tweet",
                success:true
            })
        }
        else
        {
            await User.findByIdAndUpdate(loggedInUserId,{$push:{bookmark:tweetId}})
            return res.status(200).json({
                user,
                message:"Saved to bookmark",
                success:true
            })
        }
    } catch (error) {
        console.log(error);
    }
}

export const getMyProfile = async (req,res) => {
    try {
        const id = req.params.id;
        console.log("Received ID:", id);  // Log the received ID

        // Check if the ID is a valid ObjectId
        // if (!mongoose.Types.ObjectId.isValid(id)) {
        //     return res.status(400).json({ message: "Invalid user ID" });
        // }
        const user = await User.findById(id).select("-password");

        return res.status(200).json({
            user
        })
    } catch (error) {
        console.log(error);
    }
}

export const updateProfile = async (req, res) => {
    upload.fields([
      { name: 'coverPhoto', maxCount: 1 },
      { name: 'profilePhoto', maxCount: 1 }
    ])(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ message: "File upload error", success: false });
      }
  
      try {
        const id = req.params.id;
        const { name, username, bio, location } = req.body;
  
        if (!name || !username) {
          return res.status(400).json({
            message: "Name and username are required",
            success: false
          });
        }
  
        const updateData = {
          name,
          username,
          bio,
          location
        };
  
        if (req.files.coverPhoto) {
          updateData.coverPhoto = `/uploads/${req.files.coverPhoto[0].filename}`;
        }
  
        if (req.files.profilePhoto) {
          updateData.profilePhoto = `/uploads/${req.files.profilePhoto[0].filename}`;
        }
  
        const updatedUser = await User.findByIdAndUpdate(
          id,
          { $set: updateData },
          { new: true, runValidators: true }
        ).select("-password");
  
        if (!updatedUser) {
          return res.status(404).json({
            message: "User not found",
            success: false
          });
        }
  
        return res.status(200).json({
          message: "Profile updated successfully",
          success: true,
          user: updatedUser
        });
  
      } catch (error) {
        console.error(error);
        return res.status(500).json({
          message: "Internal server error",
          success: false
        });
      }
    });
  };

export const getOtherUsers = async (req,res) => {
    try {
        const {id} = req.params;
        const OtherUsers = await User.find({_id:{$ne:id}}).select("-password")
        if(!OtherUsers)
            {
                return res.status(401).json({
                    message:"Currently do not have any user",
                    success:false
                })
            }

        return res.status(200).json({
            OtherUsers
        })
    } catch (error) {
        console.log(error);
    }
}


export const follow = async(req,res) =>{
    try {
        const loggedInUserId = req.body.id;
        const userId = req.params.id;
        const loggedInUser = await User.findById(loggedInUserId);
        const user = await User.findById(userId);
        if(!user.followers.includes(loggedInUserId))
            {
                await user.updateOne({$push:{followers:loggedInUserId}});
                await loggedInUser.updateOne({$push:{following:userId}});

            }
        else{
            return res.status(400).json({
                message:`User already followed to ${user.name}`
            })
        }

        return res.status(200).json({
            message: `${loggedInUser.name} just followed to ${user.name}`,
            success:true
        })

    } catch (error) {
        console.log(error);
    }
}

export const unfollow = async (req,res) =>
    {
        try {
        const loggedInUserId = req.body.id;
        const userId = req.params.id;
        const loggedInUser = await User.findById(loggedInUserId);
        const user = await User.findById(userId);
        if(!loggedInUser.followers.includes(userId))
            {
                await user.updateOne({$pull:{followers:loggedInUserId}});
                await loggedInUser.updateOne({$pull:{following:userId}});

            }
        else{
            return res.status(400).json({
                message:`User not followed ${user.name}`
            })
        }

        return res.status(200).json({
            message: `${loggedInUser.name} just unfollowed to ${user.name}`,
            success:true
        })

        } catch (error) {
            console.log(error);
        }
    }

