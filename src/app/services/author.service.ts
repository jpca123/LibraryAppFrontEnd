import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import Author from "../models/Author";
import { environment } from "src/environments/environment";
import { SecurityService } from "./security.service";
import { Injectable } from "@angular/core";


@Injectable({
  providedIn: 'root'
})
export default class AuthorService{
    url: string = `${environment.urlBackEnd}/authors`;
    private http: HttpClient;
    private securityService: SecurityService;

    
    constructor (http: HttpClient, securityServ: SecurityService){
        this.http = http;
        this.securityService = securityServ;
    }

    getAll(page?: number, limit?: number): Observable<Author>{
        if(!page) page = 1;
        if(!limit) limit = 20;

        let headers: HttpHeaders = this.securityService.getHeadersRequest();
        return this.http.get(`${this.url}?page=${page}&limit=${limit}`, {headers});
    }

    get(id: string): Observable<Author>{
        let headers: HttpHeaders = this.securityService.getHeadersRequest();
        return this.http.get(`${this.url}/${id}`, {headers});
    }
    create(author: Author): Observable<Author>{
        let headers: HttpHeaders = this.securityService.getHeadersRequest(true);
        return this.http.post(this.url, author, {headers});
    }

    update(id: string, author: Author): Observable<Author>{
        let headers: HttpHeaders = this.securityService.getHeadersRequest(true);
        return this.http.put(`${this.url}/${id}`, author, {headers});
    }

    delete(id: string): Observable<Object>{
        let headers: HttpHeaders = this.securityService.getHeadersRequest(true);
        return this.http.delete(`${this.url}/${id}`, {headers});
    }

}