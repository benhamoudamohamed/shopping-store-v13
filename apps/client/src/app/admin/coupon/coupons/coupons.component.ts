import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { CouponApiService } from '../../../shared/api/coupon.service';
import { Coupon } from '../../../shared/interface/coupon';

@Component({
  selector: 'shoppingstore-coupons',
  templateUrl: './coupons.component.html',
  styleUrls: ['./coupons.component.scss']
})
export class CouponsComponent implements OnInit, OnDestroy {
  columnsItems = ['id', 'code', 'expired', 'view'];
  tableDataSource: Array<Coupon>;
  itemsPagination = [];
  searchedKeyword: string;
  totalItems: number;
  currentPage: number;
  limit: number;
  loadingSpinner = false;
  destroy$ = new Subject();

  constructor(private couponApiService: CouponApiService,
    private router: Router) {

    this.tableDataSource = []
    this.currentPage = 1
    this.limit = 20
    this.totalItems = 0
    this.searchedKeyword = ''
  }

  ngOnInit() {
    this.getByPage(1)
  }

  getByPage(page: number) {
    this.loadingSpinner = true;
    page = this.currentPage
    this.couponApiService.getAll()
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (data: Coupon[]) =>  {
        this.tableDataSource = data
        this.totalItems = data.length
        this.loadingSpinner = false;
      },
      error: (e) => console.error(e),
    })
  }

  create() {
    this.router.navigateByUrl(`admin/coupon/create`)
  }

  view(id: string) {
    this.router.navigateByUrl(`admin/coupon/detail/${id})`)
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
