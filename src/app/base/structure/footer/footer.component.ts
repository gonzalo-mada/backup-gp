import { Component } from '@angular/core';
import { InitService } from '../../services/init.service';
import { PanelControlService } from '../../services/panel_control.service';
import { ThemeService } from '../../services/theme.service';
import { WindowService } from '../../services/window.service';
import packageInfo from '../../../../../package.json';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
})
export class FooterComponent {
  constructor(
    private config: InitService,
    private panelControlService: PanelControlService,
    private themeService: ThemeService,
    private windowService: WindowService,
  ) {}

  theme: string = this.config.get('system.theme.themes.default');
  building = this.config.get('sites.uv');
  title: string = this.config.get('system.name');
  logouv: string = this.config.get(
    `system.url.logouv.uv.${this.config.get('system.theme.themes.default')}`,
  );
  version: string = packageInfo.version;

  ngOnInit(): void {
    if (this.windowService.getItemSessionStorage('theme') != '') {
      this.theme = this.windowService.getItemSessionStorage('theme');
      this.logouv = this.config.get(`system.url.logouv.uv.${this.theme}`);
    }
    this.panelControlService.modulos$.subscribe((e: any) => {
      this.title = e.active ? e.active.nombre : this.config.get('system.name');
    });
    this.themeService.theme$.subscribe((e: any) => {
      this.theme = e.theme;
      this.logouv = this.config.get(`system.url.logouv.uv.${e.theme}`);
    });
  }
}
