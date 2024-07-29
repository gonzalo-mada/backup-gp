import { Component } from '@angular/core';
import { InitService } from '../../services/init.service';
import { SystemService } from '../../services/system.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { WindowService } from '../../services/window.service';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css'],
})
export class LoadingComponent {
  constructor(
    private config: InitService,
    private systemService: SystemService,
    private spinnerService: NgxSpinnerService,
    private windowService: WindowService,
    private themeService: ThemeService,
  ) {}

  loading: any = {
    msgs: this.config.get('system.name'),
  };
  theme: string = this.config.get('system.theme.themes.default');

  ngOnInit() {
    if (this.windowService.getItemSessionStorage('theme') != '') {
      this.theme = this.windowService.getItemSessionStorage('theme');
    }
    this.themeService.theme$.subscribe((e: any) => {
      this.theme = e.theme;
    });
    this.systemService.loading$.subscribe(async (e: any) => {
      var t: any = await this.systemService.translate(['loading']);
      if (e.active) {
        this.loading.msgs = e.hasOwnProperty('msgs') ? e.msgs : t['loading'];
        this.spinnerService.show(undefined, {
          bdColor: e.hasOwnProperty('bdColor')
            ? e.bdColor
            : this.config.get(`spinner_loading.${this.theme}.bdColor`),
          color: e.hasOwnProperty('color')
            ? e.color
            : this.config.get(`spinner_loading.${this.theme}.color`),
          size: 'medium',
          fullScreen: true,
        });
      } else this.spinnerService.hide();
    });
  }
}
