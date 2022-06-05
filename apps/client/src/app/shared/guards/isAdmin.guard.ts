import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { UserRole } from "@shoppingstore/api-interfaces";
// import * as cryptoJS from 'crypto-js';
import { CookieService } from "ngx-cookie-service";
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class IsAdminGuard implements CanActivate {

  userRole: string;
  decrypt: any;
  private lang: string = environment.lang;

  constructor(private router: Router, private cookieService: CookieService) {
    // this.userRole = Cookies.get('tr_fs_tik');
    // const bytes  = cryptoJS.AES.decrypt(this.userRole, this.lang);
    // this.decrypt = JSON.parse(bytes.toString(cryptoJS.enc.Utf8));

    const name = environment.cookieUserRole
    this.userRole = this.cookieService.get(name);
  }

  canActivate(): boolean {
    if (this.userRole === UserRole.ADMIN) return true;
    if (this.userRole === UserRole.USER) {
      this.router.navigateByUrl('admin/home')
      return false;
    }
    return false;
  }
}
