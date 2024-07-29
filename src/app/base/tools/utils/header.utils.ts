import { Injectable } from '@angular/core';
import { InitService } from '../../services/init.service';
import { MenuItem } from 'primeng/api';
import { ContactoComponent } from '../../structure/header/ayuda/contacto/contacto.component';
import { SimbologiaComponent } from '../../structure/header/ayuda/simbologia/simbologia.component';
import { SystemService } from '../../services/system.service';
import { WindowService } from '../../services/window.service';

@Injectable({
  providedIn: 'root',
})
export class HeaderUtils {
  constructor(
    private config: InitService,
    private systemService: SystemService,
    private windowService: WindowService,
  ) {}

  async getAyudaButtons(
    contacto: ContactoComponent,
    simbologia: SimbologiaComponent,
  ): Promise<MenuItem[]> {
    var t: any = await this.systemService.translate([
      'ayuda.titulo',
      'ayuda.contacto.titulo',
      'ayuda.simbologia.titulo',
      'ayuda.manual.titulo',
    ]);

    var buttons: MenuItem[] = [
      {
        id: 'contacto',
        label: t['ayuda.contacto.titulo'],
        icon: this.config.get('system.icons.contacto'),
        visible: this.config.get('system.buttons.ayuda.children.contacto'),
        command: () => {
          contacto.showContacto();
        },
      },
      {
        id: 'simbologia',
        label: t['ayuda.simbologia.titulo'],
        icon: this.config.get('system.icons.simbologia'),
        visible: this.config.get('system.buttons.ayuda.children.simbologia'),
        command: () => {
          simbologia.showSimbologia();
        },
      },
      {
        id: 'manual',
        label: t['ayuda.manual.titulo'],
        icon: this.config.get('system.icons.manual'),
        visible: this.config.get('system.buttons.ayuda.children.manual'),
        command: () => {
          this.windowService.openUrl(
            this.config.get('system.url.manual'),
            '_blank',
          );
        },
      },
    ];
    return buttons;
  }

  async getMiCuentaButtons(): Promise<MenuItem[]> {
    var t: any = await this.systemService.translate([
      'mi_cuenta.correo.titulo',
      'mi_cuenta.cambiaclave.titulo',
    ]);

    var buttons: MenuItem[] = [
      {
        id: 'correo',
        label: t['mi_cuenta.correo.titulo'],
        icon: this.config.get('system.icons.correo'),
        visible: this.config.get('system.buttons.usuario.children.correo'),
        command: () => {
          this.windowService.openUrl(
            `${
              this.config.get('mail_domains')[this.config.get('system.mail')]
            }`,
            '_blank',
          );
        },
      },
      {
        id: 'cambiaclave',
        label: t['mi_cuenta.cambiaclave.titulo'],
        icon: this.config.get('system.icons.cambiaclave'),
        visible: this.config.get('system.buttons.usuario.children.cambiaclave'),
        command: () => {
          this.windowService.openUrl(
            this.config.get('system.url.cambiaclave'),
            '_blank',
          );
        },
      },
    ];
    return buttons;
  }
}
