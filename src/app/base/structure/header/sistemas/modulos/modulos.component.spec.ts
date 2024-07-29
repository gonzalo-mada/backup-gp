import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { ModulosComponent } from './modulos.component';
import { of } from 'rxjs';
import { InitService } from 'src/app/base/services/init.service';
import { ThemeService } from 'src/app/base/services/theme.service';
import { PanelControlService } from 'src/app/base/services/panel_control.service';
import { SystemService } from 'src/app/base/services/system.service';
import { ErrorTemplateHandler } from 'src/app/base/tools/error/error.handler';
import { PortalService } from 'src/app/base/services/portal.service';
import { Modulo } from 'src/app/base/models/modulo';
import { TestingBaseModule } from 'src/app/base/modules/testing.module';
import { Aplicacion } from 'src/app/base/models/aplicacion';
import { WindowService } from 'src/app/base/services/window.service';
import { ThemeServiceMock } from 'src/app/base/test/mocks/theme.service.mock';
import { PanelControlServiceMock } from 'src/app/base/test/mocks/panel_control.service.mock';
import { WindowServiceMock } from 'src/app/base/test/mocks/window.service.mock';
import { SystemServiceMock } from 'src/app/base/test/mocks/system.service.mock';
import { PortalServiceMock } from 'src/app/base/test/mocks/portal.service.mock';
import { ErrorTemplateHandlerMock } from 'src/app/base/test/mocks/error-template.mock';
import { InitServiceMock } from 'src/app/base/test/mocks/init.service.mock';

