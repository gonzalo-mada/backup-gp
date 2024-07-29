import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { InitService } from '../../services/init.service';
import { ThemeService } from '../../services/theme.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css'],
})
export class ErrorComponent {
  constructor(
    private config: InitService,
    private router: Router,
    private themeService: ThemeService,
  ) {
    this.state = this.router.getCurrentNavigation()?.extras?.state;
  }

  state!: any;
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

  ngOnDestroy() {
    if (this.sub) this.sub.unsubscribe();
  }
}
