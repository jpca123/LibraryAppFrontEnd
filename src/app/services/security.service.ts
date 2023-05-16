import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import User from '../models/User';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SecurityService {

  url: string = `${environment.urlBackEnd}/auth`
  private session: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private http: HttpClient;
  private router: Router;

  constructor(http: HttpClient, router: Router) {
    this.http = http;
    this.router = router;
    this.validSession();
  }

  getToken(): string | null {
    return localStorage.getItem("token");
  }

  getSessionObserver(): Observable<boolean> {
    return this.session.asObservable();
  }

  getSession(): boolean {
    if (localStorage.getItem("token")) return true;
    return false;
  }

  validSession(): boolean {
    let token: string | null = this.getToken();

    if(token !== null) {
      this.session.next(true);
      return true;
    }
    return false;

  }

  login(userName: string, password: string): Observable<object> {
    return this.http.post(`${this.url}/login`, { userName, password });
  }

  logout(): Observable<object> {
    let token: string = this.getToken() || '';
    this.closeSession();
    return this.http.post(`${this.url}/logout`, { token });
  }

  forgotPassword(email: string): Observable<Object>{
    return this.http.post(`${this.url}/forgot_password`, {email});
  }

  createSession(token: string) {
    this.session.next(true);
    localStorage.setItem("token", token);
  }

  closeSession() {
    localStorage.clear();
    this.router.navigate(["/"]);
    this.session.next(false);
  }

  getHeadersRequest(includeAuthorization: boolean = false): HttpHeaders {
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append("Content-Type", "application/json")
    headers = headers.append("Charset", "utf-8")

    if (includeAuthorization) {
      let token: string | null = this.getToken();
      headers = headers.append("Authorization", `Bearer ${token}`);

    }

    console.log({ headers })
    return headers;
  }

  register(user: User): Observable<User> {
    let headers: HttpHeaders = this.getHeadersRequest(false);
    return this.http.post(`${this.url}/register`, user, { headers });
  }
}