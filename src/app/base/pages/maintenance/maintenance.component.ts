import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { InitService } from '../../services/init.service';
import { PanelControlService } from '../../services/panel_control.service';
import { PortalService } from '../../services/portal.service';
import { ThemeService } from '../../services/theme.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-maintenance',
  templateUrl: './maintenance.component.html',
  styleUrls: ['./maintenance.component.css'],
})
export class MaintenanceComponent {
  constructor(
    private config: InitService,
    private panelControlService: PanelControlService,
    private router: Router,
    private portalService: PortalService,
    private themeService: ThemeService,
  ) {
    this.state = this.router.getCurrentNavigation()?.extras?.state;
  }

  theme: string = this.config.get('system.theme.themes.default');
  state!: any;
  mail_soporte: string = this.config.get('sites.dtic.support');
  icons: any = this.config.get('system.icons');
  showBack: boolean = this.config.get('system.token');
  sub!: Subscription;

  ngOnInit() {
    this.sub = this.themeService.theme$.subscribe((e: any) => {
      this.theme = e.theme;
    });
    this.theme = this.themeService.getTheme();
  }

  async goBack() {
    switch (this.state.mode) {
      case 'menu':
        await this.panelControlService.homeNavigate(this.router);
        break;
      case 'modulo':
        this.portalService.backToPortalRx.next({});
        break;
    }
  }

  ngOnDestroy() {
    if (this.sub) this.sub.unsubscribe();
  }
}
