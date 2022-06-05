import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { ProductApiService } from '../../shared/api/product.service';
import { environment } from '../../../environments/environment';
import { Product } from '../../shared/interface/product';
import { CouponApiService } from '../../shared/api/coupon.service';
import { Coupon } from '../../shared/interface/coupon';
import { PurchaseApiService } from '../../shared/api/purchase.service';

@Component({
  selector: 'shoppingstore-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit, OnDestroy {
  productListOnCart
  products: Array<any>
  id
  cartItem!: any
  destroy$ = new Subject();

  invoice: any = {};
  invoiceForm!: FormGroup;
  invoiceFormSub!: Subscription;
  subTotal!: number;

  coupons!: string;
  message!: string
  submitted!: boolean
  loadingSpinner!: boolean
  queryError!: string;

  couponId!: string;
  userLimit!: number;

  cookieProductListOnCart: string = environment.cookieProductListOnCart
  cookieCartItem: string = environment.cookieCartItem
  quantity!: any
  discount!: any

  constructor(private productApiService: ProductApiService,
    private couponApiService: CouponApiService,
    private purchaseApiService: PurchaseApiService,
    private cookieService: CookieService,
    private formBuilder: FormBuilder,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute) {

    this.products = []
    this.productListOnCart = this.cookieService.get(this.cookieProductListOnCart) || []
    this.cartItem = this.cookieService.get(this.cookieCartItem) || 0

    if (this.productListOnCart.length !== 0) {
      this.productListOnCart = JSON.parse(this.cookieService.get(this.cookieProductListOnCart))
      this.cartItem = JSON.parse(this.cookieService.get(this.cookieCartItem))

      for(let i = 0; i < this.productListOnCart.length; i++) {
        this.id = this.productListOnCart[i]
        this.productApiService.getOne(this.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (res: Product) =>  {
            this.products.push(res)
            this.productItems.push(
              this.formBuilder.group({
                productName: [res.name],
                image: [res.fileURL],
                quantity: [1],
                price: [res.price],
                cost: [res.price]
              })
            );
          },
          error: (e) => {
            if(e.error.message) {
              let errorMessages: Array<string> = []
              errorMessages = e.error.message
              errorMessages.forEach(i => {
                this.queryError = i
              })
            }
            else {
              this.queryError = 'خطأ من الخادم الداخلي'
            }
          },
        })
      }
    }
  }

  ngOnInit() {
    this.buildInvoiceForm(this.invoice);

    // React to coupon value
    this.invoiceForm.valueChanges
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (formValue: any) =>  {
        this.coupons = formValue.coupon
        this.queryError = ''
      },
      error: (e) => {
        if(e.error.message) {
          let errorMessages: Array<string> = []
          errorMessages = e.error.message
          errorMessages.forEach(i => {
            this.queryError = i
          })
        }
        else {
          this.queryError = 'خطأ من الخادم الداخلي'
        }
      },
    })
  }

  buildInvoiceForm(i: any = {}) {
    this.invoiceForm = this.fb.group({
      subtotal: [''],
      coupon: [''],
      discount: [0],
      grandTotal: [''],
      clientName: ['', [Validators.required]],
      phone : ['', [Validators.required]],
      email: ['', [Validators.required]],
      address: ['', [Validators.required]],
      items: this.fb.array((() => {
        if (!i.items) {
          return [];
        }
        return i.items.map((item: any) => this.createItem(item));
      })())
    });
    // LINSTEN FOR VALUE CHANGES AND CALCULATE TOTAL
    if (this.invoiceFormSub) {
      this.invoiceFormSub.unsubscribe();
    }
    this.invoiceFormSub = this.invoiceForm.valueChanges
    .subscribe(formValue => {
      this.subTotal = this.calculateSubtotal(formValue);
    });
  }

  createItem(item: any = {}) {
    return this.fb.group({
      productName: [''],
      image: [''],
      quantity: [''],
      price: [''],
      cost: [''],
    });
  }

  get productItems() {
    return this.invoiceForm.get('items') as FormArray;
  }

  get f() {
    return this.invoiceForm.controls;
  }

  removeItem(i: number) {
    this.productItems.removeAt(i);
     this.productListOnCart.forEach((element: number, index: number)=>{
      element = 1
      if(index === i) this.productListOnCart.splice(index, 1);
    });
    this.cookieService.set(this.cookieProductListOnCart, JSON.stringify(this.productListOnCart), {expires: 30, path: '/', secure: true, sameSite: 'Lax'});
    this.cookieService.set(this.cookieCartItem, JSON.stringify(this.productListOnCart.length), {expires: 30, path: '/', secure: true, sameSite: 'Lax'});
    if(this.productListOnCart.length < 1) {
      window.location.reload();
    }
  }

  calculateSubtotal(invoice: any) {
    let total = 0;
    invoice.items.forEach((i: any) => {
        total += (i.quantity * i.price);
    });
    return total;
  }

  changeQuantity(index: number, increase: boolean) {
    let quantity = this.productItems.value[index].quantity
    const price = this.productItems.value[index].price

    if(increase === true) {
      this.productItems.at(index).patchValue({
        'quantity': quantity + 1,
      })
      quantity = this.productItems.value[index].quantity
      this.productItems.at(index).patchValue({
        'cost': quantity * price,
      })
    }
    else {
      if(quantity >1) {
        this.productItems.at(index).patchValue({
          'quantity': quantity - 1,
        })
        quantity = this.productItems.value[index].quantity
        this.productItems.at(index).patchValue({
          'cost': quantity * price,
        })
      }
    }
    this.invoiceForm.patchValue({
      'subtotal': this.subTotal
    })
  }

  setCodePromo() {
    const data = this.invoiceForm.value;
    this.couponApiService.findbyCode(data.coupon)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (data: Coupon) =>  {
        this.couponId = data.id ?? '';
        this.userLimit = data.userLimit;

        if(!data.expired) {
          this.message = 'رمز الكوبون صحيح'
          this.invoiceForm.patchValue({
            'discount': data.discount,
            'grandTotal': (this.subTotal - (data.discount/100 * this.subTotal)),
          })
        } else if(data.expired) {
          this.message = 'رمز الكوبون منتهي الصلاحية'
          this.invoiceForm.patchValue({
            'coupon': '',
            'discount': 0,
            'grandTotal': this.subTotal,
          })
        }
        this.loadingSpinner = false;
      },
      error: (e) => {
        if(e.error.status === 404) {
          this.message = 'رمز الكوبون غير صحيح'
        }
        else {
          this.message = 'خطأ من الخادم الداخلي أعد المحاولة'
        }
        this.invoiceForm.patchValue({
          'coupon': '',
          'discount': 0,
          'grandTotal': this.subTotal,
        })
      }
    })
  }

  onSubmit() {
    if (this.invoiceForm.invalid) {
      return;
    }
    this.invoiceForm.patchValue({
      'subtotal': this.subTotal,
      'grandTotal': (this.subTotal - (this.invoiceForm.controls['discount'].value/100 * this.subTotal))
    })

    const data = this.invoiceForm.value;
    this.submitted = true;
    this.loadingSpinner = true;

    const items = data.items
    const subtotal = data.subtotal
    const coupon = data.coupon
    const discount = data.discount
    const grandTotal = data.grandTotal
    const clientName = data.clientName
    const phone = data.phone
    const email = data.email
    const address = data.address

    this.purchaseApiService.create({items, subtotal, coupon, discount, grandTotal, clientName, phone, email, address})
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: () =>  {
        if(this.userLimit >= 1) {
          const updateLimit = {} as Coupon;
          updateLimit.userLimit = this.userLimit - 1

          this.couponApiService.updateUserLimit(this.couponId, updateLimit)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (res: Coupon) =>  {
              if(res.userLimit < 1) {
                const data = {
                  code: res.code,
                  discount: res.discount,
                  userLimit: res.userLimit,
                  expired: true,
                }
                this.couponApiService.update(this.couponId, data)
                .pipe(takeUntil(this.destroy$))
                .subscribe({
                  error: (e) => console.error(e),
                })
              }
            },
            error: (e) => console.error(e),
          })
        }
        this.loadingSpinner = false;
        this.submitted = false;
        this.invoiceForm.reset();
        this.cookieService.delete(this.cookieProductListOnCart, '/')
        this.cookieService.delete(this.cookieCartItem, '/')
        window.location.reload();
      },
      error: (e) => {
        this.loadingSpinner = false
        if(e.error.message) {
          let errorMessages: Array<string> = []
          errorMessages = e.error.message
          errorMessages.forEach(i => {
            this.queryError = i
          })
        }
        else {
          console.error(e)
          this.queryError = 'خطأ من الخادم الداخلي'
        }
      }
    })
  }

  keyPressNumbers(event: any) {
    const charCode = (event.which) ? event.which : event.keyCode;
    // Only Numbers 0-9
    if ((charCode < 48 || charCode > 57)) {
      event.preventDefault();
      return false;
    } else {
      return true;
    }
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
