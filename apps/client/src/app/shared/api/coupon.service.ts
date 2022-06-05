import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { Coupon } from '../interface/coupon';
import { CouponEdit } from '../interface/coupon-edit';

@Injectable({
  providedIn: 'root'
})
export class CouponApiService {

  constructor(private http: HttpClient, private authService: AuthService) { }

  getAll(): Observable<Coupon[]>  {
    return this.authService.request('GET', `api/coupon`)
  }

  getOne(id: string): Observable<Coupon>  {
    return this.authService.request('GET', `api/coupon/${id}`)
  }

  findbyCode(id: string): Observable<Coupon>  {
    return this.authService.requestWithoutToken('GET', `api/coupon/findByCoupon/${id}`)
  }

  create(data: CouponEdit): Observable<Coupon> {
    return this.authService.request('POST', `api/coupon`, data)
  }

  update(id: string, data: CouponEdit): Observable<Coupon> {
    return this.authService.request('PUT', `api/coupon/${id}`, data)
  }

  updateUserLimit(id: string, data: Coupon): Observable<Coupon> {
    return this.authService.request('PUT', `api/coupon/${id}/userLimit`, data)
  }

  delete(id: string): Observable<Coupon> {
    return this.authService.request('DELETE', `api/coupon/${id}`)
  }
}
