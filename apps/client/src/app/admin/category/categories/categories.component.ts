import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { UserRole } from '@shoppingstore/api-interfaces';
import { CookieService } from 'ngx-cookie-service';
import { Category } from '../../../shared/interface/category';
import { environment } from '../../../../environments/environment';
import { CategoryApiService } from '../../../shared/api/category.service';

@Component({
  selector: 'shoppingstore-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit, OnDestroy {
  columnsItems = ['id', 'name', 'image'];
  tableDataSource: Array<Category>;
  itemsPagination = [];
  searchedKeyword: string;
  totalItems: number;
  currentPage: number;
  limit: number;
  loadingSpinner = false;
  destroy$ = new Subject();
  adminUser!: UserRole
  userRole: string;

  cookieCompanyID: string = environment.cookieCompanyID
  selectedCompany!: string;

  constructor(private categoryApiService: CategoryApiService,
    private cookieService: CookieService,
    private router: Router) {

    this.tableDataSource = []
    this.currentPage = 1
    this.limit = 20
    this.totalItems = 0
    this.searchedKeyword = ''

    this.adminUser = UserRole.ADMIN
    const role = environment.cookieUserRole
    this.userRole = this.cookieService.get(role)
  }

  ngOnInit() {
    this.getByPage(1)
  }

  getByPage(page: number) {
    this.loadingSpinner = true;
    page = this.currentPage
    this.categoryApiService.getAll()
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (data: Category[]) =>  {
        this.tableDataSource = data
        this.totalItems = data.length
        this.loadingSpinner = false;
      },
      error: (e) => console.error(e),
    })
  }

  create() {
    this.router.navigateByUrl(`admin/category/create`)
  }

  view(id: string) {
    this.router.navigateByUrl(`admin/category/detail/${id})`)
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
