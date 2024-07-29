import { Component, ElementRef, NgZone } from '@angular/core';
import { Usuario } from './models/usuario';
import { UsuarioService } from './services/usuario.service';
import { GtagService } from './services/gtag.service';
import { MessageService, PrimeNGConfig } from 'primeng/api';
import { InitService } from './services/init.service';
import { SystemService } from './services/system.service';
import { TranslateService } from '@ngx-translate/core';
import { PanelControlService } from './services/panel_control.service';
import { Router } from '@angular/router';
import { ErrorTemplateHandler } from './tools/error/error.handler';
import { StartService } from '../project/services/start.service';
import { BaseRoutingSubscribe } from './routes/base-routing.subscribe';
import { ErrorTemplate } from './models/error-template';
import { WindowService } from './services/window.service';

@Component({
  selector: 'app-root',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.css'],
})
export class BaseComponent {
  constructor(
    public elementRef: ElementRef,
    public translateService: TranslateService,
    private primengConfig: PrimeNGConfig,
    private config: InitService,
    private systemService: SystemService,
    private usuarioService: UsuarioService,
    private gtagService: GtagService,
    private panelControlService: PanelControlService,
    private router: Router,
    private errorTemplateHandler: ErrorTemplateHandler,
    private messageService: MessageService,
    private startService: StartService,
    private baseRoutingSubscribe: BaseRoutingSubscribe,
    private windowService: WindowService,
    private ngZone: NgZone,
  ) {}

  private title: string = this.config.get('system.name');
  usuario!: Usuario | null;
  private aplicaciones_check: boolean = false;
  private modulos_check: boolean = false;
  private menus_check: boolean = false;

  blocking: boolean = false;
  blocking_session: boolean = false;
  private develop: boolean = false;
  private maintenance: boolean = false;

  ngOnInit(): void {
    this.setSubscribes();
    this.initApp();
  }

  private async initApp(): Promise<void> {
    try {
      this.systemService.mainLoading(true);
      this.systemService.setTitle(this.config.get('system.name'));
      this.primengConfig.ripple = true;
      this.systemService.setTranslation(
        this.config.get('system.theme.translate.default'),
        this.primengConfig,
      );
      this.gtagService.init(this.elementRef);
      await this.getSession(window.location.href);
    } catch (e: any) {
      this.blocking = true;
      this.errorTemplateHandler.processError(e);
    }
  }

  private async getSession(url: string): Promise<void> {
    try {
      if (this.config.get('system.token')) {
        if (this.windowService.getItemSessionStorage('token') === '') {
          this.windowService.clearSessionStorage();
          var uid = url.split('?uid=')[1];
          if (uid) {
            await this.usuarioService.getSession(uid);
            if (this.config.get('system.replaceState')) {
              this.windowService.replaceState('', '', '');
            }
          } else {
            this.windowService.replaceLocation(
              this.config.get('system.url.portal'),
            );
          }
        }
      }
      this.usuario = await this.usuarioService.getUser(
        this.config.get('system.token') &&
          this.config.get('system.data.usuario'),
      );
      this.systemService.setTranslation(
        this.usuario?.idioma,
        this.primengConfig,
      );
    } catch (e) {
      this.blocking_session = e instanceof ErrorTemplate && e.getIsToken();
      this.usuario = await this.usuarioService.getUser(false);
      var t: any = await this.systemService.translate([
        'init.error_init',
        'init.titulo',
      ]);
      this.errorTemplateHandler.processError(e, {
        message: t['init.error_init'],
        summary: t['init.titulo'],
      });
    }
  }

  private async launch(): Promise<void> {
    if (this.modulos_check && this.aplicaciones_check && this.menus_check) {
      if (!this.develop && !this.maintenance) {
        try {
          if (this.config.get('system.data.startservices')) {
            await this.startService.startServices();
          }
          await this.panelControlService.homeNavigate(this.router);
        } catch (e) {
          var t: any = await this.systemService.translate([
            'init.error_startservice',
            'init.titulo',
          ]);
          this.errorTemplateHandler.processError(e, {
            message: t['init.error_startservice'],
            summary: t['init.titulo'],
          });
        }
      } else {
        this.blocking = true;
        var _path: string = '';
        if (this.develop) _path = 'develop';
        if (this.maintenance) _path = 'maintenance';
        this.panelControlService.notActiveModulo(this.router, _path);
      }
      this.systemService.mainLoading(false);
    }
  }

  private setSubscribes(): void {
    this.baseRoutingSubscribe.navigationStart();
    this.baseRoutingSubscribe.navigationCancel();

    this.errorTemplateHandler.error$.subscribe((e: any) => {
      var err: ErrorTemplate = e;
      switch (err.getNotifyMethod()) {
        case 'page':
          this.ngZone.run(
            async () =>
              await this.router.navigate(
                [err.getIsToken() ? '/session' : '/error'],
                {
                  state: err.getDetail(),
                },
              ),
          );

          break;
        case 'alert':
          var alert: any = {
            severity: 'error',
            key: 'main',
            sticky: true,
            detail: err.getDetail().error.message,
          };
          if (err.getDetail().summary)
            alert['summary'] = err.getDetail().summary;
          this.messageService.add(alert);
          break;
      }
    });

    this.panelControlService.navigate$.subscribe((e: any) => {
      this.gtagService.set(this.elementRef, e.menu, e.item);
      this.systemService.setTitle(this.title, e.title);
    });

    this.panelControlService.aplicaciones$.subscribe((e: any) => {
      this.aplicaciones_check = true;
      this.launch();
    });

    this.panelControlService.modulos$.subscribe((e: any) => {
      if (this.config.get('system.token')) {
        if (e.active) {
          this.title = e.active.nombre;
          this.develop = e.active.estado === 3;
          this.maintenance = e.active.estado === 2;
        } else {
          this.maintenance = true;
        }
      } else {
        this.develop = this.config.get('system.isDevelop');
        this.maintenance = this.config.get('system.isMaintenance');
      }
      this.systemService.setTitle(this.title);
      this.modulos_check = true;
      this.launch();
    });

    this.panelControlService.menus$.subscribe((e: any) => {
      this.menus_check = true;
      this.launch();
    });
  }
}
