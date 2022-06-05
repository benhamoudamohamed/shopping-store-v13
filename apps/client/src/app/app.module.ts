import { NgModule } from '@angular/core';
import { BrowserModule, Title } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { StoreModule } from './store/store.module';
import { AuthenticationModule } from './authentication/authentication.module';
import { CookieService } from 'ngx-cookie-service';
import { AppInitializerProviders } from './shared/app.initializer';
import { ErrorInterceptorProvider } from './shared/interceptors/error.interceptor';
import { JwtInterceptorProvider } from './shared/interceptors/jwt.interceptor';
import { CategoryModule } from './admin/category/category.module';
import { ProductModule } from './admin/product/product.module';
import { CouponModule } from './admin/coupon/coupon.module';
import { PurchaseModule } from './admin/purchase/purchase.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    StoreModule,
    AuthenticationModule,
    CategoryModule,
    ProductModule,
    CouponModule,
    PurchaseModule,
  ],
  providers: [Title, CookieService, JwtInterceptorProvider, ErrorInterceptorProvider, AppInitializerProviders],
  bootstrap: [AppComponent],
})
export class AppModule {}
