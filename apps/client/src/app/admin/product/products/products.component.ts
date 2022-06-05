import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Product } from '../../../shared/interface/product';
import { ProductApiService } from '../../../shared/api/product.service';

@Component({
  selector: 'shoppingstore-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit, OnDestroy {
  columnsItems = ['id', 'productCode' , 'name', 'image'];
  tableDataSource: Array<Product>;
  itemsPagination = [];
  searchedKeyword: string;
  totalItems: number;
  currentPage: number;
  limit: number;
  loadingSpinner = false;
  destroy$ = new Subject();

  constructor(private productApiService: ProductApiService,
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

    this.productApiService.getAll()
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (data: Product[]) =>  {
        this.tableDataSource = data
        this.totalItems = data.length
        this.loadingSpinner = false;
      },
      error: (e) => console.error(e),
    })
  }

  create() {
    this.router.navigateByUrl(`admin/product/create`)
  }

  view(id: string) {
    this.router.navigateByUrl(`admin/product/detail/${id})`)
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
