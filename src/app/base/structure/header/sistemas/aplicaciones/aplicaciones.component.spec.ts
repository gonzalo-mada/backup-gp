import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { AplicacionesComponent } from './aplicaciones.component';
import { InitService } from 'src/app/base/services/init.service';
import { of } from 'rxjs';
import { ThemeService } from 'src/app/base/services/theme.service';
import { PanelControlService } from 'src/app/base/services/panel_control.service';
import { SystemService } from 'src/app/base/services/system.service';
import { ErrorTemplateHandler } from 'src/app/base/tools/error/error.handler';
import { PortalService } from 'src/app/base/services/portal.service';
import { TestingBaseModule } from 'src/app/base/modules/testing.module';
import { WindowService } from 'src/app/base/services/window.service';
import { PanelControlServiceMock } from 'src/app/base/test/mocks/panel_control.service.mock';
import { SystemServiceMock } from 'src/app/base/test/mocks/system.service.mock';
import { PortalServiceMock } from 'src/app/base/test/mocks/portal.service.mock';
import { WindowServiceMock } from 'src/app/base/test/mocks/window.service.mock';
import { ErrorTemplateHandlerMock } from 'src/app/base/test/mocks/error-template.mock';
import { InitServiceMock } from 'src/app/base/test/mocks/init.service.mock';
import { ThemeServiceMock } from 'src/app/base/test/mocks/theme.service.mock';

