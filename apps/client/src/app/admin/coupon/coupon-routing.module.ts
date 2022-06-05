import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CouponEditComponent } from './coupon-edit/coupon-edit.component';
import { CouponComponent } from './coupon/coupon.component';
import { CouponsComponent } from './coupons/coupons.component';

const routes: Routes = [
  { path: 'coupon', data : {title: 'List of Coupon'}, component: CouponsComponent },
  { path: 'coupon/detail/:id', data : {title: 'Coupon details'}, component: CouponComponent },
  { path: 'coupon/create', data : {title: 'Create Coupon'}, component: CouponEditComponent },
  { path: 'coupon/edit/:id', data : {title: 'Edit Coupon'}, component: CouponEditComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CouponRoutingModule { }
