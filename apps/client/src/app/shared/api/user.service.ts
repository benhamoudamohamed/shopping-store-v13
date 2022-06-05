import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../interface/user';
import { Observable } from 'rxjs';
import { Activatetoken, ResetPasswordType, UserRole } from '@shoppingstore/api-interfaces';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserApiService {

  constructor(private http: HttpClient, private authService: AuthService) { }

  getAll(role: UserRole): Observable<User[]>  {
    return this.authService.request('GET', `api/user/all?role=${role}`)
  }

  getByPage(page: number, limit: number, role: UserRole): Observable<User[]>  {
    return this.authService.request('GET', `api/user?page=${page}&size=${limit}&role=${role}`)
  }

  getOne(id: string): Observable<User>  {
    return this.authService.request('GET', `api/user/${id}`)
  }

  findbyMail(data: User): Observable<User>  {
    return this.authService.request('POST', `api/user/findbyemail`, data)
  }

  register(data: User): Observable<User> {
    return this.authService.request('POST', `api/user/register`, data)
  }

  activate(data: Activatetoken): Observable<User> {
    return this.authService.requestWithoutToken('POST', `api/user/activation`, data)
  }

  updateName(id: string, data: User): Observable<User> {
    return this.authService.request('PUT', `api/user/updatename/${id}`, data)
  }

  sendVerificationCode(data: string): Observable<User>  {
    return this.authService.requestWithoutToken('POST', `api/user/sendVerificationCode`, data)
  }
  verifyCode(data: ResetPasswordType): Observable<User> {
    return this.authService.requestWithoutToken('POST', `api/user/verifyCode`, data)
  }
  resetPassowrd(data: ResetPasswordType): Observable<User> {
    return this.authService.requestWithoutToken('POST', `api/user/resetPassowrd`, data)
  }

  delete(id: string): Observable<User> {
    return this.authService.request('DELETE', `api/user/${id}`)
  }
}
