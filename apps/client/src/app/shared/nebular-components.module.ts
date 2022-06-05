import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { NbThemeModule, NbLayoutModule, NbIconModule, NbUserModule, NbSidebarModule, NbMenuModule, NbInputModule, NbLayoutDirection,
  NbListModule, NbCardModule, NbButtonModule, NbTreeGridModule, NbSpinnerModule, NbSelectModule, NbAlertModule, NbBadgeModule,
  NbToastrModule, NbAutocompleteModule, NbButtonGroupModule, NbStepperModule, NbDialogModule, NbCheckboxModule, NbToggleModule,
  NbActionsModule, NbContextMenuModule, NbTabsetModule, NbRouteTabsetModule, } from '@nebular/theme';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../../environments/environment';
import { ChangingThemeService } from './theme.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    NbThemeModule.forRoot(undefined, undefined, undefined, NbLayoutDirection.RTL),
    NbSidebarModule.forRoot(),
    NbSidebarModule,
    NbMenuModule.forRoot(),
    NbMenuModule,
    NbToastrModule.forRoot(),
    NbDialogModule.forRoot(),
    NbLayoutModule,
    NbEvaIconsModule,
    NbIconModule,
    NbUserModule,
    NbInputModule,
    NbCardModule,
    NbButtonModule,
    NbListModule,
    NbTreeGridModule,
    NbSpinnerModule,
    NbSelectModule,
    NbAlertModule,
    NbAutocompleteModule,
    NbButtonGroupModule,
    NbStepperModule,
    NbCheckboxModule,
    NbActionsModule,
    NbContextMenuModule,
    NbBadgeModule,
    NbToggleModule,
    NbTabsetModule,
    NbRouteTabsetModule,
  ],
  exports: [
    CommonModule,
    NbSidebarModule,
    NbMenuModule,
    NbLayoutModule,
    NbEvaIconsModule,
    NbIconModule,
    NbUserModule,
    NbInputModule,
    NbCardModule,
    NbButtonModule,
    NbListModule,
    NbTreeGridModule,
    NbSpinnerModule,
    NbSelectModule,
    NbAlertModule,
    NbAutocompleteModule,
    NbButtonGroupModule,
    NbStepperModule,
    NbCheckboxModule,
    NbActionsModule,
    NbContextMenuModule,
    NbBadgeModule,
    NbToggleModule,
    NbTabsetModule,
    NbRouteTabsetModule,
  ]
})
export class NebularComponentsModule {
  constructor(private changingThemeService: ChangingThemeService, private cookieService: CookieService) {
    const cookieTheme = environment.cookieTheme
    const value = this.cookieService.get(cookieTheme)
    const isTheme = this.cookieService.check(cookieTheme)
    isTheme ? this.changingThemeService.setThemes(value) : this.changingThemeService.setThemes('default')
  }
 }
