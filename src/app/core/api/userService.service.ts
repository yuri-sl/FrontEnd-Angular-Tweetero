import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { createUserRequest, createUserResponse } from "../../dto/user.dto";
import { Observable } from "rxjs";
import { HealthDTO } from "../../dto/health.dto";

@Injectable({providedIn: 'root'})
export class UserService{
    constructor(private api:ApiService){}



    createUserRequest(createUserDTO: createUserRequest):Observable<createUserResponse>{
        return this.api.post<createUserResponse>('/users',createUserDTO);
    }
    getHealth():Observable<HealthDTO>{
        return this.api.get<HealthDTO>('/users');
    }
    

}