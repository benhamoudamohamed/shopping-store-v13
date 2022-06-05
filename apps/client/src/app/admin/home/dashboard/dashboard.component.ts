import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { NbSidebarService, NbMenuService, NbMenuItem } from '@nebular/theme';
import { UserRole } from '@shoppingstore/api-interfaces';
import { environment } from '../../../../environments/environment';
import { CookieService } from 'ngx-cookie-service';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../../shared/api/auth.service';
import { User } from '../../../shared/interface/user';
import { ChangingThemeService } from '../../../shared/theme.service';

@Component({
  selector: 'shoppingstore-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {

  id = ''
  fullname!: string;
  userRole!: string;
  destroy$ = new Subject();
  isthemeChanged: boolean;

  role: string = environment.cookieUserRole
  name: string = environment.cookieUserName
  ID: string = environment.cookieUserId
  userID!: string;

  selectPlaceholder!: string;

  ishidden!: boolean;

  useritems: NbMenuItem[] = [
    {
      title: 'الملف الشخصي',
      icon: 'person-outline',
      link: `admin/user/detail/${this.id}`,
      home: true
    },
    {
      title: 'تسجيل الخروج',
      icon: 'log-out-outline',
      link: '',
      home: true
    },
  ];

  items: NbMenuItem[] = [
    {
      title: 'الرئيسية',
      icon: 'home-outline',
      link: '/admin/home',
      home: true
    },
    {
      title: 'المستخدمين',
      icon: 'people-outline',
      expanded: false,
      children: [
        {
          title: 'قائمة المستخدمين',
          link: '/admin/user',
        },
        {
          title: 'إنشاء مستخدم جديد',
          link: '/admin/user/create',
          hidden: false,
        }
      ]
    },
    {
      title: 'فئة المنتجات',
      icon: 'list-outline',
      expanded: false,
      hidden: false,
      children: [
        {
          title: 'قائمة الفئات',
          link: '/admin/category',
        },
        {
          title: 'إنشاء فئة جديدة',
          link: '/admin/category/create',
          hidden: false,
        }
      ]
    },
    {
      title: 'المنتجات',
      icon: 'list-outline',
      expanded: false,
      hidden: false,
      children: [
        {
          title: 'قائمة المنتجات',
          link: '/admin/product',
        },
        {
          title: 'إنشاء منتج جديد',
          link: '/admin/product/create',
          hidden: false,
        }
      ]
    },
    {
      title: 'رمز الكوبون',
      icon: 'list-outline',
      expanded: false,
      hidden: false,
      children: [
        {
          title: 'قائمة رمز الكوبون',
          link: '/admin/coupon',
        },
        {
          title: 'إنشاء رمز جديد',
          link: '/admin/coupon/create',
          hidden: false,
        }
      ]
    },
    {
      title: 'طلبات الزبائن',
      icon: 'list-outline',
      expanded: false,
      hidden: false,
      children: [
        {
          title: 'قائمة الطلبات',
          link: '/admin/purchase',
        }
      ]
    },
    {
      title: 'الملف الشخصي',
      icon: 'lock-outline',
      expanded: false,
      children: [
        {
          title: 'الملف الشخصي',
          icon: 'person-outline',
          link: `admin/user/detail/${this.id}`,
          home: true
        },
        {
          title: 'تسجيل الخروج',
          icon: 'log-out-outline',
          link: '',
          home: true
        },
      ]
    },
  ];

  constructor(private sidebarService: NbSidebarService,
    private nbMenuService: NbMenuService,
    private changingThemeService: ChangingThemeService,
    private router: Router,
    private cookieService: CookieService,
    private authService: AuthService) {

    const getCurrent = this.changingThemeService.getCurrent()
    getCurrent === 'dark' ? this.isthemeChanged = true : this.isthemeChanged = false

    this.fullname = this.cookieService.get(this.name)
    this.userRole = this.cookieService.get(this.role)

    this.items.forEach(element => {

      if(this.userRole === UserRole.USER) {
        if(element.children) {
          element.children.forEach(child => {
            if(child.hidden !== undefined) child.hidden = true;
          });
        }
      }
    });
  }

  ngOnInit() {
    this.nbMenuService.onItemClick().subscribe((res) => {
      this.sidebarService.toggle(true)
      if(res.item.title === 'الملف الشخصي') {
        const ID = environment.cookieUserId
        this.userID = this.cookieService.get(ID)
        this.router.navigateByUrl(`admin/user/detail/${this.userID}`).then(() => location.reload());
        this.toggle()
      }
      else if(res.item.title === 'تسجيل الخروج') {
        this.logout()
      }
      else {
        this.router.navigate([res.item.link])
      }
    });

    this.whoami()
  }

  changeTheme() {
    this.isthemeChanged = !this.isthemeChanged
    this.isthemeChanged ? this.changingThemeService.setThemes('dark') : this.changingThemeService.setThemes('default')
  }

  toggle() {
    this.sidebarService.toggle(true);
    return false;
  }

  whoami() {
    this.authService.whoami()
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (data: User) =>  {
        this.id = data.id
        this.fullname = data.fullname;
        this.userRole = data.userRole
        this.cookieService.set(this.ID, data.id, {expires: 7, path: '/', secure: true, sameSite: 'Lax'});
        this.cookieService.set(this.name, data.fullname, {expires: 7, path: '/', secure: true, sameSite: 'Lax'});
        this.cookieService.set(this.role, data.userRole, {expires: 7, path: '/', secure: true, sameSite: 'Lax'});
      },
      error: (e) => console.error(e),
    })
  }

  onChange(event: any) {
    this.router.navigateByUrl('admin').then(()=> location.reload())
  }

  logout() {
    this.authService.logout()
    .pipe(takeUntil(this.destroy$))
    .subscribe()
    this.authService.clearCookies()
    this.router.navigateByUrl('')
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
