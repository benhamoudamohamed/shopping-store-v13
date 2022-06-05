import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NbMenuService } from '@nebular/theme';
import { environment } from '../../../environments/environment';
import { CookieService } from 'ngx-cookie-service';
import { ChangingThemeService } from '../../shared/theme.service';

@Component({
  selector: 'shoppingstore-storehome',
  templateUrl: './storehome.component.html',
  styleUrls: ['./storehome.component.scss']
})
export class StorehomeComponent implements OnInit {

  date: Date;
  prodStore: any
  cartItem: any = 0;
  isthemeChanged!: boolean;
  cookieCartItem: string = environment.cookieCartItem

  items = [
    { title: 'فئة المنتجات', link: 'store/shop' },
    { title: 'المفضلة', link: 'store/collection' },
  ];

  responsiveitemlists = [
    { title: 'الصفحة الرئيسية', link: 'store' },
    { title: 'المتجر', children: this.items},
    { title: 'معلومات عنا', link: 'store/about' },
    { title: 'اتصل بنا', link: 'store/contact' },
  ]

  constructor(private nbMenuService: NbMenuService,
    private changingThemeService: ChangingThemeService,
    private cookieService: CookieService,
    private router: Router) {
    this.date = new Date();

    const getCurrent = this.changingThemeService.getCurrent()
    getCurrent === 'dark' ? this.isthemeChanged = true : this.isthemeChanged = false

    this.cartItem = this.cookieService.get(this.cookieCartItem) || 0

    setInterval(() => {
      this.cartItem = this.cookieService.get(this.cookieCartItem) || 0
    }, 1000)
  }

  ngOnInit() {
    this.nbMenuService.onItemClick().subscribe((res) => {
      this.router.navigate([res.item.link])
    });
  }

  changeTheme() {
    this.isthemeChanged = !this.isthemeChanged
    this.isthemeChanged ? this.changingThemeService.setThemes('dark') : this.changingThemeService.setThemes('default')
  }
}
