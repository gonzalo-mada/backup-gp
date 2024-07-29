import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class WindowService {
  get window(): Window {
    return window;
  }

  replaceLocation(url: string | URL): void {
    this.window.location.replace(url);
  }

  clearSessionStorage(): void {
    this.window.sessionStorage.clear();
  }

  getItemSessionStorage(key: string): string {
    return this.window.sessionStorage.getItem(key) || '';
  }

  setItemSessionStorage(key: string, value: string): void {
    this.window.sessionStorage.setItem(key, value);
  }

  replaceState(data: any, unused: string, url?: string | URL | null): void {
    this.window.history.replaceState(data, unused, url);
  }

  openUrl(url?: string | URL, target?: string, features?: string): void {
    this.window.open(url, target, features);
  }
}
