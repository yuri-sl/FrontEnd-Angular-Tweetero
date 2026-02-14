import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { Observable } from "rxjs";
import { CreateTweetDTO } from "../../dto/tweet.dto";

@Injectable({providedIn: 'root'})
export class TweetService{
    constructor(private api:ApiService){}

    public postNewTweet(body:CreateTweetDTO):Observable<any>{
        return this.api.post<CreateTweetDTO>('/tweet',body);
    }

    public getAllTweets():Observable<any>{
        return this.api.get('/tweet');
    }
}