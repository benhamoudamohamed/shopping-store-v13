import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class FileApiService {

  constructor(private http: HttpClient, private authService: AuthService) { }

  uploadSingle(file: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file);
    return this.authService.request('POST', `api/upload/single`, formData)
  }

  uploadMultiple(High: File, Low: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('High', High)
    formData.append('Low', Low)
    return this.authService.request('POST', `api/upload/multiple`, formData)
  }

  deleteSingle(fileName: string): Observable<any> {
    return this.authService.requestWithImages('DELETE', `api/upload/${fileName}`)
  }

  deleteMultiple(High: string, Low: string): Observable<any> {
    return this.authService.requestWithImages('DELETE', `api/upload/${High}/${Low}`)
  }
}
