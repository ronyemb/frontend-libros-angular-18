import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withPreloading } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/Aura';
import { APP_ROUTES } from './app.routes';
import { CustomPreloadingStrategy } from './strategies/custom-preloading-strategy';
import { provideHttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { LOCALE_ID } from '@angular/core';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(APP_ROUTES, withPreloading(CustomPreloadingStrategy)), // Configuración corregida
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: Aura,
        options: {
          prefix: 'p',
          darkModeSelector: '',
          cssLayer: false,
        },
      },
    }),
    provideHttpClient(),
    MessageService,
    { provide: LOCALE_ID, useValue: 'es-PE' },
  ],
};
