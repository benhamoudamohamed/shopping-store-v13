import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreRoutingModule } from './store-routing.module';
import { StorehomeComponent } from './storehome/storehome.component';
import { NebularComponentsModule } from '../shared/nebular-components.module';
import { LandingpageComponent } from './landingpage/landingpage.component';
import { SwiperModule } from 'swiper/angular';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import { CartComponent } from './cart/cart.component';
import { ShopComponent } from './shop/shop.component';
import { CollectionComponent } from './collection/collection.component';
import { ProductsComponent } from './products/products.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SpinnerModule } from '../spinner/spinner.module';
import { ProductComponent } from './product/product.component';

@NgModule({
  declarations: [
    StorehomeComponent,
    LandingpageComponent,
    AboutComponent,
    ContactComponent,
    CartComponent,
    ShopComponent,
    CollectionComponent,
    ProductsComponent,
    ProductComponent
  ],
  imports: [
    CommonModule,
    StoreRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NebularComponentsModule,
    SpinnerModule,
    SwiperModule,
    LazyLoadImageModule
  ]
})
export class StoreModule { }
