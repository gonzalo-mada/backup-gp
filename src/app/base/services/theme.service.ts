import { Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private themeRx = new Subject<object>();
  public theme$ = this.themeRx.asObservable();

  protected theme: string = '';

  constructor(@Inject(DOCUMENT) private document: Document) {}

  switchTheme(theme: string): void {
    var core = this.document.getElementById('core-theme') as HTMLLinkElement;
    var uv = this.document.getElementById('uv-theme') as HTMLLinkElement;
    var base = this.document.getElementById('base-theme') as HTMLLinkElement;
    var project = this.document.getElementById(
      'project-theme',
    ) as HTMLLinkElement;
    if (base && uv) {
      core.href = `core-${theme}.css`;
      uv.href = `uv-${theme}.css`;
      base.href = `base-${theme}.css`;
      project.href = `project-${theme}.css`;
      this.theme = theme;
      this.themeRx.next({ theme: theme });
    }
  }

  changeFontsize(font: number): void {
    this.document.documentElement.style.fontSize = `${font}px`;
  }

  changeCursorsize(size: string): void {
    if (size === 'normal')
      this.document.documentElement.classList.remove('bigCursor');
    if (size === 'big')
      this.document.documentElement.classList.add('bigCursor');
  }

  getTheme(): string {
    return this.theme;
  }
}
