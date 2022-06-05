import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './admin/home/dashboard/dashboard.component';
import { EmailactivationComponent } from './authentication/emailactivation/emailactivation.component';
import { LoginComponent } from './authentication/login/login.component';
import { ResetpasswordComponent } from './authentication/resetpassword/resetpassword.component';
import { IsLogInGuard } from './shared/guards/isLogin.guard';
import { AboutComponent } from './store/about/about.component';
import { CartComponent } from './store/cart/cart.component';
import { CollectionComponent } from './store/collection/collection.component';
import { ContactComponent } from './store/contact/contact.component';
import { LandingpageComponent } from './store/landingpage/landingpage.component';
import { ProductComponent } from './store/product/product.component';
import { ProductsComponent } from './store/products/products.component';
import { ShopComponent } from './store/shop/shop.component';
import { StorehomeComponent } from './store/storehome/storehome.component';

const routes: Routes = [
  { path: '', redirectTo: 'store', pathMatch: 'full' },
  {
    path: 'store',
    component: StorehomeComponent,
    children: [
      {path: '', component: LandingpageComponent},
      {path: 'shop', component: ShopComponent},
      {path: 'collection', component: CollectionComponent},
      {path: 'products/:id', component: ProductsComponent},
      {path: 'product/:id', component: ProductComponent},
      {path: 'about', component: AboutComponent},
      {path: 'contact', component: ContactComponent},
      {path: 'cart', component: CartComponent},
    ],
  },
  {
    path: 'admin', component: DashboardComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./admin/home/dashboard.module').then(m => m.DashboardModule),
        canActivate: [IsLogInGuard]
      },
      {
        path: '',
        loadChildren: () => import('./admin/user/user.module').then(m => m.UserModule),
        canActivate: [IsLogInGuard]
      },
      {
        path: '',
        loadChildren: () => import('./admin/category/category.module').then(m => m.CategoryModule),
        canActivate: [IsLogInGuard]
      },
      {
        path: '',
        loadChildren: () => import('./admin/product/product.module').then(m => m.ProductModule),
        canActivate: [IsLogInGuard]
      },
      {
        path: '',
        loadChildren: () => import('./admin/coupon/coupon.module').then(m => m.CouponModule),
        canActivate: [IsLogInGuard]
      },
      {
        path: '',
        loadChildren: () => import('./admin/purchase/purchase.module').then(m => m.PurchaseModule),
        canActivate: [IsLogInGuard]
      },
    ]
  },
  { path: 'login', component: LoginComponent},
  { path: 'resetPassowrd', component: ResetpasswordComponent},
  { path: 'activation/:token', data: { title: 'activation' }, component: EmailactivationComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
