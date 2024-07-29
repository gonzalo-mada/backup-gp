import { Subject } from 'rxjs';
import { Aviso } from '../../models/aviso';
import { Injectable } from '@angular/core';

@Injectable()
export class PortalServiceMock {
  public backToPortalRx = new Subject<object>();
  public backToPortal$ = this.backToPortalRx.asObservable();

  constructor() {}

  getAvisos(): Promise<Aviso[]> {
    return Promise.resolve([
      {
        id: '1',
        name: 'Aviso 1',
        body: 'Contenido del aviso 1',
        date: '01/01/2024',
      },
      {
        id: '2',
        name: 'Aviso 2',
        body: 'Contenido del aviso 2',
        date: '02/01/2024',
      },
    ]);
  }

  async gotoModule(proyecto: string, modulo: string): Promise<void> {
    return Promise.resolve();
  }

  async gotoApp(proyecto: string): Promise<void> {
    return Promise.resolve();
  }

  async backToPortal(proyecto: string): Promise<void> {
    return Promise.resolve();
  }

  async sendContactMail(
    mensaje: string,
    correouv: string,
    nombre: string,
    rut: string,
    sitename: string,
  ): Promise<any> {
    return Promise.resolve();
  }
}
