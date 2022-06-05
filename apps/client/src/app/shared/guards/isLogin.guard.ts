import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../api/auth.service';

@Injectable({
  providedIn: 'root'
})
export class IsLogInGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) { }

  canActivate(): boolean {
    if (!this.authService.isAccessTokenExpired()) {
      this.router.navigateByUrl('login')
      return false;
    }
    return true;
  }
}
