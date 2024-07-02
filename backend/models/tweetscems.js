import mongoose from "mongoose"

const tweetSchema = new mongoose.Schema(
    {
        description:{
            type:String,
            required:true
        },
        like:{
            type:Array,
            default:[]
            
        },
        userId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        userDetails:{
            type: Array,
            //ref: "User"
            default:[]
        },
        image: {
            type: String, // You can store the image URL or path as a string
            default: null
        },
        comment:{
            type:Array,
            default:[]
        }
       
        

    },{timestamps:true}
)

export const Tweet = mongoose.model("Tweet",tweetSchema);