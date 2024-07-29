import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable()
export class ThemeServiceMock {
  private themeRx = new Subject<object>();
  public theme$: Observable<object> = this.themeRx.asObservable();

  protected theme: string = 'light';

  switchTheme(theme: string): void {
    this.theme = theme;
    this.themeRx.next({ theme: theme });
  }

  changeFontsize(font: number): void {}

  changeCursorsize(size: string): void {}

  getTheme(): string {
    return this.theme;
  }
}
