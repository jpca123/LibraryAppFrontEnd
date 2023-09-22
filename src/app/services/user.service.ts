import { Injectable } from '@angular/core';
import User from '../models/User';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { SecurityService } from './security.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  url: string = `${environment.urlBackEnd}/users`;
  urlAuth: string = `${environment.urlBackEnd}/auth`;
  private http: HttpClient;
  private securityService: SecurityService;

  
  constructor (http: HttpClient, securityServ: SecurityService){
      this.http = http;
      this.securityService = securityServ;
  }

  getAll(page?: number, limit?: number): Observable<User>{
    if(!page) page = 1;
    if(!limit) limit = 20;
    let headers: HttpHeaders = this.securityService.getHeadersRequest(true);  
    return this.http.get(`${this.url}/all?page=${page}&limit=${limit}`, {headers});
  }

  get(): Observable<User>{
    let headers: HttpHeaders = this.securityService.getHeadersRequest(true);  
    return this.http.get(`${this.url}/`, {headers});
  }

  create(user: User): Observable<User>{
    return this.securityService.register(user)
  }

  update(user: User): Observable<User>{
    let headers: HttpHeaders = this.securityService.getHeadersRequest(true);  
    return this.http.put(`${this.url}/`, user, {headers});
  }

  delete(): Observable<Object>{
    let headers: HttpHeaders = this.securityService.getHeadersRequest(true);  
    return this.http.delete(`${this.url}/`, {headers});
  }

}