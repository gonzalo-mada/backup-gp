import { Component } from '@angular/core';
import { InitService } from '../../services/init.service';
import { ThemeService } from '../../services/theme.service';
import { Subscription } from 'rxjs';
import { WindowService } from '../../services/window.service';

@Component({
  selector: 'app-session',
  templateUrl: './session.component.html',
  styleUrls: ['./session.component.css'],
})
export class SessionComponent {
  constructor(
    private config: InitService,
    private themeService: ThemeService,
    private windowService: WindowService,
  ) {}

  mail_soporte: string = this.config.get('sites.dtic.support');
  icons: any = this.config.get('system.icons');
  theme: string = this.config.get('system.theme.themes.default');
  sub!: Subscription;

  ngOnInit() {
    this.sub = this.themeService.theme$.subscribe((e: any) => {
      this.theme = e.theme;
    });
    this.theme = this.themeService.getTheme();
  }

  logout() {
    this.windowService.clearSessionStorage();
    this.windowService.replaceLocation(this.config.get('system.url.portal'));
  }

  ngOnDestroy() {
    if (this.sub) this.sub.unsubscribe();
  }
}
