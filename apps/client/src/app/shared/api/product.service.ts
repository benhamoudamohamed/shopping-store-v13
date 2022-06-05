import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { Product } from '../interface/product';
import { ProductEdit } from '../interface/product-edit';

@Injectable({
  providedIn: 'root'
})
export class ProductApiService {

  constructor(private http: HttpClient, private authService: AuthService) { }

  getAll(): Observable<Product[]>  {
    return this.authService.request('GET', `api/product/all`)
  }

  getByPage(page: number, limit: number): Observable<Product[]>  {
    return this.authService.request('GET', `api/product?page=${page}&size=${limit}`)
  }

  getOne(id: string): Observable<Product>  {
    return this.authService.request('GET', `api/product/${id}`)
  }

  findByFavorite(isFavorite: boolean): Observable<Product[]>  {
    return this.authService.requestWithoutToken('GET', `api/product/isFavorite/${isFavorite}`)
  }

  create(data: ProductEdit, catID: string): Observable<Product> {
    return this.authService.request('POST', `api/product/category/${catID}`, data)
  }

  update(id: string, data: ProductEdit, catID: string): Observable<Product> {
    return this.authService.request('PUT', `api/product/${id}/category/${catID}`, data)
  }

  delete(id: string): Observable<Product> {
    return this.authService.request('DELETE', `api/product/${id}`)
  }
}
