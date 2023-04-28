import { Injectable } from '@angular/core';
import Category from '../models/Category';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { SecurityService } from './security.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  url: string = `${environment.urlBackEnd}/categories`;
  private http: HttpClient;
  private securityService: SecurityService;

  
  constructor (http: HttpClient, securityServ: SecurityService){
      this.http = http;
      this.securityService = securityServ;
  }

  getAll(page?: number, limit?: number): Observable<Category>{
    if(!page) page = 1;
    if(!limit) limit = 20;
    let headers: HttpHeaders = this.securityService.getHeadersRequest(true);  
    return this.http.get(`${this.url}?page=${page}&limit=${limit}`, {headers});
  }

  get(id: string): Observable<Category>{
    let headers: HttpHeaders = this.securityService.getHeadersRequest(true);  
    return this.http.get(`${this.url}/${id}`, {headers});
  }

  create(category: Category): Observable<Category>{
    let headers: HttpHeaders = this.securityService.getHeadersRequest(true);  
    return this.http.post(this.url, category, {headers});
  }

  update(id: string, category: Category): Observable<Category>{
    let headers: HttpHeaders = this.securityService.getHeadersRequest(true);  
    return this.http.put(`${this.url}/${id}`, category, {headers});
  }

  delete(id: string): Observable<Object>{
    let headers: HttpHeaders = this.securityService.getHeadersRequest(true);  
    return this.http.delete(`${this.url}/${id}`, {headers});
  }

}