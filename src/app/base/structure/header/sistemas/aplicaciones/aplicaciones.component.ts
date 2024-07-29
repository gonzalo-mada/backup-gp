import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Aplicacion } from 'src/app/base/models/aplicacion';
import { InitService } from 'src/app/base/services/init.service';
import { PanelControlService } from 'src/app/base/services/panel_control.service';
import { PortalService } from 'src/app/base/services/portal.service';
import { SystemService } from 'src/app/base/services/system.service';
import { ThemeService } from 'src/app/base/services/theme.service';
import { WindowService } from 'src/app/base/services/window.service';
import { ErrorTemplateHandler } from 'src/app/base/tools/error/error.handler';

@Component({
  selector: 'app-aplicaciones',
  templateUrl: './aplicaciones.component.html',
  styleUrls: ['./aplicaciones.component.css'],
})
export class AplicacionesComponent {
  constructor(
    private panelControlService: PanelControlService,
    private errorTemplateHandler: ErrorTemplateHandler,
    private systemService: SystemService,
    private portalService: PortalService,
    private themeService: ThemeService,
    private config: InitService,
    private windowService: WindowService,
  ) {}

  theme: string = this.config.get('system.theme.themes.default');
  aplicaciones: MenuItem[] = [];
  active!: Aplicacion | undefined;

  ngOnInit(): void {
    this.getAplicaciones();
    this.themeService.theme$.subscribe((e: any) => {
      this.theme = e.theme;
    });
  }

  getAplicaciones(): void {
    if (this.config.get('system.data.aplicaciones')) {
      this.panelControlService
        .getAplicaciones(this.windowService.getItemSessionStorage('proyecto'))
        .then((res) => {
          this.aplicaciones = this.setAplicacionesPanelMenu(
            res.aplicaciones,
            res.active,
          );
          this.active = res.active;
          this.panelControlService['aplicacionesRx'].next(res);
        })
        .catch(async (e) => {
          var t: any = await this.systemService.translate([
            'sistemas.aplicaciones.error_get',
          ]);
          this.errorTemplateHandler.processError(e, {
            notifyMethod: 'page',
            message: t['sistemas.aplicaciones.error_get'],
          });
        });
    } else {
      this.panelControlService['aplicacionesRx'].next({
        aplicaciones: this.aplicaciones,
        active: this.active,
      });
    }
  }

  private setAplicacionesPanelMenu(
    aplicaciones: Aplicacion[],
    active: Aplicacion | undefined,
  ): MenuItem[] {
    var panelMenu: MenuItem[] = aplicaciones.map((e: Aplicacion) => {
      var mi: MenuItem | null = {
        label: `
          <div class="flex align-items-center">
            <div class="flex align-items-center pr-3">
              <img width="32" src="${e.icono}" />
            </div>
            <div class="flex align-items-center">
              ${e.nombre}
            </div>
          </div>`,
        escape: false,
        command: () => {
          this.goToAplicacion(e);
        },
        styleClass: active?.id === e.id ? 'active' : '',
      };
      return mi;
    });
    return panelMenu;
  }

  async goToAplicacion(aplicacion: Aplicacion): Promise<void> {
    try {
      await this.portalService.gotoApp(aplicacion.id);
    } catch (e) {
      var t: any = await this.systemService.translate([
        'sistemas.aplicaciones.error_navigate',
      ]);
      this.errorTemplateHandler.processError(e, {
        notifyMethod: 'alert',
        summary: aplicacion.nombre,
        message: t['sistemas.aplicaciones.error_navigate'],
      });
    }
  }
}
