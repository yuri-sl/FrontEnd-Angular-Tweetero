import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { Observable } from "rxjs";

@Injectable({providedIn: 'root'})
export class TweetService{
    constructor(private api:ApiService){}

    private postNewTweet(body:any):Observable<any>{
        return this.api.post('/tweet',body);
    }

    private getAllTweets():Observable<any>{
        return this.api.get('/tweet');
    }
}