import { Component } from '@angular/core';
import { InitService } from '../../services/init.service';
import { DEFAULT_INTERRUPTSOURCES, Idle } from '@ng-idle/core';
import { WindowService } from '../../services/window.service';

@Component({
  selector: 'app-idle',
  templateUrl: './idle.component.html',
  styleUrls: ['./idle.component.css'],
})
export class IdleComponent {
  constructor(
    private idle: Idle,
    private config: InitService,
    private windowService: WindowService,
  ) {}

  showIdle: boolean = false;

  ngOnInit(): void {
    if (this.config.get('idle.active') && this.config.get('system.token')) {
      this.idle.setIdle(0.1);
      this.idle.setTimeout(this.config.get('idle.times.session'));
      this.idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

      this.idle.onTimeout.subscribe(() => {
        this.showIdle = false;
        this.windowService.clearSessionStorage();
        this.windowService.replaceLocation(
          this.config.get('system.url.portal'),
        );
      });

      this.idle.onTimeoutWarning.subscribe((countdown) => {
        if (countdown === this.config.get('idle.times.alert')) {
          this.showIdle = true;
        }
      });

      this.idle.watch();
    }
  }

  reset(): void {
    this.showIdle = false;
    this.idle.watch();
  }
}
