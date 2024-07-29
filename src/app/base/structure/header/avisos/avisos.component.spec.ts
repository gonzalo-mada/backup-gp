import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { AvisosComponent } from './avisos.component';
import { InitService } from 'src/app/base/services/init.service';
import { PortalService } from 'src/app/base/services/portal.service';
import { Aviso } from 'src/app/base/models/aviso';
import { TestingBaseModule } from 'src/app/base/modules/testing.module';
import { ErrorTemplateHandler } from 'src/app/base/tools/error/error.handler';
import { MenuItem } from 'primeng/api';
import { ErrorTemplateHandlerMock } from 'src/app/base/test/mocks/error-template.mock';
import { InitServiceMock } from 'src/app/base/test/mocks/init.service.mock';
import { PortalServiceMock } from 'src/app/base/test/mocks/portal.service.mock';

describe('AvisosComponent', () => {
  let component: AvisosComponent;
  let fixture: ComponentFixture<AvisosComponent>;
  let portalServiceMock: PortalServiceMock;
  let errorTemplateHandlerMock: ErrorTemplateHandlerMock;

  const aviso: Aviso = {
    id: '123',
    name: 'test',
    body: 'este es un aviso',
    date: '2023/12/18',
  };

  const config = {
    system: {
      data: {
        avisos: true,
      },
      token: true,
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestingBaseModule],
      declarations: [AvisosComponent],
      providers: [
        {
          provide: PortalService,
          useClass: PortalServiceMock,
        },
        {
          provide: InitService,
          useValue: new InitServiceMock(config),
        },
        {
          provide: ErrorTemplateHandler,
          useClass: ErrorTemplateHandlerMock,
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    errorTemplateHandlerMock = TestBed.inject(ErrorTemplateHandler) as any;
    portalServiceMock = TestBed.inject(PortalService);

    fixture = TestBed.createComponent(AvisosComponent);
    component = fixture.componentInstance;
  });

  it('[1] Existe', () => {
    spyOn(component, 'getAvisos').and.callFake(() => null);
    fixture.detectChanges();
    expect(component).toBeTruthy();
    expect(component.getAvisos).toHaveBeenCalled();
    expect(component.showAvisos).toBeFalse();
    expect(component.show).toBeFalse();
    expect(typeof component.aviso).toBe('undefined');
    expect(component.avisos.length).toBeGreaterThanOrEqual(0);
  });

  it('[2] Obtener avisos: getAvisos() :: success', fakeAsync(() => {
    spyOn(portalServiceMock, 'getAvisos').and.callThrough();
    spyOn(component as any, 'setAvisos').and.callFake(() => []);
    component.getAvisos();
    tick();
    expect(portalServiceMock.getAvisos).toHaveBeenCalled();
    expect(component['setAvisos']).toHaveBeenCalled();
  }));

  it('[3] Obtener avisos: getAvisos() :: error', fakeAsync(() => {
    spyOn(portalServiceMock, 'getAvisos').and.returnValue(Promise.reject());
    spyOn(errorTemplateHandlerMock, 'processError').and.callFake(() => null);
    component.getAvisos();
    tick();
    expect(errorTemplateHandlerMock.processError).toHaveBeenCalled();
    expect(component.avisos.length).toBe(0);
  }));

  it('[4] Procesar avisos: setAvisos() :: con avisos', () => {
    const tmp: MenuItem[] = component['setAvisos']([aviso]);
    expect(tmp.length).toBeGreaterThan(0);
  });

  it('[5] Procesar avisos: setAvisos() :: sin avisos', () => {
    const tmp: MenuItem[] = component['setAvisos']([]);
    expect(tmp.length).toBe(0);
  });

  it('[6] Mostrar aviso: showAviso()', fakeAsync(() => {
    spyOn(portalServiceMock, 'getAvisos').and.returnValue(
      Promise.resolve([aviso]),
    );
    component.getAvisos();
    tick();
    expect(portalServiceMock.getAvisos).toHaveBeenCalled();
    if (component.avisos[0].command) {
      component.avisos[0].command({});
      expect(component.show).toBeTrue();
    }
  }));
});
