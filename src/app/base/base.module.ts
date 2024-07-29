import {
  NgModule,
  ErrorHandler,
  APP_INITIALIZER,
  CUSTOM_ELEMENTS_SCHEMA,
} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpBackend, HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BaseComponent } from './base.component';
import { InitService } from './services/init.service';
import { ErrorTemplateHandler } from './tools/error/error.handler';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

//Routing
import { BaseRoutingModule } from './routes/base-routing.module';

//Modules
import { ProjectModule } from '../project/project.module';
import { PrimengModule } from '../base/modules/primeng.module';
import { NgIdleModule } from '@ng-idle/core';
import { NgxSpinnerModule } from 'ngx-spinner';

//Traductor
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { MultiTranslateHttpLoader } from 'ngx-translate-multi-http-loader';

//Components
import { HeaderComponent } from './structure/header/header.component';
import { FooterComponent } from './structure/footer/footer.component';
import { ModulosComponent } from './structure/header/sistemas/modulos/modulos.component';
import { AplicacionesComponent } from './structure/header/sistemas/aplicaciones/aplicaciones.component';
import { MiCuentaComponent } from './structure/header/mi-cuenta/mi-cuenta.component';
import { AvisosComponent } from './structure/header/avisos/avisos.component';
import { SimbologiaComponent } from './structure/header/ayuda/simbologia/simbologia.component';
import { ContactoComponent } from './structure/header/ayuda/contacto/contacto.component';
import { MenusComponent } from './structure/header/menus/menus.component';
import { AyudaComponent } from './structure/header/ayuda/ayuda.component';
import { FormIsvalidComponent } from './components/form-isvalid/form-isvalid.component';
import { FormControlComponent } from './components/form-control/form-control.component';
import { SistemasComponent } from './structure/header/sistemas/sistemas.component';
import { LoadingComponent } from './components/loading/loading.component';
import { MainLoadingComponent } from './components/main-loading/main-loading.component';
import { DevelopComponent } from './pages/develop/develop.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { ErrorComponent } from './pages/error/error.component';
import { SessionComponent } from './pages/session/session.component';
import { MaintenanceComponent } from './pages/maintenance/maintenance.component';
import { BackToPortalComponent } from './components/back-to-portal/back-to-portal.component';
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';
import { IdleComponent } from './tools/idle/idle.component';
import { TemasComponent } from './structure/header/temas/temas.component';

@NgModule({
  declarations: [
    BaseComponent,
    HeaderComponent,
    FooterComponent,
    ModulosComponent,
    AplicacionesComponent,
    MiCuentaComponent,
    AvisosComponent,
    SimbologiaComponent,
    ContactoComponent,
    MenusComponent,
    AyudaComponent,
    SistemasComponent,
    LoadingComponent,
    MainLoadingComponent,
    DevelopComponent,
    NotFoundComponent,
    ErrorComponent,
    SessionComponent,
    MaintenanceComponent,
    BackToPortalComponent,
    BreadcrumbComponent,
    IdleComponent,
    TemasComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    PrimengModule,
    NgxSpinnerModule,
    FormsModule,
    ReactiveFormsModule,
    NgIdleModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: translateLoaderFactory,
        deps: [HttpBackend],
      },
    }),
    FormIsvalidComponent,
    FormControlComponent,
    ProjectModule,
    BaseRoutingModule,
  ],
  providers: [
    {
      provide: ErrorHandler,
      useClass: ErrorTemplateHandler,
    },
    InitService,
    {
      provide: APP_INITIALIZER,
      useFactory: (config: InitService) => () => config.load(),
      deps: [InitService],
      multi: true,
    },
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [BaseComponent],
})
export class BaseModule {}

export function translateLoaderFactory(http: HttpBackend) {
  return new MultiTranslateHttpLoader(http, [
    { prefix: './assets/i18n/base/', suffix: '.json' },
    { prefix: './assets/i18n/project/', suffix: '.json' },
  ]);
}
