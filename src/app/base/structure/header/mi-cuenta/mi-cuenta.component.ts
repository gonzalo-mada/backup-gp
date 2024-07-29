import { Component } from '@angular/core';
import { Usuario } from 'src/app/base/models/usuario';
import { UsuarioService } from 'src/app/base/services/usuario.service';
import { HeaderUtils } from 'src/app/base/tools/utils/header.utils';
import { SystemService } from 'src/app/base/services/system.service';
import { InitService } from 'src/app/base/services/init.service';
import { ThemeService } from 'src/app/base/services/theme.service';
import { WindowService } from 'src/app/base/services/window.service';

@Component({
  selector: 'app-mi-cuenta',
  templateUrl: './mi-cuenta.component.html',
  styleUrls: ['./mi-cuenta.component.css'],
})
export class MiCuentaComponent {
  constructor(
    private headerUtils: HeaderUtils,
    private usuarioService: UsuarioService,
    private systemService: SystemService,
    private config: InitService,
    private themeService: ThemeService,
    private windowService: WindowService,
  ) {}

  theme: string = this.config.get('system.theme.themes.default');
  usuario: Usuario = this.usuarioService.getUserOnline();
  miCuentaButtons: any;
  showMiCuenta: boolean = false;
  icon_logout: any = this.config.get('system.icons.logout');
  show: any = this.config.get('system.buttons.usuario.children');
  isToken: boolean = this.config.get('system.token');

  ngOnInit(): void {
    this.systemService.translate$.subscribe((e: any) => {
      this.setMiCuentaButtons();
    });
    this.themeService.theme$.subscribe((e: any) => {
      this.theme = e.theme;
    });
  }

  ngAfterViewInit(): void {
    this.setMiCuentaButtons();
  }

  private async setMiCuentaButtons(): Promise<void> {
    this.miCuentaButtons = await this.headerUtils.getMiCuentaButtons();
  }

  logout(): void {
    this.windowService.clearSessionStorage();
    this.windowService.replaceLocation(this.config.get('system.url.portal'));
  }
}
