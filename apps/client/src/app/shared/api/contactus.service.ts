import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { Contactus } from '../interface/contactus';

@Injectable({
  providedIn: 'root'
})
export class ContactApiService {

  constructor(private http: HttpClient, private authService: AuthService) { }

  getAll(): Observable<Contactus[]>  {
    return this.authService.request('GET', `api/contactus`)
    // return this.requestWithoutToken('GET', `api/contactus`)
  }

  getOne(id: string): Observable<Contactus>  {
    return this.authService.request('GET', `api/contactus/${id}`)
  }

  create(data: any): Observable<Contactus> {
    return this.authService.requestWithoutToken('POST', `api/contactus`, data)
  }

  delete(id: string): Observable<Contactus> {
    return this.authService.request('DELETE', `api/contactus/${id}`)
  }
}
