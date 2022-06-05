import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PurchaseRoutingModule } from './purchase-routing.module';
import { PurchasesComponent } from './purchases/purchases.component';
import { PurchaseComponent } from './purchase/purchase.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgxPaginationModule } from 'ngx-pagination';
import { NebularComponentsModule } from '../../shared/nebular-components.module';
import { SpinnerModule } from '../../spinner/spinner.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    PurchasesComponent,
    PurchaseComponent
  ],
  imports: [
    CommonModule,
    PurchaseRoutingModule,
    FormsModule,
    NgxPaginationModule,
    Ng2SearchPipeModule,
    NgSelectModule,
    NebularComponentsModule,
    SpinnerModule,
    LazyLoadImageModule,
  ]
})
export class PurchaseModule { }
