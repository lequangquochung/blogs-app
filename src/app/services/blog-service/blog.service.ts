import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/app/environments/environment";
import { Blog } from "../../models/blog/blog.model";
import { IResponseData, SearchRequest } from "../../models/response/response.model";

@Injectable({
    providedIn: 'root'
})

export class BlogService {
    apiBaseUrl = environment.apiUrl;

    constructor(private http: HttpClient) { }

    public getListLabService(searchRequest?: SearchRequest): Observable<Blog[]> {
        return this.http.get<Blog[]>(`${this.apiBaseUrl}`, {
            params: searchRequest
        });
    }

    public getListLabPages(searchRequest?: SearchRequest): Observable<Blog[]> {
        return this.http.get<Blog[]>(`${this.apiBaseUrl}`, {
            params: searchRequest
        })
    }

    public create(payload: Blog): Observable<IResponseData<Blog>> {
        return this.http.post<any>(this.apiBaseUrl, payload)
    }

    public edit(payload: Blog): Observable<IResponseData<Blog>> {
        return this.http.put<any>(`${this.apiBaseUrl}/${payload.id}`, payload);
    }
}