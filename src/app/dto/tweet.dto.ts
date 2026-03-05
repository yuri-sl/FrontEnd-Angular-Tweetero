import { User } from "../interface/user";

export interface CreateTweetDTO{
    userId: bigint;
    text: string;
}

export interface GetTweetDTO{
    id:bigint;
    text:string;
    user:User;
}