import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryRoutingModule } from './category-routing.module';
import { CategoriesComponent } from './categories/categories.component';
import { CategoryComponent } from './category/category.component';
import { CategoryEditComponent } from './category-edit/category-edit.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgxPaginationModule } from 'ngx-pagination';
import { NebularComponentsModule } from '../../shared/nebular-components.module';
import { SpinnerModule } from '../../spinner/spinner.module';
import { LazyLoadImageModule } from 'ng-lazyload-image';

@NgModule({
  declarations: [
    CategoriesComponent,
    CategoryComponent,
    CategoryEditComponent
  ],
  imports: [
    CommonModule,
    CategoryRoutingModule,
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
export class CategoryModule { }
