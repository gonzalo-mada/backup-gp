import { Component } from '@angular/core';
import { PanelControlService } from '../../services/panel_control.service';
import { InitService } from '../../services/init.service';
import { WindowService } from '../../services/window.service';
import { SystemService } from '../../services/system.service';

declare var $: any;

@Component({
  selector: 'app-main-loading',
  templateUrl: './main-loading.component.html',
  styleUrls: ['./main-loading.component.css'],
})
export class MainLoadingComponent {
  constructor(
    private config: InitService,
    private panelControlService: PanelControlService,
    private windowService: WindowService,
    private systemService: SystemService,
  ) {}

  title: string = this.config.get('system.name');
  logouv: string = this.config.get(
    `system.url.logouv.main_loading.${this.config.get('system.theme.themes.default')}`,
  );
  theme: string = this.config.get('system.theme.themes.default');

  ngOnInit() {
    this.systemService.mainLoading$.subscribe((e: any) => {
      if (e.loading) {
        $('.spinner-overlay').css('display', 'flex');
      } else {
        $('.spinner-overlay').delay(1000).fadeOut('slow');
      }
    });
    if (this.windowService.getItemSessionStorage('theme') != '') {
      this.theme = this.windowService.getItemSessionStorage('theme');
      this.logouv = this.config.get(
        `system.url.logouv.main_loading.${this.theme}`,
      );
    }
    this.panelControlService.modulos$.subscribe((e: any) => {
      this.title = e.active ? e.active.nombre : this.config.get('system.name');
    });
  }
}
