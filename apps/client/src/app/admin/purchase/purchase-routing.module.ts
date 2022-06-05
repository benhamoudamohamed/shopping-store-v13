import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PurchaseComponent } from './purchase/purchase.component';
import { PurchasesComponent } from './purchases/purchases.component';

const routes: Routes = [
  { path: 'purchase', data : {title: 'List of Purchase'}, component: PurchasesComponent },
  { path: 'purchase/detail/:id', data : {title: 'Purchase details'}, component: PurchaseComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PurchaseRoutingModule { }
