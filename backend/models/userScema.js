import mongoose from "mongoose"

const userSchema = new mongoose.Schema(
    {
        name:{
            type:String,
            required:true
        },
        username:{
            type:String,
            required:true,
            unique:true
        },
        email:{
            type:String,
            required:true,
            unique:true
        },
        password:{
            type:String,
            required:true
        },
        followers:{
            type:Array,
            default:[]
        },
        following:{
            type:Array,
            default:[]
        },
        bookmark:{
            type:Array,
            default:[]
            
        },
        bio:{
            type:String,
            default: null
        },
        coverPhoto:{
            type:String,
            default:'/upload/default-profile.jpg'
        },
        profilePhoto:{
            type:String,
            default:'/upload/default-profile.jpg'
        },
        location:{
            type:String,
            default:null
        }

    },{timestamps:true}
)

export const User = mongoose.model("User",userSchema);