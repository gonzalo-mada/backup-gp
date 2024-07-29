import { Component } from '@angular/core';
import { SystemService } from '../../services/system.service';
import { PortalService } from '../../services/portal.service';
import { PanelControlService } from '../../services/panel_control.service';
import { Aplicacion } from '../../models/aplicacion';
import { ErrorTemplateHandler } from '../../tools/error/error.handler';
import { WindowService } from '../../services/window.service';

@Component({
  selector: 'app-back-to-portal',
  templateUrl: './back-to-portal.component.html',
  styleUrls: ['./back-to-portal.component.css'],
})
export class BackToPortalComponent {
  constructor(
    private systemService: SystemService,
    private portalService: PortalService,
    private panelControlService: PanelControlService,
    private errorTemplateHandler: ErrorTemplateHandler,
    private windowService: WindowService,
  ) {}

  ngOnInit(): void {
    this.portalService.backToPortal$.subscribe((e: any) => {
      this.goBackPortal();
    });
  }

  async goBackPortal(): Promise<void> {
    try {
      await this.portalService.backToPortal(
        this.windowService.getItemSessionStorage('proyecto'),
      );
    } catch (e) {
      var t: any = await this.systemService.translate([
        'portal.error_navigate',
      ]);
      var aplicacion: Aplicacion | null =
        this.panelControlService.getAplicacionActive();
      this.errorTemplateHandler.processError(e, {
        notifyMethod: 'alert',
        summary: aplicacion ? aplicacion.nombre : '',
        message: t['portal.error_navigate'],
      });
    }
  }
}
