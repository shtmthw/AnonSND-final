import mong, {Schema , Document} from 'mongoose'

export interface Messages extends Document{
    content : string
    ,date : Date
}

const msgSchema : Schema<Messages> = new Schema({
    content : {
        type : String,
        required : true,
    },
    date : {
        type : Date,
        required : true,
        default : Date.now
    }
})

export interface User extends Document{
    username : string,
    password : string,
    email : string,
    verifyCode : string,
    verifyCodeExpiry : Date,
    isAcceptingMsg : Boolean,
    isVerified : Boolean,
    messages : Messages[]
}

const userSchema : Schema<User> = new Schema({
    username :{
        type : String,
        required : true
    },
    password : {
        type :String , 
        required : true
    },
    email : {
        type:String,
        required : true
    },
    isVerified:{
        type : Boolean,
        required : true
    },
    verifyCode : {
        type : String,
        required : true
    },
    verifyCodeExpiry : {
        type : Date , 
        required : true
    },
    isAcceptingMsg:{
        type : Boolean,
        required : true
    },
    messages : [msgSchema]
        
})

export const UserModel = (mong.models.User as mong.Model<User>) || mong.model<User>('User' , userSchema)
export const MessageModel = (mong.models.Message as mong.Model<Messages>) || mong.model<Messages>('Message' , msgSchema)
