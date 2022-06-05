import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { NebularComponentsModule } from '../../shared/nebular-components.module';

@NgModule({
  declarations: [
    HomeComponent,
    DashboardComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    NebularComponentsModule
  ]
})
export class DashboardModule { }
