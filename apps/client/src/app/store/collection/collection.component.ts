import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators'
import { ActivatedRoute, Router } from '@angular/router';
import { NbToastrService } from '@nebular/theme';
import { Product } from '../../shared/interface/product';
import { ProductApiService } from '../../shared/api/product.service';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../../..//environments/environment';

@Component({
  selector: 'shoppingstore-collection',
  templateUrl: './collection.component.html',
  styleUrls: ['./collection.component.scss']
})
export class CollectionComponent implements OnInit, OnDestroy {

  cookieProductListOnCart: string = environment.cookieProductListOnCart
  cookieCartItem: string = environment.cookieCartItem
  loadingSpinner!: boolean;
  products!: Product[]
  product!: Product;
  id: string;
  isInList!: boolean
  productListOnCart: any = []
  cartItem: any = 0
  disableButton!: boolean;
  destroy$ = new Subject();

  constructor(private productApiService: ProductApiService,
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
    this.getFavourites()
  }

  getFavourites() {
    this.loadingSpinner = true;
    this.productApiService.findByFavorite(true)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        this.products = res
        this.loadingSpinner = false;
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

  onClick(id: string) {
    this.router.navigateByUrl(`store/product/${id})`)
  }

  ngOnDestroy() {
    this.destroy$.next(true)
    this.destroy$.complete();
  }
}
