import { Component, Input, ViewChild } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../models/usuario';
import { InitService } from '../../services/init.service';
import { MiCuentaComponent } from './mi-cuenta/mi-cuenta.component';
import { AyudaComponent } from './ayuda/ayuda.component';
import { SistemasComponent } from './sistemas/sistemas.component';
import { PortalService } from '../../services/portal.service';
import { PanelControlService } from '../../services/panel_control.service';
import { AvisosComponent } from './avisos/avisos.component';
import { MenusComponent } from './menus/menus.component';
import { TemasComponent } from './temas/temas.component';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  @Input() blocking: boolean = false;
  @Input() blocking_session: boolean = false;

  @ViewChild('ayuda') ayuda!: AyudaComponent;
  @ViewChild('miCuenta') miCuenta!: MiCuentaComponent;
  @ViewChild('sistemas') sistemas!: SistemasComponent;
  @ViewChild('menus') menus!: MenusComponent;
  @ViewChild('avisos') avisos!: AvisosComponent;
  @ViewChild('temas') temas!: TemasComponent;

  constructor(
    private usuarioService: UsuarioService,
    private config: InitService,
    private portalService: PortalService,
    private panelControlService: PanelControlService,
    private themeService: ThemeService,
  ) {}

  theme: string = this.config.get('system.theme.themes.default');
  usuario: Usuario = this.usuarioService.getUserOnline();
  title: string = this.config.get('system.name');
  uvname: string = this.config.get('sites.uv.name');
  icons: any = this.config.get('system.icons');
  avisos_count: number = 0;

  isToken: boolean = this.config.get('system.token');
  showVolverPortal_b: boolean = this.config.get('system.buttons.portal');
  showAyuda_b: boolean = this.config.get('system.buttons.ayuda.active');
  showMiCuenta_b: boolean = this.config.get('system.buttons.usuario.active');
  showSistemas_b: boolean = this.config.get('system.buttons.sistemas.active');
  showAvisos_b: boolean = this.config.get('system.buttons.avisos');
  showMenus_b: boolean = this.config.get('system.buttons.menus.active');
  showTheme_b: boolean = this.config.get('system.buttons.theme.active');

  ngOnInit(): void {
    this.panelControlService.modulos$.subscribe((e: any) => {
      if (e.active) this.title = e.active.nombre;
    });
    this.themeService.theme$.subscribe((e: any) => {
      this.theme = e.theme;
    });
  }

  goBackPortal(): void {
    this.portalService.backToPortalRx.next({});
  }

  showAyuda(): void {
    this.ayuda.showAyuda = true;
  }

  showMiCuenta(): void {
    this.miCuenta.showMiCuenta = true;
  }

  showSistemas(): void {
    if (!this.blocking) this.sistemas.showSistemas = true;
  }

  showAvisos(): void {
    this.avisos.showAvisos = true;
  }

  showMenus(): void {
    if (!this.blocking) this.menus.showMenus = true;
  }

  showTheme(): void {
    this.temas.showTemas = true;
  }
}
