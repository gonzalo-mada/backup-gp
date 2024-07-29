import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import {
  Router,
  NavigationStart,
  NavigationCancel,
  RouterEvent,
} from '@angular/router';
import { Subject, filter, of } from 'rxjs';
import { BaseRoutingSubscribe } from '../base-routing.subscribe';
import { InitService } from '../../services/init.service';
import { WindowService } from '../../services/window.service';
import { InitServiceMock } from '../../test/mocks/init.service.mock';
import { WindowServiceMock } from '../../test/mocks/window.service.mock';

describe('BaseRoutingSubscribe: SERVICE', () => {
  let service: BaseRoutingSubscribe;
  let router: Router;
  let eventsSubject: Subject<RouterEvent>;
  let windowServiceMock: WindowServiceMock;

  const config = {
    sites: {
      dtic: { support: 'soporte@uv.cl' },
    },
    system: {
      routing: {
        skipLocationChange: true,
      },
      replaceState: true,
    },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        BaseRoutingSubscribe,
        {
          provide: InitService,
          useValue: new InitServiceMock(config),
        },
        {
          provide: Router,
          useClass: class {
            navigate = jasmine.createSpy('navigate');
            events = (eventsSubject = new Subject());
            getCurrentNavigation = jasmine.createSpy('getCurrentNavigation');
          },
        },
        { provide: WindowService, useClass: WindowServiceMock },
      ],
    });

    windowServiceMock = TestBed.inject(WindowService);
    router = TestBed.inject(Router);

    service = TestBed.inject(BaseRoutingSubscribe);
  });

  it('[1] Es creado', () => {
    expect(service).toBeTruthy();
  });

  it('[2] Inicio navegación: navigationStart()', fakeAsync(() => {
    var navigationStart: boolean = false;
    router.events
      .pipe(filter((event) => event instanceof NavigationStart))
      .subscribe((event) => {
        navigationStart = true;
      });

    service.navigationStart();
    eventsSubject.next(new NavigationStart(1, '/test'));
    tick();

    expect(navigationStart).toBeTrue();
  }));

  it('[3] Navegación cancelada: navigationCancel()', fakeAsync(() => {
    var navigationCancel: boolean = false;
    spyOn(windowServiceMock, 'replaceState').and.callFake(() => null);

    router.events
      .pipe(filter((event) => event instanceof NavigationCancel))
      .subscribe((event) => {
        navigationCancel = true;
      });

    service.navigationCancel();
    eventsSubject.next(new NavigationCancel(1, '/test', 'Cancelled'));
    tick();

    expect(windowServiceMock.replaceState).toHaveBeenCalled();
    expect(navigationCancel).toBeTrue();
  }));
});
