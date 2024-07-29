import { Component, EventEmitter, Output } from '@angular/core';
import { InitService } from 'src/app/base/services/init.service';

@Component({
  selector: 'app-simbologia',
  templateUrl: './simbologia.component.html',
  styleUrls: ['./simbologia.component.css'],
})
export class SimbologiaComponent {
  constructor(private config: InitService) {}

  @Output() onOpen = new EventEmitter();
  show: boolean = false;
  simbolos: any[] = [];

  showSimbologia(): void {
    this.setSimbologia();
    this.show = true;
    this.onOpen.emit();
  }

  setSimbologia(): void {
    var icons: any = this.config.get('system.icons');
    var buttons: any = this.config.get('system.buttons');
    this.simbolos = [
      {
        id: `i1`,
        icon: icons.menus,
        titulo: 'menus.titulo',
        glosa: `menus.descripcion`,
        subs: null,
        show: buttons.menus.active,
      },
      {
        id: `i2`,
        icon: icons.portal,
        titulo: 'portal.titulo',
        glosa: `portal.descripcion`,
        subs: null,
        show: buttons.portal,
      },
      {
        id: `i3`,
        icon: icons.ayuda,
        titulo: `ayuda.titulo`,
        glosa: `ayuda.descripcion`,
        show: buttons.ayuda.active,
        subs: [
          {
            id: `i3-1`,
            icon: icons.contacto,
            titulo: `ayuda.contacto.titulo`,
            glosa: `ayuda.contacto.descripcion`,
            show: buttons.ayuda.children.contacto,
          },
          {
            id: `i3-2`,
            icon: icons.simbologia,
            titulo: `ayuda.simbologia.titulo`,
            glosa: `ayuda.simbologia.descripcion`,
            show: buttons.ayuda.children.simbologia,
          },
          {
            id: `i3-3`,
            icon: icons.manual,
            titulo: `ayuda.manual.titulo`,
            glosa: `ayuda.manual.descripcion`,
            show: buttons.ayuda.children.manual,
          },
        ],
      },
      {
        id: `i4`,
        icon: icons.sistemas,
        titulo: `sistemas.titulo`,
        glosa: `sistemas.descripcion`,
        show: buttons.sistemas.active,
        subs: [
          {
            id: `i4-1`,
            icon: icons.modulos,
            titulo: `sistemas.modulos.titulo`,
            glosa: `sistemas.modulos.descripcion`,
            show: buttons.sistemas.children.modulos,
          },
          {
            id: `i4-2`,
            icon: icons.aplicaciones,
            titulo: `sistemas.aplicaciones.titulo`,
            glosa: `sistemas.aplicaciones.descripcion`,
            show: buttons.sistemas.children.aplicaciones,
          },
        ],
      },
      {
        id: `i5`,
        icon: icons.avisos,
        titulo: `avisos.titulo`,
        glosa: `avisos.descripcion`,
        subs: null,
        show: buttons.avisos,
      },
      {
        id: `i6`,
        icon: icons.profile,
        titulo: `mi_cuenta.titulo`,
        glosa: `mi_cuenta.descripcion`,
        show: buttons.usuario.active,
        subs: [
          {
            id: `i6-1`,
            icon: icons.correo,
            titulo: `mi_cuenta.correo.titulo`,
            glosa: `mi_cuenta.correo.descripcion`,
            show: buttons.usuario.children.correo,
          },
          {
            id: `i6-2`,
            icon: icons.cambiaclave,
            titulo: `mi_cuenta.cambiaclave.titulo`,
            glosa: `mi_cuenta.cambiaclave.descripcion`,
            show: buttons.usuario.children.cambiaclave,
          },
          {
            id: `i6-3`,
            icon: icons.translate,
            titulo: `idiomas.titulo`,
            glosa: `idiomas.descripcion`,
            show: true,
          },
          {
            id: `i6-4`,
            icon: icons.logout,
            titulo: `mi_cuenta.logout.titulo`,
            glosa: `mi_cuenta.logout.descripcion`,
            show: buttons.usuario.children.logout,
          },
        ],
      },
    ];
  }
}