describe('ModulosComponent', () => {
  let component: ModulosComponent;
  let fixture: ComponentFixture<ModulosComponent>;
  let themeServiceMock: ThemeServiceMock;
  let panelControlServiceMock: PanelControlServiceMock;
  let windowServiceMock: WindowServiceMock;
  let systemServiceMock: SystemServiceMock;
  let portalServiceMock: PortalServiceMock;
  let errorTemplateHandlerMock: ErrorTemplateHandlerMock;

  const modulo_activo: Modulo = {
    cod_modulo: '1234',
    descripcion: '',
    estado: 1,
    estilo: '',
    grupo: 'GRUPO',
    icono: 'icono1',
    nombre: 'ANGULAR 1',
    tipo: 'ANGULAR',
  };

  const modulo_dev: Modulo = {
    cod_modulo: '7897',
    descripcion: '',
    estado: 3,
    estilo: '',
    grupo: 'GRUPO',
    icono: 'icono1',
    nombre: 'ANGULAR DEV',
    tipo: 'ANGULAR',
  };

  const modulo_mantencion: Modulo = {
    cod_modulo: '6546',
    descripcion: '',
    estado: 2,
    estilo: '',
    grupo: 'GRUPO',
    icono: 'icono1',
    nombre: 'ANGULAR MANTENCION',
    tipo: 'ANGULAR',
  };

  const aplicacion_activa: Aplicacion = {
    icono: 'icono1',
    id: 'abc123',
    nombre: 'aplicacion test 1',
    tipo: 'ANGULAR',
  };

  const config = {
    system: {
      data: {
        modulos: true,
      },
      theme: {
        active: true,
        themes: {
          values: ['light', 'dark'],
          default: 'light',
        },
      },
    },
  };

  const translate: any = {
    sistemas: {
      modulos: {
        error_get: '',
        maintenance_navigate: '',
        develop_navigate: '',
        error_navigate: '',
      },
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestingBaseModule],
      declarations: [ModulosComponent],
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
    themeServiceMock = TestBed.inject(ThemeService) as any;
    panelControlServiceMock = TestBed.inject(PanelControlService) as any;
    windowServiceMock = TestBed.inject(WindowService);
    systemServiceMock = TestBed.inject(SystemService) as any;
    portalServiceMock = TestBed.inject(PortalService);
    errorTemplateHandlerMock = TestBed.inject(ErrorTemplateHandler) as any;

    config.system.data.modulos = true;

    fixture = TestBed.createComponent(ModulosComponent);
    component = fixture.componentInstance;
  });

  it('[1] Existe', () => {
    spyOn(component, 'getModulos').and.callFake(() => Promise.resolve());
    fixture.detectChanges();
    expect(component).toBeTruthy();
    expect(component.getModulos).toHaveBeenCalled();
    expect(component.theme).toBe('light');
  });

  it('[2] Evento: theme', () => {
    fixture.detectChanges();
    themeServiceMock['themeRx'].next({ theme: 'light' });
    expect(component.theme).toBe('light');
  });

  it('[3] Evento: aplicación (portal) activa', () => {
    fixture.detectChanges();
    panelControlServiceMock['aplicacionesRx'].next({
      active: aplicacion_activa,
    });
    expect(component.aplicacionActive).not.toBeNull();
    expect(component.aplicacionActive?.id).toBe('abc123');
  });

  it('[4] Obtener modulos: getModulos() :: success :: activo', fakeAsync(() => {
    spyOn(panelControlServiceMock, 'getModulos').and.callThrough();
    spyOn(windowServiceMock, 'getItemSessionStorage').and.returnValue('mod123');
    spyOn(panelControlServiceMock['modulosRx'], 'next').and.callThrough();

    component.getModulos();
    tick();

    expect(panelControlServiceMock.getModulos).toHaveBeenCalled();
    expect(windowServiceMock.getItemSessionStorage).toHaveBeenCalledWith(
      'modulo',
    );
    expect(component.active).not.toBeFalsy();
    expect(component.active?.cod_modulo).toBe('1234');
    expect(panelControlServiceMock['modulosRx'].next).toHaveBeenCalled();
    expect(component.modulos.length).toBeGreaterThan(0);
  }));

  it('[5] Obtener modulos: getModulos() :: error :: activo', fakeAsync(() => {
    spyOn(systemServiceMock, 'translate').and.returnValue(
      Promise.resolve(of(translate)),
    );
    spyOn(panelControlServiceMock, 'getModulos').and.returnValue(
      Promise.reject(),
    );
    spyOn(errorTemplateHandlerMock, 'processError').and.callFake(() => null);

    component.getModulos();
    tick();

    expect(panelControlServiceMock.getModulos).toHaveBeenCalled();
    expect(systemServiceMock.translate).toHaveBeenCalledWith([
      'sistemas.modulos.error_get',
    ]);
    expect(errorTemplateHandlerMock.processError).toHaveBeenCalled();
  }));

  it('[6] Obtener modulos: getModulos() :: inactivo', fakeAsync(() => {
    config.system.data.modulos = false;

    spyOn(panelControlServiceMock['modulosRx'], 'next').and.callThrough();

    component.getModulos();
    tick();

    expect(component.active).toBeFalsy();
    expect(panelControlServiceMock['modulosRx'].next).toHaveBeenCalled();
    expect(component.modulos.length).toBe(0);
  }));

  it('[7] Navega modulo: goToModulo() :: success :: activo', async () => {
    spyOn(panelControlServiceMock, 'getModulos').and.callThrough();
    spyOn(portalServiceMock, 'gotoModule').and.callFake(() =>
      Promise.resolve(),
    );

    await component.getModulos();

    expect(panelControlServiceMock.getModulos).toHaveBeenCalled();
    expect(component.modulos.length).toBeGreaterThan(0);

    if (component.modulos[0].command) {
      await component.modulos[0].command({});
      expect(portalServiceMock.gotoModule).toHaveBeenCalledWith(
        windowServiceMock.getItemSessionStorage('proyecto'),
        modulo_activo.cod_modulo,
      );
    }
  });

  it('[8] Navega modulo: goToModulo() :: success :: en mantención', async () => {
    spyOn(systemServiceMock, 'translate').and.returnValue(
      Promise.resolve(of(translate)),
    );

    spyOn(panelControlServiceMock, 'getModulos').and.callFake(() =>
      Promise.resolve({
        modulos: [modulo_mantencion],
        active: modulo_activo,
      }),
    );

    spyOn(component as any, 'goToModulo').and.callThrough();

    await component.getModulos();

    expect(panelControlServiceMock.getModulos).toHaveBeenCalled();
    expect(component.modulos.length).toBeGreaterThan(0);

    if (component.modulos[0].command) {
      await component.modulos[0].command({});
      expect(component.goToModulo).toHaveBeenCalledWith(modulo_mantencion);
      expect(systemServiceMock.translate).toHaveBeenCalledWith([
        'sistemas.modulos.maintenance_navigate',
        'sistemas.modulos.develop_navigate',
      ]);
    }
  });

  it('[9] Navega modulo: goToModulo() :: success :: en desarrollo', async () => {
    spyOn(systemServiceMock, 'translate').and.returnValue(
      Promise.resolve(of(translate)),
    );

    spyOn(panelControlServiceMock, 'getModulos').and.callFake(() =>
      Promise.resolve({
        modulos: [modulo_dev],
        active: modulo_activo,
      }),
    );

    spyOn(component as any, 'goToModulo').and.callThrough();

    await component.getModulos();

    expect(panelControlServiceMock.getModulos).toHaveBeenCalled();
    expect(component.modulos.length).toBeGreaterThan(0);

    if (component.modulos[0].command) {
      await component.modulos[0].command({});
      expect(component.goToModulo).toHaveBeenCalledWith(modulo_dev);
      expect(systemServiceMock.translate).toHaveBeenCalledWith([
        'sistemas.modulos.maintenance_navigate',
        'sistemas.modulos.develop_navigate',
      ]);
    }
  });

  it('[10] Navega modulo: goToModulo() :: error', async () => {
    spyOn(systemServiceMock, 'translate').and.returnValue(
      Promise.resolve(of(translate)),
    );

    spyOn(panelControlServiceMock, 'getModulos').and.callThrough();
    spyOn(portalServiceMock, 'gotoModule').and.throwError('');
    spyOn(errorTemplateHandlerMock, 'processError').and.callFake(() => null);

    await component.getModulos();

    expect(panelControlServiceMock.getModulos).toHaveBeenCalled();
    expect(component.modulos.length).toBeGreaterThan(0);

    if (component.modulos[0].command) {
      await component.modulos[0].command({});
      expect(portalServiceMock.gotoModule).toHaveBeenCalledWith(
        windowServiceMock.getItemSessionStorage('proyecto'),
        modulo_activo.cod_modulo,
      );
      expect(systemServiceMock.translate).toHaveBeenCalledWith([
        'sistemas.modulos.error_navigate',
      ]);
      expect(errorTemplateHandlerMock.processError).toHaveBeenCalled();
    }
  });
});
