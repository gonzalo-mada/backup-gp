import { Injectable } from '@angular/core';
import { InvokerService } from './invoker.service';
import { SystemService } from './system.service';
import { Aviso } from '../models/aviso';
import { Subject } from 'rxjs';
import { WindowService } from './window.service';

@Injectable({
  providedIn: 'root',
})
export class PortalService {
  public backToPortalRx = new Subject<object>();
  public backToPortal$ = this.backToPortalRx.asObservable();

  constructor(
    private invoker: InvokerService,
    private systemService: SystemService,
    private windowService: WindowService,
  ) {}

  getAvisos(): Promise<Aviso[]> {
    return this.invoker.httpInvoke('base/getAvisos').then((res: any) => {
      var avisos: Aviso[] = [];
      for (let i = 0; i < res.length; i++) {
        let r = res[i];
        var content = r.mensaje.split('<CORTE>');

        var aviso: Aviso = {
          id: this.systemService.getHash(4),
          name: content[1],
          body: content[2],
          date: r.fecha,
        };
        avisos.push(aviso);
      }
      return avisos;
    });
  }

  async gotoModule(proyecto: string, modulo: string): Promise<void> {
    var data: any = await this.invoker.httpInvoke('base/navigate', {
      proyecto: proyecto,
      modulo: modulo,
      idProyecto: proyecto,
      codModulo: modulo,
    });
    this.windowService.replaceLocation(data.url);
  }

  async gotoApp(proyecto: string): Promise<void> {
    var data: any = await this.invoker.httpInvoke('base/navigateApp', {
      proyecto: proyecto,
      idProyecto: proyecto,
    });
    this.windowService.replaceLocation(data.url);
  }

  async backToPortal(proyecto: string): Promise<void> {
    var data: any = await this.invoker.httpInvoke('base/getAppUrl', {
      proyecto: proyecto,
      idProyecto: proyecto,
    });
    this.windowService.replaceLocation(data.url);
  }

  async sendContactMail(
    mensaje: string,
    correouv: string,
    nombre: string,
    rut: string,
    sitename: string,
  ): Promise<any> {
    return await this.invoker.httpInvoke('base/sendMail', {
      correoUV: correouv,
      subject: `[${sitename}]`,
      body: `${mensaje}<br/><br/>-------------<br/>Este correo ha sido generado desde:<br/><br/>Sistema: ${sitename}`,
      rut: rut,
      user: nombre,
    });
  }
}
