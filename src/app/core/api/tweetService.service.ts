import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { Observable } from "rxjs";
import { CreateTweetDTO } from "../../dto/tweet.dto";

@Injectable({providedIn: 'root'})
export class TweetService{
    constructor(private api:ApiService){}

    public postNewTweet(body:CreateTweetDTO):Observable<CreateTweetDTO>{
        return this.api.post<CreateTweetDTO>('tweets',body);
    }

    public getAllTweets():Observable<any>{
        return this.api.get('tweets');
    }

    public getAllTweetsFromUser(userId:string):Observable<any>{
        return this.api.get<any>('tweets/user/'+userId)
    }
}