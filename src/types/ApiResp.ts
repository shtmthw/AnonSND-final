import { Messages } from "@/model/user";

export interface Apiresp{
    success : Boolean,
    msg : string,
    isAccpetingMsg?: Boolean,
    messages? : Array<Messages>
}