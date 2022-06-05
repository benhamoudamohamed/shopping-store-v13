import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { Purchase } from '../interface/purchase';
import { PurchaseEdit } from '../interface/purchase-edit';

@Injectable({
  providedIn: 'root'
})
export class PurchaseApiService {

  constructor(private http: HttpClient, private authService: AuthService) { }

  getAll(): Observable<Purchase[]>  {
    return this.authService.request('GET', `api/purchase`)
  }

  getOne(id: string): Observable<Purchase>  {
    return this.authService.request('GET', `api/purchase/${id}`)
  }

  create(data: PurchaseEdit): Observable<Purchase> {
    return this.authService.request('POST', `api/purchase`, data)
  }

  delete(id: string): Observable<Purchase> {
    return this.authService.request('DELETE', `api/purchase/${id}`)
  }
}
