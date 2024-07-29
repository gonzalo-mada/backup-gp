import { Component } from '@angular/core';
import { InitService } from '../../services/init.service';
import { PanelControlService } from '../../services/panel_control.service';
import { Router } from '@angular/router';
import { ThemeService } from '../../services/theme.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.css'],
})
export class NotFoundComponent {
  constructor(
    private config: InitService,
    private panelControlService: PanelControlService,
    private router: Router,
    private themeService: ThemeService,
  ) {}

  theme: string = this.config.get('system.theme.themes.default');
  mail_soporte: string = this.config.get('sites.dtic.support');
  homeIcon: string = this.config.get('system.icons.home');
  sub!: Subscription;

  ngOnInit() {
    this.sub = this.themeService.theme$.subscribe((e: any) => {
      this.theme = e.theme;
    });
    this.theme = this.themeService.getTheme();
  }

  async goHome() {
    await this.panelControlService.homeNavigate(this.router);
  }

  ngOnDestroy() {
    if (this.sub) this.sub.unsubscribe();
  }
}
