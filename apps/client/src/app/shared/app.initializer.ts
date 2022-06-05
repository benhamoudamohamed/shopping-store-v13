import { APP_INITIALIZER } from '@angular/core';
import { AuthService } from './api/auth.service';

export function InitializeApp(authService: AuthService) {
  return (): Promise<any> => {
    return authService.Init();
  }
}

export const AppInitializerProviders = [
  { provide: APP_INITIALIZER, useFactory: InitializeApp, multi: true, deps: [AuthService] }
];
