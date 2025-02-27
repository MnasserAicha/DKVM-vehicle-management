import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { importProvidersFrom } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), importProvidersFrom(MatIconModule)],
};
