import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { IdleComponent } from './idle.component';
import { Idle, NgIdleModule, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import { TestingBaseModule } from '../../modules/testing.module';
import { InitService } from '../../services/init.service';
import { WindowService } from '../../services/window.service';
import { InitServiceMock } from '../../test/mocks/init.service.mock';
import { WindowServiceMock } from '../../test/mocks/window.service.mock';

describe('IdleComponent', () => {
  let component: IdleComponent;
  let fixture: ComponentFixture<IdleComponent>;
  let idle: Idle;
  let windowServiceMock: WindowServiceMock;

  const config = {
    idle: {
      active: true,
      times: {
        session: 900,
        alert: 180,
      },
    },
    system: {
      token: true,
      url: {
        portal: 'https://portal.uv.cl',
      },
    },
  };

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [TestingBaseModule, NgIdleModule.forRoot()],
      declarations: [IdleComponent],
      providers: [
        {
          provide: InitService,
          useValue: new InitServiceMock(config),
        },
        Idle,
        { provide: WindowService, useClass: WindowServiceMock },
      ],
    });
  });

  beforeEach(() => {
    windowServiceMock = TestBed.inject(WindowService);
    idle = TestBed.inject(Idle);

    fixture = TestBed.createComponent(IdleComponent);
    component = fixture.componentInstance;
  });

  it('[1] Existe', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
    expect(component.showIdle).toBeFalse();
  });

  it('[2] Inicia monitoreo: idle', () => {
    spyOn(idle, 'setIdle').and.returnValue(0.1);
    spyOn(idle, 'setTimeout').and.returnValue(900);
    spyOn(idle, 'setInterrupts').and.callThrough();
    spyOn(idle, 'watch').and.callThrough();

    fixture.detectChanges();
    expect(component).toBeTruthy();

    expect(idle.setIdle).toHaveBeenCalledWith(0.1);
    expect(idle.setTimeout).toHaveBeenCalledWith(900);
    expect(idle.setInterrupts).toHaveBeenCalledWith(DEFAULT_INTERRUPTSOURCES);
    expect(idle.watch).toHaveBeenCalled();
  });

  it('[3] Emite una alerta a los 180 segundos restantes: sino hace caso se redirige al login', fakeAsync(() => {
    spyOn(idle.onTimeoutWarning, 'emit').and.callThrough();
    spyOn(idle.onTimeout, 'emit').and.callThrough();

    idle.onTimeoutWarning.subscribe((countdown) => {
      if (countdown < 180) expect(component.showIdle).toBeTrue();
      else expect(component.showIdle).toBeFalse();
    });

    idle.onTimeout.subscribe(() => {
      expect(component.showIdle).toBeTrue();
    });

    fixture.detectChanges();
    tick(900000);
  }));

  it('[4] Reiniciar idle: reset()', () => {
    spyOn(idle, 'watch').and.callThrough();

    fixture.detectChanges();
    component.reset();

    expect(component.showIdle).toBeFalse();
    expect(idle.watch).toHaveBeenCalled();
  });
});
