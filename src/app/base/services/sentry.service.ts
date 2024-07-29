import { Injectable, Injector } from '@angular/core';
import { InitService } from './init.service';
import { Usuario } from '../models/usuario';
import { ErrorTemplate } from '../models/error-template';
import * as Sentry from '@sentry/angular';
import { environment } from '../../../environments/environment';
import { UsuarioService } from './usuario.service';

@Injectable({
  providedIn: 'root',
})
export class SentryService {
  constructor(
    private config: InitService,
    private injector: Injector,
  ) {}

  private production: boolean = environment.production;
  private sentry = Sentry;

  captureException(error: ErrorTemplate, realError: any): ErrorTemplate {
    try {
      if (
        this.production &&
        this.config.get('sentry.active') &&
        !error.getIsToken() &&
        !error.getCaptureSentry()
      ) {
        var detail: any = error.getDetail();
        var scope = new this.sentry.Scope();
        var usuario: Usuario = this.injector
          .get(UsuarioService)
          .getUserOnline();
        scope.setTransactionName(detail.error.name);
        scope.setContext('detail', detail);
        scope.setContext(
          'user',
          usuario
            ? {
                nombre: usuario.nombre_completo,
                correouv: usuario.correo_uv,
                rut: usuario.rut,
                anonimo: usuario.anonimo,
              }
            : null,
        );
        this.sentry.captureException(realError, scope);
      }
      error.setCaptureSentry(true);
      return error;
    } catch (e) {
      console.error('SENTRY-ERROR');
      error.setCaptureSentry(true);
      return error;
    }
  }
}
