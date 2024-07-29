import { Component, EventEmitter, Output } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Aviso } from 'src/app/base/models/aviso';
import { InitService } from 'src/app/base/services/init.service';
import { PortalService } from 'src/app/base/services/portal.service';
import { ErrorTemplateHandler } from 'src/app/base/tools/error/error.handler';

@Component({
  selector: 'app-avisos',
  templateUrl: './avisos.component.html',
  styleUrls: ['./avisos.component.css'],
})
export class AvisosComponent {
  constructor(
    private portalService: PortalService,
    private config: InitService,
    private errorTemplateHandler: ErrorTemplateHandler,
  ) {}

  @Output() onCount = new EventEmitter();
  showAvisos: boolean = false;
  avisos: MenuItem[] = [];
  aviso!: Aviso;
  show: boolean = false;

  ngOnInit(): void {
    this.getAvisos();
  }

  getAvisos(): void {
    if (
      this.config.get('system.data.avisos') &&
      this.config.get('system.token')
    ) {
      this.portalService
        .getAvisos()
        .then(async (res) => {
          this.avisos = this.setAvisos(res);
          this.onCount.emit(res.length);
        })
        .catch((error) => {
          this.avisos = [];
          this.errorTemplateHandler.processError(error, {
            notifyMethod: 'none',
          });
        });
    }
  }

  showAviso(aviso: Aviso): void {
    this.aviso = aviso;
    this.show = true;
  }

  private setAvisos(avisos: Aviso[]): MenuItem[] {
    var avi: MenuItem[] = avisos.map((e: Aviso) => {
      var m: MenuItem = {
        escape: false,
        command: () => {
          this.showAviso(e);
        },
        label: `<div class="text-sm mb-2"><i class="pi pi-calendar"></i> ${e.date}</div>${e.name}`,
      };
      return m;
    });
    return avi;
  }
}
