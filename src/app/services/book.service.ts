import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import Book from '../models/Book';
import { SecurityService } from './security.service';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  url: string = `${environment.urlBackEnd}/books`;
  private http: HttpClient;
  private securityService: SecurityService


  constructor(http: HttpClient, securityServ: SecurityService) {
    this.http = http;
    this.securityService = securityServ;
  }

  getAll(page?: number, limit?: number): Observable<Book> {
    if (!page) page = 1;
    if (!limit) limit = 20;

    let headers: HttpHeaders = this.securityService.getHeadersRequest();
    return this.http.get(`${this.url}?page=${page}&limit=${limit}`, {headers});
  }

  getByTitle(title: string, page?: number, limit?: number): Observable<Book>{
    if(!page) page = 1;
    if(!limit) limit = 20;

    let headers: HttpHeaders = this.securityService.getHeadersRequest();
    return this.http.get(`${this.url}/title/${title}?page=${page}&limit=${limit}`, {headers});
  }

  getByCategory(category: string, page?: number, limit?: number): Observable<Book>{
    if(!page) page = 1;
    if(!limit) limit = 20;

    let headers: HttpHeaders = this.securityService.getHeadersRequest();
    return this.http.get(`${this.url}/category/${category}?page=${page}&limit=${limit}`, {headers});
  }

  getByAuthor(author: string, page?: number, limit?: number): Observable<Book>{
    if(!page) page = 1;
    if(!limit) limit = 20;

    let headers: HttpHeaders = this.securityService.getHeadersRequest();
    return this.http.get(`${this.url}/author/${author}?page=${page}&limit=${limit}`, {headers});
  }

  get(id: string): Observable<Book> {
    let headers: HttpHeaders = this.securityService.getHeadersRequest();
    return this.http.get(`${this.url}/${id}`, {headers});
  }

  create(formData: FormData): Observable<Book> {
    let headers: HttpHeaders = new HttpHeaders({
      "enctype": "multipart/form-data",
      "authorization": `Bearer ${this.securityService.getToken() || ""}`,
    });
    return this.http.post(this.url, formData, {headers});
  }
  
  update(id: string, formData: FormData): Observable<Book> {
    let headers: HttpHeaders = new HttpHeaders({
      "enctype": "multipart/form-data",
      "authorization": `Bearer ${this.securityService.getToken() || ""}`,
    });
    return this.http.put(`${this.url}/${id}`, formData, {headers});
  }

  delete(id: string): Observable<Object> {
    let headers: HttpHeaders = this.securityService.getHeadersRequest(true);
    return this.http.delete(`${this.url}/${id}`, {headers});
  }

}