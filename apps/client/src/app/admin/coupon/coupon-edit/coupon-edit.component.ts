import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { CouponApiService } from '../../../shared/api/coupon.service';
import { Coupon } from '../../../shared/interface/coupon';
import { CouponEdit } from '../../../shared/interface/coupon-edit';

@Component({
  selector: 'shoppingstore-coupon-edit',
  templateUrl: './coupon-edit.component.html',
  styleUrls: ['./coupon-edit.component.scss']
})
export class CouponEditComponent implements OnInit, OnDestroy {

  title!: string;
  form!: FormGroup;
  id!: string;
  code!: string;
  discount!: number;
  userLimit!: number;
  expired!: boolean;
  destroy$ = new Subject();

  submitted = false;
  queryError!: string;
  loadingSpinner = false;
  itemId!: string;

  constructor(private couponApiService: CouponApiService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      code : ['', [Validators.required]],
      discount : ['', [Validators.required]],
      userLimit : ['', [Validators.required]],
      expired : [''],
    });

    this.itemId = this.route.snapshot.params['id'];

    this.form.valueChanges.subscribe(() => {
      this.queryError = ''
    });

    this.title = 'إنشاء كوبون'
    this.form.setValue({
      code: '',
      discount: '',
      userLimit: '',
      expired: ''
    });
    if(this.itemId !== undefined) {
      this.title = 'تحديث كوبون'
      this.couponApiService.getOne(this.itemId)
        .pipe(takeUntil(this.destroy$))
        .subscribe((res: Coupon) => {
          this.id = res.id;
          this.form.setValue({
            code: res.code,
            discount: res.discount,
            userLimit: res.userLimit,
            expired: res.expired,
          });
      })
    } else {
      this.title = 'إنشاء كوبون'
      this.form.setValue({
        code: this.generateRandomCode(6),
        discount: 0,
        userLimit: 0,
        expired: false,
      });
    }
  }

  get f() {
    return this.form.controls;
  }

  onSubmit() {
    this.submitted = true;
    const data = this.form.value;
    if (this.form.invalid) {
      return;
    }
    this.loadingSpinner = true;
    if(this.itemId !== undefined) {
      this.update(this.itemId, data)
    } else {
      this.create(data)
    }
  }
  create(data: Coupon) {
    this.couponApiService.create(data)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: () =>  {
        this.form.reset();
        this.router.navigateByUrl('admin/coupon')
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
    this.submitted = false;
    this.loadingSpinner = false;
  }

  update(id: string, data: CouponEdit) {
    this.couponApiService.update(id, data)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: () =>  {
        this.form.reset();
        this.router.navigateByUrl('admin/coupon')
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
    this.submitted = false;
    this.loadingSpinner = false;
  }

  generateRandomCode(length: number) {
    const result = [];
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
      result.push(characters.charAt(Math.floor(Math.random() * charactersLength)));
    }
    return result.join('');
  }

  isExpiredEvent(expired: boolean) {
    this.expired = expired;
  }

  goBack() {
    this.location.back();
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
