import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NbToastrService } from '@nebular/theme';
import { environment } from '../../../environments/environment';
import { CookieService } from 'ngx-cookie-service';
import { Subject, takeUntil } from 'rxjs';
import { CategoryApiService } from '../../shared/api/category.service';
import { ProductApiService } from '../../shared/api/product.service';
import { Category } from '../../shared/interface/category';
import { Product } from '../../shared/interface/product';

@Component({
  selector: 'shoppingstore-product',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit, OnDestroy  {

  cookieProductListOnCart: string = environment.cookieProductListOnCart
  cookieCartItem: string = environment.cookieCartItem
  loadingSpinner!: boolean;
  category!: Category[]
  products!: Product[]
  product!: Product;
  id: string;
  isInList!: boolean
  productListOnCart: any = []
  cartItem: any = 0
  disableButton!: boolean;
  destroy$ = new Subject();

  constructor(private categoryApiService: CategoryApiService,
    private productApiService: ProductApiService,
    private cookieService: CookieService,
    private toastrService: NbToastrService,
    private router: Router,
    private route: ActivatedRoute) {
    this.id = this.route.snapshot.params['id'];

    this.productListOnCart = this.cookieService.get(this.cookieProductListOnCart) || []
    this.cartItem = this.cookieService.get(this.cookieCartItem) || 0

    if (this.productListOnCart.length !== 0) {
      this.productListOnCart = JSON.parse(this.cookieService.get(this.cookieProductListOnCart))
      this.cartItem = JSON.parse(this.cookieService.get(this.cookieCartItem))
    }
  }

  ngOnInit() {
    this.getProdByCategory()
  }

  getProdByCategory() {
    this.loadingSpinner = true;
    this.categoryApiService.getOne(this.id)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (data: Category) =>  {
        this.products = data.products
        this.loadingSpinner = false;
      },
      error: (e) => console.error(e),
    })
  }

  addTocart(id: string, preventDuplicates: any) {
    this.productApiService.getOne(id)
    .pipe(takeUntil(this.destroy$))
    .subscribe((data: Product) => {
      this.product = data
      this.isInList = this.productListOnCart.includes(this.product.id);

      if(this.isInList) {
        this.toastrService.warning('', `المنتج موجود في السلة`, { preventDuplicates });
        return;
      }
      if(!this.isInList && this.product.isAvailable) {
        this.productListOnCart.push(this.product.id)
        this.cookieService.set(this.cookieProductListOnCart, JSON.stringify(this.productListOnCart), {expires: 30, path: '/', secure: true, sameSite: 'Lax'});
        this.cookieService.set(this.cookieCartItem, JSON.stringify(this.productListOnCart.length), {expires: 30, path: '/', secure: true, sameSite: 'Lax'});
        this.toastrService.success('', `تم إضافة المنتج إلى السلة بنجاح`, { preventDuplicates });
      }
    })
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
