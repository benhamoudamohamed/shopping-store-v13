import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NbToastrService } from '@nebular/theme';
import { environment } from '../../../environments/environment';
import { CookieService } from 'ngx-cookie-service';
import { Subject, takeUntil } from 'rxjs';
import { ProductApiService } from '../../shared/api/product.service';
import { Product } from '../../shared/interface/product';
import SwiperCore, { EffectFade, Navigation, Pagination, Autoplay, Controller, SwiperOptions, Thumbs, Zoom } from 'swiper';
SwiperCore.use([EffectFade, Navigation, Pagination, Autoplay, Controller, Thumbs, Zoom ]);

@Component({
  selector: 'shoppingstore-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit, OnDestroy  {

  cookieProductListOnCart: string = environment.cookieProductListOnCart
  cookieCartItem: string = environment.cookieCartItem
  loadingSpinner!: boolean;
  product!: Product;
  id: string;
  isInList!: boolean
  productListOnCart: any = []
  cartItem: any = 0
  disableButton!: boolean;
  destroy$ = new Subject();


  images: Array<{id: number, medium: string, large: string}> = []
  screen_lg = '761px';
  screen_md = '760px';
  defaultImage = 'assets/carousel/cover.jpg';

  thumbsSwiper!: any;

  config1: SwiperOptions = {
    slidesPerView: 1,
    loop: true,
    navigation: {
      hideOnClick: true,
      disabledClass: "swiper-button-disabled"
    },
    pagination: { clickable: false },
    zoom: {
      maxRatio: 3,
      minRatio: 1,
    },
    // autoplay: {
    //   delay: 1500,
    //   disableOnInteraction: false,
    // },
  };

  config2: SwiperOptions = {
    slidesPerView: 4,
    spaceBetween: 10,
    loop: true,
    freeMode: true,
    watchSlidesProgress: true,
  };

  image: any

  color!:string




  constructor(private productApiService: ProductApiService, private elementRef: ElementRef,
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

    this.images = [
      {
        id: 1,
        medium: 'assets/carousel/cover.jpg',
        large: 'assets/carousel/cover.jpg'
      },
      {
        id: 2,
        medium: 'assets/carousel/douche.jpg',
        large: 'assets/carousel/douche.jpg'
      },
      {
        id: 3,
        medium: 'assets/carousel/sabbala2.jpg',
        large: 'assets/carousel/sabbala2.jpg'
      },
      {
        id: 4,
        medium: 'assets/carousel/lavabo.jpg',
        large: 'assets/carousel/lavabo.jpg'
      },
      {
        id: 5,
        medium: 'assets/carousel/bain.jpg',
        large: 'assets/carousel/bain.jpg'
      },
      {
        id: 6,
        medium: 'assets/carousel/wc.jpg',
        large: 'assets/carousel/wc.jpg'
      },
    ]

    this.color = 'red';
  }



  ngOnInit() {
    this.getProduct()

    const element = this.elementRef.nativeElement.querySelectorAll('.image');
    if (element) {
      element.forEach((res: any) => {
        res.addEventListener('mousemove', (e: any)=> {
          const width = element[0].offsetWidth;
          const height = element[0].offsetHeight;
          const mouseX = e.offsetX;
          const mouseY = e.offsetY;
          const bgPosX = (mouseX / width * 100);
          const bgPosY = (mouseY / height * 100);
          element[0].style.backgroundPosition = `${bgPosX}% ${bgPosY}%`;
          console.log(element[0].style.backgroundPosition)


          const css = 'div img:hover{ background-size: 175%; }';
          const style = document.createElement('style');
          style.appendChild(document.createTextNode(css));
          element[0].appendChild(style);


        });
      })
    }
  }

  logInfo() {
    console.log("Image clicked");
  }

  getProduct() {
    this.loadingSpinner = true;
    this.productApiService.getOne(this.id)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (data: Product) =>  {
        this.product = data
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