describe('AplicacionesComponent', () => {
  let component: AplicacionesComponent;
  let fixture: ComponentFixture<AplicacionesComponent>;
  let panelControlServiceMock: PanelControlServiceMock;
  let systemServiceMock: SystemServiceMock;
  let portalServiceMock: PortalServiceMock;
  let windowServiceMock: WindowServiceMock;
  let errorTemplateHandlerMock: ErrorTemplateHandlerMock;
  let themeServiceMock: ThemeServiceMock;

  const config: any = {
    system: {
      data: {
        aplicaciones: true,
      },
      theme: {
        active: true,
        themes: {
          default: 'light',
        },
      },
    },
  };

  const translate: any = {
    sistemas: { aplicaciones: { error_get: '', error_navigate: '' } },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestingBaseModule],
      declarations: [AplicacionesComponent],
      providers: [
        {
          provide: InitService,
          useValue: new InitServiceMock(config),
        },
        {
          provide: ThemeService,
          useClass: ThemeServiceMock,
        },
        {
          provide: PanelControlService,
          useClass: PanelControlServiceMock,
        },
        {
          provide: SystemService,
          useClass: SystemServiceMock,
        },
        {
          provide: ErrorTemplateHandler,
          useClass: ErrorTemplateHandlerMock,
        },
        {
          provide: PortalService,
          useClass: PortalServiceMock,
        },
        { provide: WindowService, useClass: WindowServiceMock },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    errorTemplateHandlerMock = TestBed.inject(ErrorTemplateHandler) as any;
    panelControlServiceMock = TestBed.inject(PanelControlService) as any;
    systemServiceMock = TestBed.inject(SystemService) as any;
    portalServiceMock = TestBed.inject(PortalService);
    windowServiceMock = TestBed.inject(WindowService);
    themeServiceMock = TestBed.inject(ThemeService) as any;

    config.system.data.aplicaciones = true;

    fixture = TestBed.createComponent(AplicacionesComponent);
    component = fixture.componentInstance;
  });

  it('[1] Existe', () => {
    spyOn(component, 'getAplicaciones').and.callFake(() => Promise.resolve());
    fixture.detectChanges();
    expect(component).toBeTruthy();
    expect(component.getAplicaciones).toHaveBeenCalled();
    expect(component.theme).toBe('light');
  });

  it('[2] Evento: theme', () => {
    fixture.detectChanges();
    themeServiceMock['themeRx'].next({ theme: 'light' });
    expect(component.theme).toBe('light');
  });

  it('[3] Obtener aplicaciones: getAplicaciones() :: success :: activo', fakeAsync(() => {
    spyOn(portalServiceMock, 'gotoApp').and.callFake(() => Promise.resolve());
    spyOn(panelControlServiceMock, 'getAplicaciones').and.callThrough();
    spyOn(windowServiceMock, 'getItemSessionStorage').and.returnValue('token');
    spyOn(panelControlServiceMock['aplicacionesRx'], 'next').and.callThrough();

    component.getAplicaciones();
    tick();

    expect(panelControlServiceMock.getAplicaciones).toHaveBeenCalled();
    expect(windowServiceMock.getItemSessionStorage).toHaveBeenCalledWith(
      'proyecto',
    );
    expect(component.active).not.toBeFalsy();
    expect(component.active?.id).toBe('abc123');
    expect(panelControlServiceMock['aplicacionesRx'].next).toHaveBeenCalled();
    expect(component.aplicaciones.length).toBeGreaterThan(0);
  }));

  it('[4] Obtener aplicaciones: getAplicaciones() :: error :: activo', fakeAsync(() => {
    spyOn(systemServiceMock, 'translate').and.returnValue(
      Promise.resolve(of(translate)),
    );
    spyOn(panelControlServiceMock, 'getAplicaciones').and.returnValue(
      Promise.reject(),
    );
    spyOn(errorTemplateHandlerMock, 'processError').and.callFake(() => null);

    component.getAplicaciones();
    tick();

    expect(panelControlServiceMock.getAplicaciones).toHaveBeenCalled();
    expect(systemServiceMock.translate).toHaveBeenCalledWith([
      'sistemas.aplicaciones.error_get',
    ]);
    expect(errorTemplateHandlerMock.processError).toHaveBeenCalled();
  }));

  it('[5] Obtener aplicaciones: getAplicaciones() :: activo', fakeAsync(() => {
    config.system.data.aplicaciones = false;

    spyOn(panelControlServiceMock['aplicacionesRx'], 'next').and.callThrough();

    component.getAplicaciones();
    tick();

    expect(component.active).toBeFalsy();
    expect(panelControlServiceMock['aplicacionesRx'].next).toHaveBeenCalled();
    expect(component.aplicaciones.length).toBe(0);
  }));

  it('[6] Procesar aplicaciones: setAplicacionesPanelMenu()', fakeAsync(() => {
    spyOn(component, 'getAplicaciones').and.callThrough();
    spyOn(panelControlServiceMock, 'getAplicaciones').and.callThrough();
    spyOn(component as any, 'setAplicacionesPanelMenu').and.callThrough();

    fixture.detectChanges();
    tick();

    expect(panelControlServiceMock.getAplicaciones).toHaveBeenCalled();
    expect(component['setAplicacionesPanelMenu']).toHaveBeenCalled();
    expect(component.aplicaciones.length).toBeGreaterThan(0);
  }));

  it('[7] Navega aplicación: goToAplicacion() :: success', async () => {
    spyOn(portalServiceMock, 'gotoApp').and.callFake(() => Promise.resolve());
    spyOn(panelControlServiceMock, 'getAplicaciones').and.callThrough();

    await component.getAplicaciones();

    expect(panelControlServiceMock.getAplicaciones).toHaveBeenCalled();
    expect(component.aplicaciones.length).toBeGreaterThan(0);

    if (component.aplicaciones[0].command) {
      component.aplicaciones[0].command({});
      expect(portalServiceMock.gotoApp).toHaveBeenCalled();
    }
  });

  it('[8] Navega aplicación: goToAplicacion() :: error', async () => {
    spyOn(systemServiceMock, 'translate').and.returnValue(
      Promise.resolve(of(translate)),
    );
    spyOn(portalServiceMock, 'gotoApp').and.throwError('');
    spyOn(panelControlServiceMock, 'getAplicaciones').and.callThrough();
    spyOn(errorTemplateHandlerMock, 'processError').and.callFake(() => null);

    await component.getAplicaciones();

    expect(panelControlServiceMock.getAplicaciones).toHaveBeenCalled();
    expect(component.aplicaciones.length).toBeGreaterThan(0);

    if (component.aplicaciones[0].command) {
      await component.aplicaciones[0].command({});
      expect(portalServiceMock.gotoApp).toHaveBeenCalled();
      expect(systemServiceMock.translate).toHaveBeenCalledWith([
        'sistemas.aplicaciones.error_navigate',
      ]);
      expect(errorTemplateHandlerMock.processError).toHaveBeenCalled();
    }
  });
});
