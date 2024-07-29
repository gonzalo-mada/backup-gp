import { Component } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { Aplicacion } from 'src/app/base/models/aplicacion';
import { Modulo } from 'src/app/base/models/modulo';
import { InitService } from 'src/app/base/services/init.service';
import { PanelControlService } from 'src/app/base/services/panel_control.service';
import { PortalService } from 'src/app/base/services/portal.service';
import { SystemService } from 'src/app/base/services/system.service';
import { ThemeService } from 'src/app/base/services/theme.service';
import { WindowService } from 'src/app/base/services/window.service';
import { ErrorTemplateHandler } from 'src/app/base/tools/error/error.handler';

@Component({
  selector: 'app-modulos',
  templateUrl: './modulos.component.html',
  styleUrls: ['./modulos.component.css'],
})
export class ModulosComponent {
  constructor(
    private panelControlService: PanelControlService,
    private errorTemplateHandler: ErrorTemplateHandler,
    private systemService: SystemService,
    private portalService: PortalService,
    private messageService: MessageService,
    private themeService: ThemeService,
    private config: InitService,
    private windowService: WindowService,
  ) {}

  theme: string = this.config.get('system.theme.themes.default');
  modulos: MenuItem[] = [];
  aplicacionActive!: Aplicacion;
  active!: Modulo | undefined;

  ngOnInit(): void {
    this.getModulos();
    this.panelControlService.aplicaciones$.subscribe((e: any) => {
      this.aplicacionActive = e.active;
    });
    this.themeService.theme$.subscribe((e: any) => {
      this.theme = e.theme;
    });
  }

  getModulos(): void {
    if (this.config.get('system.data.modulos')) {
      this.panelControlService
        .getModulos(this.windowService.getItemSessionStorage('modulo'))
        .then((res) => {
          this.modulos = this.setModulosPanelMenu(res.modulos, res.active);
          this.active = res.active;
          this.panelControlService['modulosRx'].next(res);
        })
        .catch((e) => {
          var t: any = this.systemService.translate([
            'sistemas.modulos.error_get',
          ]);
          this.errorTemplateHandler.processError(e, {
            notifyMethod: 'page',
            message: t['sistemas.modulos.error_get'],
          });
        });
    } else {
      this.panelControlService['modulosRx'].next({
        modulos: this.modulos,
        active: this.active,
      });
    }
  }

  private setModulosPanelMenu(
    modulos: Modulo[],
    active: Modulo | undefined,
  ): MenuItem[] {
    var panelMenu: MenuItem[] = modulos.map((e: Modulo) => {
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
          this.goToModulo(e);
        },
        title: e.descripcion,
        styleClass: active?.cod_modulo === e.cod_modulo ? 'active' : '',
      };
      return mi;
    });
    return panelMenu;
  }

  async goToModulo(modulo: Modulo): Promise<void> {
    try {
      if (modulo.estado === 1) {
        await this.portalService.gotoModule(
          this.windowService.getItemSessionStorage('proyecto'),
          modulo.cod_modulo,
        );
      } else {
        var t: any = await this.systemService.translate([
          'sistemas.modulos.maintenance_navigate',
          'sistemas.modulos.develop_navigate',
        ]);
        var detail = '';
        if (modulo.estado === 2)
          detail = t['sistemas.modulos.maintenance_navigate'];
        if (modulo.estado === 3)
          detail = t['sistemas.modulos.develop_navigate'];

        this.messageService.add({
          key: 'main',
          detail: detail,
          summary: modulo.nombre,
          severity: 'info',
        });
      }
    } catch (e) {
      var t: any = await this.systemService.translate([
        'sistemas.modulos.error_navigate',
      ]);
      this.errorTemplateHandler.processError(e, {
        notifyMethod: 'alert',
        summary: modulo.nombre,
        message: t['sistemas.modulos.error_navigate'],
      });
    }
  }
}
