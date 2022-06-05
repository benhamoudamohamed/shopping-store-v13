import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { mergeMap, switchMap, takeUntil } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';
//import * as cryptoJS from 'crypto-js';
import jwt_decode from "jwt-decode";
import { AuthType } from '@shoppingstore/api-interfaces';
import { User } from '../interface/user';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnDestroy {

  // private lang: string = environment.lang;

  cookieTokenName: string = environment.cookieTokenName
  cookieUserId: string = environment.cookieUserId
  cookieUserRole: string = environment.cookieUserRole
  cookieUserName: string = environment.cookieUserName
  cookieCompanyID: string = environment.cookieCompanyID
  expiresIn_T: number = environment.expiresIn_T
  expiresIn_RT: number = environment.expiresIn_RT

  userSubject: Subject<User | null>;
  user: Observable<User | null>;
  refreshTokenTimeout!: any;
  destroy$ = new Subject();

  decoded!: { id: string; email: string; fullname: string; userRole: string; exp: number; iat: number; };
  distance!: number;
  now!: number;

  userRole!: string;
  api!: string;

  constructor(private http: HttpClient, private cookieService: CookieService) {
    this.userSubject = new BehaviorSubject<User | null>(null);
    this.user = this.userSubject.asObservable();
  }

  private auth(authType: string, data: AuthType): Observable<User>  {
    return this.http.post<User>(`${authType}`, data)
    .pipe(mergeMap((user: User) => {
      this.token = user.accessToken;
      return of(user);
    }))
  }

  public request(method: string, endpoint: string, body?: any): Observable<any> {
    return this.http.request(method, endpoint, {body, headers: {authorization: `Bearer ${this.token}`}})
  }
  public requestWithoutToken(method: string, endpoint: string, body?: any): Observable<any> {
    return this.http.request(method, endpoint, {body})
  }
  public requestWithImages(method: string, endpoint: string, body?: any): Observable<any> {
    return this.http.request(method, endpoint, {body, headers: {authorization: `Bearer ${this.token}`}, responseType: 'blob'})
  }

  login(data: AuthType) {
    return this.auth(`api/user/login`, data)
    .pipe(switchMap((user: User)=> {
      this.userSubject.next(user);
      this.startTimer();
      return of(user);
    }))
  }

  whoami(): Observable<User>  {
    return this.request('GET', `api/user/find/whoami`)
  }

  refreshToken() {
    return this.request('POST', `api/user/refresh`, { withCredentials: true })
    .pipe(switchMap((user: User)=> {
      this.userSubject.next(user);
      return of(user);
    }))
  }

  logout(): Observable<User>  {
    return this.request('POST', `api/user/logout`)
    .pipe(switchMap((user: User)=> {
      this.userSubject.next(null);
      this.clearCookies()
      return of(user);
    }))
  }

  clearCookies() {
    this.cookieService.delete(this.cookieTokenName, '/')
    this.cookieService.delete(this.cookieUserId, '/')
    this.cookieService.delete(this.cookieUserRole, '/')
    this.cookieService.delete(this.cookieUserName, '/')
    this.cookieService.delete(this.cookieCompanyID, '/')
    this.stopTimer();
  }

  Init() {
    return new Promise<void>((resolve, reject) => {
      try {
        if(this.token) {
          this.startTimer();
          resolve();
        }
        resolve();
      }catch(e) {
        reject(e)
      }
    });
  }

  private startTimer() {
    this.refreshTokenTimeout = setInterval(()=> {
      this.decoded = jwt_decode(this.token);
      this.now =  new Date().getTime();
      this.distance = this.decoded.exp*1000 - this.now

      const days = Math.floor(this.distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((this.distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const mins = Math.floor((this.distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((this.distance % (1000 * 60)) / 1000);

      console.log(days, 'days', hours, 'h', mins, 'm', seconds, 's')

      const timeout = this.distance - 60000

      if(timeout && mins === 0) {
        this.refreshToken()
        .pipe(takeUntil(this.destroy$))
        .subscribe(tokens => {
          this.cookieService.set(this.cookieTokenName, tokens.refreshToken, {expires: this.expiresIn_RT, path: '/', secure: true, sameSite: 'Lax'});
        })
      }
    }, 5000)
  }

  private stopTimer() {
    clearInterval(this.refreshTokenTimeout)
  }

  public isAccessTokenExpired(): boolean {
    if(!this.token) return false;
    this.decoded = jwt_decode(this.token);
    const date = new Date()
    const tokenExpireDate = date.setUTCSeconds(this.decoded.exp)
    if(tokenExpireDate.valueOf() > new Date().valueOf()) return true
    return false
  }

  public get userValue() {
    return this.userSubject
    .pipe(switchMap((user: User | null)=> {
      this.userSubject.next(user);
      return of(user);
    }))
  }

  get token(): string {
    const token = this.cookieService.get(this.cookieTokenName);
    return token;
  }
  set token(value: string) {
    if(value) {
      this.cookieService.set(this.cookieTokenName, value, {expires: this.expiresIn_T, path: '/', secure: true, sameSite: 'Lax'});
    }
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
