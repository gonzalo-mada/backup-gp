import { Injectable } from '@angular/core';
import { NavigationCancel, NavigationStart, Router } from '@angular/router';
import { InitService } from '../services/init.service';
import { filter } from 'rxjs';
import { WindowService } from '../services/window.service';

@Injectable({
  providedIn: 'root',
})
export class BaseRoutingSubscribe {
  constructor(
    private router: Router,
    private config: InitService,
    private windowService: WindowService,
  ) {}

  navigationStart(): void {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationStart))
      .subscribe(() => {
        this.skipLocationChange();
      });
  }

  navigationCancel(): void {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationCancel))
      .subscribe(() => {
        this.skipLocationChange();
        if (this.config.get('system.replaceState')) {
          this.windowService.replaceState('', '', '');
        }
      });
  }

  private skipLocationChange(): void {
    var extras = this.router.getCurrentNavigation()?.extras;
    (extras || {}).skipLocationChange = this.config.get(
      'system.routing.skipLocationChange',
    );
  }
}
