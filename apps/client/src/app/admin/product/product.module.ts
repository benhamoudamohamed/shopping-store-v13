import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductRoutingModule } from './product-routing.module';
import { ProductsComponent } from './products/products.component';
import { ProductComponent } from './product/product.component';
import { ProductEditComponent } from './product-edit/product-edit.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgxPaginationModule } from 'ngx-pagination';
import { NebularComponentsModule } from '../../shared/nebular-components.module';
import { SpinnerModule } from '../../spinner/spinner.module';

@NgModule({
  declarations: [
    ProductsComponent,
    ProductComponent,
    ProductEditComponent
  ],
  imports: [
    CommonModule,
    ProductRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    Ng2SearchPipeModule,
    NgSelectModule,
    NebularComponentsModule,
    SpinnerModule,
    LazyLoadImageModule
  ]
})
export class ProductModule { }
