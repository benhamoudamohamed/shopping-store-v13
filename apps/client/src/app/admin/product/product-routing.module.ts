import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductEditComponent } from './product-edit/product-edit.component';
import { ProductComponent } from './product/product.component';
import { ProductsComponent } from './products/products.component';

const routes: Routes = [
  { path: 'product', data : {title: 'List of products'}, component: ProductsComponent },
  { path: 'product/detail/:id', data : {title: 'products details'}, component: ProductComponent },
  { path: 'product/create', data : {title: 'Create products'}, component: ProductEditComponent },
  { path: 'product/edit/:id', data : {title: 'Edit products'}, component: ProductEditComponent },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductRoutingModule { }
