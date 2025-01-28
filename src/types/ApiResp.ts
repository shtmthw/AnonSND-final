import { Messages } from "@/model/user";

export interface Apiresp{
    success : Boolean,
    message : String,
    isAccpetingMsg?: Boolean,
    messages? : Array<Messages>
}