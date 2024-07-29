import { Component } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { InitService } from 'src/app/base/services/init.service';
import { SystemService } from 'src/app/base/services/system.service';
import { ThemeService } from 'src/app/base/services/theme.service';
import { UsuarioService } from 'src/app/base/services/usuario.service';
import { WindowService } from 'src/app/base/services/window.service';
import { ErrorTemplateHandler } from 'src/app/base/tools/error/error.handler';

@Component({
  selector: 'app-temas',
  templateUrl: './temas.component.html',
  styleUrls: ['./temas.component.css'],
})
export class TemasComponent {
  constructor(
    private themeService: ThemeService,
    private config: InitService,
    private systemService: SystemService,
    private usuarioService: UsuarioService,
    private primengConfig: PrimeNGConfig,
    private errorTemplateHandler: ErrorTemplateHandler,
    private windowService: WindowService,
  ) {}

  showTemas: boolean = false;

  themes: string[] = this.config.get('system.theme.themes.values');
  theme: string = this.config.get('system.theme.themes.default');

  fontSize_position: number[] = [];
  fontSize_min: number = this.config.get('system.theme.fontSize.min');
  fontSize_max: number = this.config.get('system.theme.fontSize.max');
  font: number = this.config.get('system.theme.fontSize.default');

  cursorSize: string = 'normal';

  langs: any[] = this.config.get('system.theme.translate.langs');
  lang: string = '';
  langSelected!: any;
  langActive: boolean = this.config.get('system.theme.translate.active');

  ngOnInit(): void {
    for (let i = this.fontSize_min; i <= this.fontSize_max; i++) {
      this.fontSize_position.push(i);
    }

    if (this.windowService.getItemSessionStorage('theme') != '') {
      this.theme = this.windowService.getItemSessionStorage('theme');
    }

    this.langSelected = this.langs.find(
      (e: any) =>
        e.code ===
        (this.langActive
          ? this.usuarioService.getUserOnline().idioma
          : this.config.get('system.theme.translate.default')),
    );
    this.lang = this.langSelected.code;

    this.selectTheme(this.theme);
    this.changeFontsize(0);
  }

  /** THEME */
  selectTheme(theme: string): void {
    this.themeService.switchTheme(theme);
    this.theme = theme;
    this.windowService.setItemSessionStorage('theme', theme);
  }

  /** FONTSIZE */
  changeFontsize(level: number): void {
    this.font += level;
    this.themeService.changeFontsize(this.font);
  }

  selectFontsize(fs: number): void {
    this.font = fs;
    this.themeService.changeFontsize(this.font);
  }

  /** CURSOR */
  changeCursorSize(size: string): void {
    this.cursorSize = size;
    this.themeService.changeCursorsize(size);
  }

  /** TRANSLATE */
  changeLang(event: any): void {
    if (event.originalEvent) {
      if (this.config.get('system.token')) {
        this.usuarioService
          .saveIdioma(event.value)
          .then(() => {
            this.setLang(event.value);
          })
          .catch((e) => {
            this.errorTemplateHandler.processError(e, {
              notifyMethod: 'none',
              message: 'Hubo un error al guardar el idioma preferido.',
            });
          });
      } else {
        this.setLang(event.value);
      }
    }
  }

  private setLang(lang: string): void {
    this.langSelected = this.langs.find((e: any) => e.code === lang);
    this.usuarioService.getUserOnline().idioma = lang;
    this.usuarioService.setLang(lang);
    this.systemService.setTranslation(lang, this.primengConfig);
    this.windowService.setItemSessionStorage('lang', lang);
  }
}
