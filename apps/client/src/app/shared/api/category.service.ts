import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { Category } from '../interface/category';
import { CategoryEdit } from '../interface/categorygroup-edit';

@Injectable({
  providedIn: 'root'
})
export class CategoryApiService {

  constructor(private http: HttpClient, private authService: AuthService) { }

  getAll(): Observable<Category[]>  {
    return this.authService.request('GET', `api/category/all`)
  }

  getByPage(page: number, limit: number): Observable<Category[]>  {
    return this.authService.request('GET', `api/category?page=${page}&size=${limit}`)
  }

  getOne(id: string): Observable<Category>  {
    return this.authService.request('GET', `api/category/${id}`)
  }

  create(data: CategoryEdit): Observable<Category> {
    return this.authService.request('POST', `api/category`, data)
  }

  update(id: string, data: CategoryEdit): Observable<Category> {
    return this.authService.request('PUT', `api/category/${id}`, data)
  }

  delete(id: string): Observable<Category> {
    return this.authService.request('DELETE', `api/category/${id}`)
  }
}
