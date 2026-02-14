import { Injectable } from "@angular/core";

@Injectable({providedIn:'root'})
export class SessionService{
    private username = '';

    setUsername(name:string){
        this.username = name;
    }

    getUsername():string{
        return this.username
    }
}