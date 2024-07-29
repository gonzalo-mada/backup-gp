import { Injectable } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { Subject } from 'rxjs';

@Injectable()
export class SystemServiceMock {
  private loadingSubject = new Subject<object>();
  loading$ = this.loadingSubject.asObservable();

  private mainLoadingSubject = new Subject<object>();
  mainLoading$ = this.mainLoadingSubject.asObservable();

  private translateSubject = new Subject<object>();
  translate$ = this.translateSubject.asObservable();

  private sitename: string = '';

  mainLoading(show: boolean): void {}

  loading(active: boolean, options?: any): void {}

  setTranslation(lang: any, primengConfig: PrimeNGConfig): void {}

  async translate(flags: string[], values?: any): Promise<Object> {
    return Promise.resolve({});
  }

  getCurrentLang(): string {
    return 'es';
  }

  setTitle(sitename: string, title?: string): void {}

  getSitename(): string {
    return 'ANGULAR UNIT TEST';
  }

  getHash(limit: number): string {
    return 'abc123';
  }
}
