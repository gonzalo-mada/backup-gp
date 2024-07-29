import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { PrimeNGConfig } from 'primeng/api';
import { Title } from '@angular/platform-browser';

const caracteres =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

@Injectable({
  providedIn: 'root',
})
export class SystemService {
  constructor(
    public translateService: TranslateService,
    private titleUtils: Title,
  ) {}

  private loadingSubject = new Subject<object>();
  loading$ = this.loadingSubject.asObservable();

  private mainLoadingSubject = new Subject<object>();
  mainLoading$ = this.mainLoadingSubject.asObservable();

  private translateSubject = new Subject<object>();
  translate$ = this.translateSubject.asObservable();

  private sitename: string = '';

  mainLoading(show: boolean): void {
    this.mainLoadingSubject.next({ loading: show });
  }

  loading(active: boolean, options?: any): void {
    var object = options != null ? options : {};
    object['active'] = active;
    this.loadingSubject.next(object);
  }

  setTranslation(lang: any, primengConfig: PrimeNGConfig): void {
    this.translateService.setDefaultLang(lang);
    this.translateService.use(lang);
    this.translateService.get('primeng').subscribe((lg) => {
      primengConfig.setTranslation(lg);
    });
    this.translateSubject.next(lang);
  }

  async translate(flags: string[], values?: any): Promise<Object> {
    return await new Promise((t) => {
      this.translateService.get(flags, values || {}).subscribe((r) => t(r));
    });
  }

  getCurrentLang(): string {
    return this.translateService.currentLang;
  }

  setTitle(sitename: string, title?: string): void {
    this.sitename = sitename;
    this.titleUtils.setTitle(`${sitename}${title ? ' - ' + title : ''}`);
  }

  getSitename(): string {
    return this.sitename;
  }

  getHash(limit: number): string {
    var id = '';
    for (var i = 0; i < limit; i++) {
      id += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    }
    return id;
  }
}
