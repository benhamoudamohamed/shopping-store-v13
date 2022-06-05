import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CouponRoutingModule } from './coupon-routing.module';
import { CouponComponent } from './coupon/coupon.component';
import { CouponsComponent } from './coupons/coupons.component';
import { CouponEditComponent } from './coupon-edit/coupon-edit.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgxPaginationModule } from 'ngx-pagination';
import { NebularComponentsModule } from '../../shared/nebular-components.module';
import { SpinnerModule } from '../../spinner/spinner.module';
import { QRCodeModule } from 'angularx-qrcode';

@NgModule({
  declarations: [
    CouponComponent,
    CouponsComponent,
    CouponEditComponent
  ],
  imports: [
    CommonModule,
    CouponRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    Ng2SearchPipeModule,
    NgSelectModule,
    NebularComponentsModule,
    SpinnerModule,
    LazyLoadImageModule,
    QRCodeModule
  ]
})
export class CouponModule { }
