import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { BaseModule } from './app/base/base.module';
import { environment } from './environments/environment';
import * as Sentry from '@sentry/angular';

if (environment.production) {
  enableProdMode();
  Sentry.init({
    dsn: environment.sentry.dsn,
    integrations: [],
  });
}

platformBrowserDynamic()
  .bootstrapModule(BaseModule)
  .catch((err: any) => console.error(err));
