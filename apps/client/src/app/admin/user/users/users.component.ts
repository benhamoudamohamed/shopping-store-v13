import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { UserRole } from '@shoppingstore/api-interfaces';
import { CookieService } from 'ngx-cookie-service';
import { Subject, takeUntil } from 'rxjs';
import { environment } from 'apps/client/src/environments/environment';
import { UserApiService } from '../../../shared/api/user.service';
import { User } from '../../../shared/interface/user';

export interface TabsType {
  id: number;
  title: string;
  icon: string;
}

@Component({
  selector: 'shoppingstore-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit, OnDestroy {

  columnsItems = ['id', 'name', 'userRole', 'isActivated', 'view'];
  tableDataSource: Array<User>;
  itemsPagination = [];
  users!: User[];
  searchedKeyword: string;
  totalItems: number;
  currentPage: number;
  limit: number;
  loadingSpinner = false;
  destroy$ = new Subject();
  role!: UserRole;
  tabsTitles: Array<TabsType>;

  adminUser!: UserRole
  userRole: string;
  selectedCompany!: any;

  constructor(private userApiService: UserApiService,
    private cookieService: CookieService,
    private router: Router) {
    this.tableDataSource = []
    this.tabsTitles = []
    this.currentPage = 1
    this.limit = 20
    this.totalItems = 0
    this.searchedKeyword = ''

    this.adminUser = UserRole.ADMIN
    const role = environment.cookieUserRole
    this.userRole = this.cookieService.get(role)
  }

  ngOnInit() {
    this.tabsTitles = [
      {id: 1, title: 'المشرفون', icon: 'people-outline'},
      {id: 2, title: 'العمال', icon: 'people-outline'},
    ]
  }

  onchangeTab(e: any) {
    if(e.tabId === '1') {
      this.role = UserRole.ADMIN
      this.currentPage = 1
      this.getByPage(this.currentPage, this.role)
    }
    if(e.tabId === '2') {
      this.role = UserRole.USER
      this.currentPage = 1
      this.getByPage(this.currentPage, this.role)
    }
  }

  getByPage(page: number, role: UserRole) {
    this.loadingSpinner = true;
    role = this.role
    page = this.currentPage
    this.userApiService.getByPage(page, this.limit, role)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (data: any) =>  {
        this.tableDataSource = data.items
        this.totalItems = data.meta.totalItems
        this.loadingSpinner = false;
      },
      error: (e) => console.error(e),
    })
  }

  create() {
    this.router.navigateByUrl(`admin/user/create`)
  }

  view(id: string) {
    this.router.navigateByUrl(`admin/user/detail/${id})`)
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
