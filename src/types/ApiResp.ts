import { Messages } from "@/model/user";
import { User } from "@/model/user";

export interface Apiresp{
    success : Boolean,
    msg : string,
    isAcceptingMsg?: Boolean,
    messages? : Array<Messages>,
    username? : string,
    user? : User
}