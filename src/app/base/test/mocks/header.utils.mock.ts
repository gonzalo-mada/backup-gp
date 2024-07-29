import { MenuItem } from 'primeng/api';
import { ContactoComponent } from '../../structure/header/ayuda/contacto/contacto.component';
import { SimbologiaComponent } from '../../structure/header/ayuda/simbologia/simbologia.component';
import { Injectable } from '@angular/core';

@Injectable()
export class HeaderUtilsMock {
  async getAyudaButtons(
    contacto: ContactoComponent,
    simbologia: SimbologiaComponent,
  ): Promise<MenuItem[]> {
    const buttons: MenuItem[] = [
      {
        id: 'contacto',
        label: 'Contacto',
        icon: 'fa fa-envelope',
        visible: true,
        command: () => {
          contacto.showContacto();
        },
      },
      {
        id: 'simbologia',
        label: 'Simbologia',
        icon: 'fa fa-info-circle',
        visible: true,
        command: () => {
          simbologia.showSimbologia();
        },
      },
      {
        id: 'manual',
        label: 'Manual',
        icon: 'fa fa-book',
        visible: true,
        command: () => {
          console.log('Descargando manual');
        },
      },
    ];
    return buttons;
  }

  async getMiCuentaButtons(): Promise<MenuItem[]> {
    const buttons: MenuItem[] = [
      {
        id: 'correo',
        label: 'Correo',
        icon: 'fa fa-envelope',
        visible: true,
        command: () => {
          console.log('Abriendo correo');
        },
      },
      {
        id: 'cambiaclave',
        label: 'Cambiar Clave',
        icon: 'fa fa-key',
        visible: true,
        command: () => {
          console.log('Abriendo cambiaclave.uv.cl');
        },
      },
    ];
    return buttons;
  }
}
