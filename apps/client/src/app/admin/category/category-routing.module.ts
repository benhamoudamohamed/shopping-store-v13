import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoriesComponent } from './categories/categories.component';
import { CategoryEditComponent } from './category-edit/category-edit.component';
import { CategoryComponent } from './category/category.component';

const routes: Routes = [
  { path: 'category', data : {title: 'List of Category'}, component: CategoriesComponent },
  { path: 'category/detail/:id', data : {title: 'Category details'}, component: CategoryComponent },
  { path: 'category/create', data : {title: 'Create Category'}, component: CategoryEditComponent },
  { path: 'category/edit/:id', data : {title: 'Edit Category'}, component: CategoryEditComponent },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CategoryRoutingModule { }
