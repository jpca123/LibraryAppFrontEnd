import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import User from '../models/User';

@Injectable({
  providedIn: 'root'
})
export class SecurityService {

  url: string = `${environment.urlBackEnd}/auth`
  private session: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private http: HttpClient;

  constructor(http: HttpClient) {
    this.http = http;
    this.validSession();
  }

  getToken(): string | null {
    return localStorage.getItem("token");
  }

  getSessionObserver(): Observable<boolean>{
    return this.session.asObservable();
  }

  getSession(): boolean{
    if(localStorage.getItem("token")) return true;
    return false;
  }

  validSession(){
    if(this.getToken()) this.session.next(true);
  }

  login(userName: string, password: string): Observable<object>{
    return this.http.post(`${this.url}/login`, {userName, password});
  }

  logout(): Observable<object>{
    this.closeSession();
    return this.http.post(`${this.url}/logout`, {});
  }

  createSession(token: string){
    this.session.next(true);
    localStorage.setItem("token", token);
  }

  closeSession(){
    this.session.next(false);
    localStorage.clear();
  }

  getHeadersRequest(includeAuthorization: boolean = false): HttpHeaders{
    let headers: HttpHeaders = new HttpHeaders();
      headers = headers.append("Content-Type", "application/json")
      headers = headers.append("Charset", "utf-8")
    if(includeAuthorization) headers = headers.append("Authorization",`Bearer ${this.getToken() || ""}`);

    console.log({headers})
    return headers;
  }

  register(user: User): Observable<User>{
    let headers: HttpHeaders = this.getHeadersRequest(false);
    return this.http.post(`${this.url}/register`, user, {headers});
  }
}