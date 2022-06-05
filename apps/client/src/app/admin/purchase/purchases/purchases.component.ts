import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { PurchaseApiService } from '../../../shared/api/purchase.service';
import { Purchase } from '../../../shared/interface/purchase';

@Component({
  selector: 'shoppingstore-purchases',
  templateUrl: './purchases.component.html',
  styleUrls: ['./purchases.component.scss']
})
export class PurchasesComponent implements OnInit, OnDestroy {
  columnsItems = ['id', 'clientName', 'grandTotal', 'view'];
  tableDataSource: Array<Purchase>;
  itemsPagination = [];
  searchedKeyword: string;
  totalItems: number;
  currentPage: number;
  limit: number;
  loadingSpinner = false;
  destroy$ = new Subject();

  constructor(private purchaseApiService: PurchaseApiService, private router: Router) {
    this.tableDataSource = []
    this.currentPage = 1
    this.limit = 20
    this.totalItems = 0
    this.searchedKeyword = ''
  }

  ngOnInit(): void {
    this.loadAll()
  }

  loadAll() {
    this.purchaseApiService.getAll()
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (data: Purchase[]) =>  {
        this.tableDataSource = data
        this.totalItems = data.length
        this.loadingSpinner = false;
      },
      error: (e) => console.error(e),
    })
  }

  getByPage(page: number) {
    this.loadingSpinner = true;
    page = this.currentPage
    this.purchaseApiService.getAll()
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (data: Purchase[]) =>  {
        this.tableDataSource = data
        this.totalItems = data.length
        this.loadingSpinner = false;
      },
      error: (e) => console.error(e),
    })
  }

  view(id: string) {
    this.router.navigateByUrl(`admin/purchase/detail/${id})`)
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
