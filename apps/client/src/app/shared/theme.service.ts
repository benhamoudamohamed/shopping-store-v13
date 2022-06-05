import { Injectable } from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChangingThemeService {

  constructor(private themeService: NbThemeService, private cookieService: CookieService) { }

  getCurrent() {
    return this.themeService.currentTheme;
  }

  setThemes(value: string) {
    const cookieTheme = environment.cookieTheme
    this.cookieService.set(cookieTheme, value, {path: '/', secure: true, sameSite: 'Lax'})
    return this.themeService.changeTheme(value)
  }
}
