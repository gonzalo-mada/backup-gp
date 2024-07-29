import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PanelControlService } from '../../services/panel_control.service';
import { InitService } from '../../services/init.service';
import { MenuItem } from 'primeng/api';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.css'],
})
export class BreadcrumbComponent {
  constructor(
    private router: Router,
    private config: InitService,
    private panelControlService: PanelControlService,
    private themeService: ThemeService,
  ) {}

  theme: string = this.config.get('system.theme.themes.default');
  breadCrumb: any[] = [];
  show: boolean = this.config.get('system.breadcrumb');
  home: MenuItem = {
    icon: this.config.get('system.icons.home'),
    command: async () => {
      await this.goHome();
    },
  };

  ngOnInit() {
    if (this.show) {
      this.panelControlService.navigate$.subscribe((res: any) => {
        this.breadCrumb = res.breadcrumb || [];
      });
    }
    this.themeService.theme$.subscribe((e: any) => {
      this.theme = e.theme;
    });
  }

  async goHome() {
    await this.panelControlService.homeNavigate(this.router);
  }
}
