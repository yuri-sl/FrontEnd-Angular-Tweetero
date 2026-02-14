import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { createUserRequest } from "../../dto/user.dto";

@Injectable({providedIn: 'root'})
export class ApiService{
    private readonly baseUrl = 'http://127.0.0.1:8080/';

    constructor(private http:HttpClient){}

    private buildUrl(path: string): string {
        const normalizedPath = path.startsWith('/') ? path : `/${path}`;
        return `${this.baseUrl}${normalizedPath}`;
    }
    post<T>(path:String,body:any):Observable<T>{
        return this.http.post<T>(this.baseUrl+path,body)
    };
    get<T>(path:String):Observable<T>{
        return this.http.get<T>(this.baseUrl+path);
    }
  getPathParam<T>(path: string, parameter: string): Observable<T> {
    const safeParam = encodeURIComponent(parameter);
    return this.http.get<T>(`${this.buildUrl(path)}/${safeParam}`);
  }
    
}