import { Injectable } from '@angular/core';

@Injectable()
export class WindowServiceMock {
  get window(): Window {
    return window;
  }

  replaceLocation(url: string | URL): void {}

  clearSessionStorage(): void {}

  getItemSessionStorage(key: string): string {
    return '';
  }

  setItemSessionStorage(key: string, value: string): void {}

  replaceState(data: any, unused: string, url?: string | URL | null): void {}

  openUrl(url?: string | URL, target?: string, features?: string): void {}
}
