import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BaseComponent } from './base.component';
import {
  CUSTOM_ELEMENTS_SCHEMA,
  NO_ERRORS_SCHEMA,
  NgZone,
} from '@angular/core';
import { SystemService } from './services/system.service';
import { PanelControlService } from './services/panel_control.service';
import { InitService } from './services/init.service';
import { ErrorTemplateHandler } from './tools/error/error.handler';
import { MessageService, PrimeNGConfig } from 'primeng/api';
import { GtagService } from './services/gtag.service';
import { UsuarioService } from './services/usuario.service';
import { StartService } from '../project/services/start.service';
import { Router } from '@angular/router';
import { BaseRoutingSubscribe } from './routes/base-routing.subscribe';
import { TestingBaseModule } from './modules/testing.module';
import { Modulo } from './models/modulo';
import { Usuario } from './models/usuario';
import { WindowService } from './services/window.service';
import { ErrorTemplate } from './models/error-template';
import { PanelControlServiceMock } from './test/mocks/panel_control.service.mock';
import { SystemServiceMock } from './test/mocks/system.service.mock';
import { InitServiceMock } from './test/mocks/init.service.mock';
import { ErrorTemplateHandlerMock } from './test/mocks/error-template.mock';
import { GtagServiceMock } from './test/mocks/gtag.service.mock';
import { UsuarioServiceMock } from './test/mocks/usuario.service.mock';
import { BaseRoutingSubscribeMock } from './test/mocks/base-routing.subscribe.mock';
import { WindowServiceMock } from './test/mocks/window.service.mock';
import { Aplicacion } from './models/aplicacion';
import { Menu } from './models/menu';
import { Item } from './models/item';

describe('BaseComponent', () => {
  let component: BaseComponent;
  let fixture: ComponentFixture<BaseComponent>;
  let systemServiceMock: SystemServiceMock;
  let usuarioServiceMock: UsuarioServiceMock;
  let baseRoutingSubscribeMock: BaseRoutingSubscribeMock;
  let gtagServiceMock: GtagServiceMock;
  let panelControlServiceMock: PanelControlServiceMock;
  let windowServiceMock: WindowServiceMock;
  let errorTemplateHandlerMock: ErrorTemplateHandlerMock;
  let router: Router;
  let ngZone: NgZone;
  let messageService: MessageService;

  const userOnline: Usuario = {
    anonimo: false,
    apellidos: 'apellidos',
    correo_personal: 'correo@gmail.com',
    correo_uv: 'correo@uv.cl',
    foto: '',
    idioma: 'es',
    nombre_completo: 'nombres apellidos',
    nombres: 'nombres',
    rut: '11111111-1',
    uid: '11111111',
    adicional: null,
  };

  const userAnonimo: Usuario = {
    anonimo: true,
    apellidos: 'apellidos',
    correo_personal: 'anonimo@gmail.com',
    correo_uv: 'anonimo@uv.cl',
    foto: '',
    idioma: 'es',
    nombre_completo: 'anonimo',
    nombres: 'anonimo',
    rut: '22222222-2',
    uid: '22222222',
    adicional: null,
  };

  const aplicacion_activa: Aplicacion = {
    icono: 'icono1',
    id: 'abc123',
    nombre: 'aplicacion test 1',
    tipo: 'ANGULAR',
  };

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

  const menu_activo: Menu = {
    descripcion: 'descripcion',
    estado: 1,
    estilo: '',
    grupo: 'GRUPO',
    icono: 'pi pi-home',
    id: 1,
    metodo: 'menuA',
    nombre: 'menu1',
    items: [],
  };

  const item: Item = {
    descripcion: 'descripcion',
    estado: 1,
    grupo: 'GRUPO',
    icono: 'pi pi-home',
    id: '2',
    metodo: 'itemA',
    nombre: 'item1',
  };

  const config = {
    system: {
      name: 'Universidad de Valparaíso',
      token: true,
      replaceState: true,
      isDevelop: false,
      isMaintenance: false,
      url: {
        portal: 'https://portal.uv.cl',
      },
      theme: {
        translate: { default: 'es' },
      },
      data: { startservices: true, usuario: true },
    },
  };

  const startServiceMock = {
    startServices: () => Promise.resolve(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestingBaseModule],
      declarations: [BaseComponent],
      providers: [
        {
          provide: PanelControlService,
          useClass: PanelControlServiceMock,
        },
        {
          provide: SystemService,
          useClass: SystemServiceMock,
        },
        {
          provide: InitService,
          useValue: new InitServiceMock(config),
        },
        {
          provide: ErrorTemplateHandler,
          useClass: ErrorTemplateHandlerMock,
        },
        {
          provide: GtagService,
          useClass: GtagServiceMock,
        },
        {
          provide: UsuarioService,
          useValue: new UsuarioServiceMock(userOnline),
        },
        {
          provide: StartService,
          useValue: startServiceMock,
        },
        {
          provide: BaseRoutingSubscribe,
          useClass: BaseRoutingSubscribe,
        },
        { provide: WindowService, useClass: WindowServiceMock },
        MessageService,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    systemServiceMock = TestBed.inject(SystemService) as any;
    usuarioServiceMock = TestBed.inject(UsuarioService) as any;
    baseRoutingSubscribeMock = TestBed.inject(BaseRoutingSubscribe) as any;
    gtagServiceMock = TestBed.inject(GtagService) as any;
    panelControlServiceMock = TestBed.inject(PanelControlService) as any;
    windowServiceMock = TestBed.inject(WindowService);
    errorTemplateHandlerMock = TestBed.inject(ErrorTemplateHandler) as any;
    router = TestBed.inject(Router);
    ngZone = TestBed.inject(NgZone);
    messageService = TestBed.inject(MessageService);

    fixture = TestBed.createComponent(BaseComponent);
    component = fixture.componentInstance;
  });

  it('[1] Existe', () => {
    spyOn(component as any, 'initApp').and.callFake(() => null);
    fixture.detectChanges();
    expect(component).toBeTruthy();
    expect(component['initApp']).toHaveBeenCalled();
  });

  it('[2] Iniciar sistema: initApp() :: success', async () => {
    spyOn(systemServiceMock, 'mainLoading').and.callFake(() => null);
    spyOn(systemServiceMock, 'setTitle').and.callFake(() => null);
    spyOn(systemServiceMock, 'setTranslation').and.callFake(() => null);
    spyOn(component as any, 'setSubscribes').and.callFake(() => null);
    spyOn(gtagServiceMock, 'init').and.callFake(() => null);
    spyOn(component as any, 'getSession').and.callFake(() => null);

    fixture.detectChanges();
    await component['initApp']();

    expect(systemServiceMock.mainLoading).toHaveBeenCalledWith(true);
    expect(systemServiceMock.setTitle).toHaveBeenCalled();
    expect(systemServiceMock.setTranslation).toHaveBeenCalled();
    expect(component['setSubscribes']).toHaveBeenCalled();
    expect(gtagServiceMock.init).toHaveBeenCalled();
    expect(component['getSession']).toHaveBeenCalled();
  });

  it('[3] Iniciar sistema: initApp() :: error :: method: page, page: error', async () => {
    spyOn(component as any, 'getSession').and.throwError('');
    spyOn(errorTemplateHandlerMock, 'processError').and.callFake(() => null);

    fixture.detectChanges();
    await component['initApp']();

    expect(component['getSession']).toHaveBeenCalled();
    expect(errorTemplateHandlerMock.processError).toHaveBeenCalled();
    expect(component.blocking).toBeTrue();
  });

  it('[4] Obtener sesión: getSession() :: success :: uid = "SI", token = "NO"', async () => {
    const primengConfig = TestBed.inject(PrimeNGConfig);
    const url = 'http://sistema.uv.cl?uid=asdasxae123ASD!!345';
    const uid = url.split('uid=')[1];

    spyOn(windowServiceMock, 'getItemSessionStorage').and.returnValue('');
    spyOn(windowServiceMock, 'clearSessionStorage').and.returnValue();
    spyOn(windowServiceMock, 'replaceState').and.returnValue();
    spyOn(usuarioServiceMock, 'getSession').and.callFake(() =>
      Promise.resolve(),
    );

    spyOn(usuarioServiceMock, 'getUser').and.callFake(() =>
      Promise.resolve(userOnline),
    );

    spyOn(systemServiceMock, 'setTranslation').and.callFake(() => null);

    await component['getSession'](url);

    expect(windowServiceMock.getItemSessionStorage).toHaveBeenCalledWith(
      'token',
    );
    expect(windowServiceMock.clearSessionStorage).toHaveBeenCalled();
    expect(usuarioServiceMock.getSession).toHaveBeenCalledWith(uid);
    expect(usuarioServiceMock.getUser).toHaveBeenCalledWith(true);
    expect(windowServiceMock.replaceState).toHaveBeenCalledWith('', '', '');
    expect(systemServiceMock.setTranslation).toHaveBeenCalledWith(
      component.usuario?.idioma,
      primengConfig,
    );
  });

  it('[5] Obtener sesión: getSession() :: success :: uid = "NO", token = "NO"', async () => {
    const url = 'http://sistema.uv.cl';
    const uid = url.split('uid=')[1];
    spyOn(windowServiceMock, 'replaceLocation').and.returnValue();
    await component['getSession'](url);
    if (!uid) {
      expect(windowServiceMock.replaceLocation).toHaveBeenCalledWith(
        'https://portal.uv.cl',
      );
    }
  });

  it('[6] Obtener sesión: getSession() :: success :: uid = "WHATEVER", token = "SI"', async () => {
    const primengConfig = TestBed.inject(PrimeNGConfig);
    const url = 'http://sistema.uv.cl?uid=asdasxae123ASD!!345';

    spyOn(windowServiceMock, 'getItemSessionStorage').and.returnValue('abc123');
    spyOn(usuarioServiceMock, 'getUser').and.callFake(() =>
      Promise.resolve(userOnline),
    );

    spyOn(systemServiceMock, 'setTranslation').and.callFake(() => null);

    fixture.detectChanges();
    await component['getSession'](url);

    expect(windowServiceMock.getItemSessionStorage).toHaveBeenCalledWith(
      'token',
    );
    expect(usuarioServiceMock.getUser).toHaveBeenCalledWith(true);
    expect(systemServiceMock.setTranslation).toHaveBeenCalledWith(
      component.usuario?.idioma,
      primengConfig,
    );
  });

  it('[7] Obtener sesión: getSession() :: error :: method: page, page: error', async () => {
    const url = 'http://sistema.uv.cl?uid=asdasxae123ASD!!345';
    const uid = url.split('uid=')[1];

    const t = {
      init: { error_init: '', titulo: '' },
    } as any;
    spyOn(systemServiceMock, 'translate').and.callFake(() =>
      Promise.resolve(t),
    );

    spyOn(usuarioServiceMock, 'getUser').and.callFake(() =>
      Promise.resolve(userAnonimo),
    );

    spyOn(windowServiceMock, 'getItemSessionStorage').and.returnValue('');
    spyOn(windowServiceMock, 'clearSessionStorage').and.returnValue();
    spyOn(usuarioServiceMock, 'getSession').and.callFake(() =>
      Promise.reject(
        new ErrorTemplate(
          new Error('esto es un error'),
          {},
          TestBed.inject(Router),
        ),
      ),
    );

    await component['getSession'](url);

    expect(windowServiceMock.getItemSessionStorage).toHaveBeenCalledWith(
      'token',
    );
    expect(windowServiceMock.clearSessionStorage).toHaveBeenCalled();
    expect(usuarioServiceMock.getSession).toHaveBeenCalledWith(uid);
    expect(usuarioServiceMock.getUser).toHaveBeenCalledWith(false);
    expect(systemServiceMock.translate).toHaveBeenCalledWith([
      'init.error_init',
      'init.titulo',
    ]);
  });

  it('[8] Obtener sesión: getSession() :: error :: method: page, page: session', async () => {
    const url = 'http://sistema.uv.cl?uid=asdasxae123ASD!!345';
    const uid = url.split('uid=')[1];

    const t = {
      init: { error_init: '', titulo: '' },
    } as any;
    spyOn(systemServiceMock, 'translate').and.callFake(() =>
      Promise.resolve(t),
    );

    spyOn(usuarioServiceMock, 'getUser').and.callFake(() =>
      Promise.resolve(userAnonimo),
    );

    spyOn(windowServiceMock, 'getItemSessionStorage').and.returnValue('');
    spyOn(windowServiceMock, 'clearSessionStorage').and.returnValue();
    spyOn(usuarioServiceMock, 'getSession').and.callFake(() =>
      Promise.reject(
        new ErrorTemplate(new Error('jwt expired'), {}, TestBed.inject(Router)),
      ),
    );

    await component['getSession'](url);

    expect(windowServiceMock.getItemSessionStorage).toHaveBeenCalledWith(
      'token',
    );
    expect(windowServiceMock.clearSessionStorage).toHaveBeenCalled();
    expect(usuarioServiceMock.getSession).toHaveBeenCalledWith(uid);
    expect(usuarioServiceMock.getUser).toHaveBeenCalledWith(false);
    expect(systemServiceMock.translate).toHaveBeenCalledWith([
      'init.error_init',
      'init.titulo',
    ]);
  });

  it('[9] Lanzar sistema: launch() :: success :: sistema activo', async () => {
    const router = TestBed.inject(Router);
    spyOn(startServiceMock, 'startServices').and.callFake(() =>
      Promise.resolve(),
    );
    spyOn(panelControlServiceMock, 'homeNavigate').and.callFake(() =>
      Promise.resolve(),
    );
    spyOn(systemServiceMock, 'mainLoading').and.callFake(() => null);

    fixture.detectChanges();

    panelControlServiceMock['aplicacionesRx'].next({
      active: aplicacion_activa,
    });
    panelControlServiceMock['modulosRx'].next({
      active: modulo_activo,
    });
    panelControlServiceMock['menusRx'].next({
      active: menu_activo,
    });

    await component['launch']();

    expect(component['aplicaciones_check']).toBeTrue();
    expect(component['modulos_check']).toBeTrue();
    expect(component['menus_check']).toBeTrue();
    expect(component['develop']).toBeFalse();
    expect(component['maintenance']).toBeFalse();
    expect(startServiceMock.startServices).toHaveBeenCalled();
    expect(panelControlServiceMock.homeNavigate).toHaveBeenCalledWith(router);
    expect(systemServiceMock.mainLoading).toHaveBeenCalledWith(false);
  });

  it('[10] Lanzar sistema: launch() :: error :: sistema activo :: con login token', async () => {
    spyOn(startServiceMock, 'startServices').and.throwError('');
    spyOn(systemServiceMock, 'mainLoading').and.callFake(() => null);

    const t = {
      init: { error_startservice: '', titulo: '' },
    } as any;
    spyOn(systemServiceMock, 'translate').and.callFake(() =>
      Promise.resolve(t),
    );

    spyOn(errorTemplateHandlerMock, 'processError').and.callFake(() => null);

    fixture.detectChanges();

    panelControlServiceMock['aplicacionesRx'].next({
      active: aplicacion_activa,
    });
    panelControlServiceMock['modulosRx'].next({
      active: modulo_activo,
    });
    panelControlServiceMock['menusRx'].next({
      active: menu_activo,
    });

    await component['launch']();

    expect(component['aplicaciones_check']).toBeTrue();
    expect(component['modulos_check']).toBeTrue();
    expect(component['menus_check']).toBeTrue();
    expect(component['develop']).toBeFalse();
    expect(component['maintenance']).toBeFalse();
    expect(startServiceMock.startServices).toHaveBeenCalled();
    expect(errorTemplateHandlerMock.processError).toHaveBeenCalled();
    expect(systemServiceMock.translate).toHaveBeenCalledWith([
      'init.error_startservice',
      'init.titulo',
    ]);
    expect(systemServiceMock.mainLoading).toHaveBeenCalledWith(false);
  });

  it('[11] Lanzar sistema: launch() :: success :: sistema en mantención :: con login token', async () => {
    const router = TestBed.inject(Router);
    spyOn(systemServiceMock, 'mainLoading').and.callFake(() => null);
    spyOn(panelControlServiceMock, 'notActiveModulo').and.callFake(() =>
      Promise.resolve(),
    );

    fixture.detectChanges();

    panelControlServiceMock['aplicacionesRx'].next({
      active: aplicacion_activa,
    });
    panelControlServiceMock['modulosRx'].next({
      active: modulo_mantencion,
    });
    panelControlServiceMock['menusRx'].next({
      active: menu_activo,
    });

    await component['launch']();

    expect(component['aplicaciones_check']).toBeTrue();
    expect(component['modulos_check']).toBeTrue();
    expect(component['menus_check']).toBeTrue();
    expect(component['develop']).toBeFalse();
    expect(component['maintenance']).toBeTrue();
    expect(systemServiceMock.mainLoading).toHaveBeenCalledWith(false);
    expect(component.blocking).toBeTrue();
    expect(panelControlServiceMock.notActiveModulo).toHaveBeenCalledWith(
      router,
      'maintenance',
    );
  });

  it('[12] Lanzar sistema: launch() :: success :: sistema en desarrollo :: con login token', async () => {
    const router = TestBed.inject(Router);
    spyOn(systemServiceMock, 'mainLoading').and.callFake(() => null);
    spyOn(panelControlServiceMock, 'notActiveModulo').and.callFake(() =>
      Promise.resolve(),
    );

    fixture.detectChanges();

    panelControlServiceMock['aplicacionesRx'].next({
      active: aplicacion_activa,
    });
    panelControlServiceMock['modulosRx'].next({
      active: modulo_dev,
    });
    panelControlServiceMock['menusRx'].next({
      active: menu_activo,
    });

    await component['launch']();

    expect(component['aplicaciones_check']).toBeTrue();
    expect(component['modulos_check']).toBeTrue();
    expect(component['menus_check']).toBeTrue();
    expect(component['develop']).toBeTrue();
    expect(component['maintenance']).toBeFalse();
    expect(systemServiceMock.mainLoading).toHaveBeenCalledWith(false);
    expect(component.blocking).toBeTrue();
    expect(panelControlServiceMock.notActiveModulo).toHaveBeenCalledWith(
      router,
      'develop',
    );
  });

  it('[13] Lanzar sistema: launch() :: success :: sistema inactivo :: con login token', async () => {
    const router = TestBed.inject(Router);
    spyOn(systemServiceMock, 'mainLoading').and.callFake(() => null);
    spyOn(panelControlServiceMock, 'notActiveModulo').and.callFake(() =>
      Promise.resolve(),
    );

    fixture.detectChanges();

    panelControlServiceMock['aplicacionesRx'].next({
      active: aplicacion_activa,
    });
    panelControlServiceMock['modulosRx'].next({
      active: null,
    });
    panelControlServiceMock['menusRx'].next({
      active: menu_activo,
    });

    await component['launch']();

    expect(component['aplicaciones_check']).toBeTrue();
    expect(component['modulos_check']).toBeTrue();
    expect(component['menus_check']).toBeTrue();
    expect(component['develop']).toBeFalse();
    expect(component['maintenance']).toBeTrue();
    expect(systemServiceMock.mainLoading).toHaveBeenCalledWith(false);
    expect(component.blocking).toBeTrue();
    expect(panelControlServiceMock.notActiveModulo).toHaveBeenCalledWith(
      router,
      'maintenance',
    );
  });

  it('[14] Lanzar sistema: launch() :: success :: sistema en desarrollo/en mantención :: sin login token', async () => {
    const router = TestBed.inject(Router);
    spyOn(systemServiceMock, 'mainLoading').and.callFake(() => null);
    spyOn(panelControlServiceMock, 'notActiveModulo').and.callFake(() =>
      Promise.resolve(),
    );

    // configuración para que sea un sistema que no exija token y este ademas en develop o mantención
    config.system.token = false;
    config.system.isMaintenance = true;

    fixture.detectChanges();

    panelControlServiceMock['aplicacionesRx'].next({
      active: null,
    });
    panelControlServiceMock['modulosRx'].next({
      active: null,
    });
    panelControlServiceMock['menusRx'].next({
      active: null,
    });

    await component['launch']();

    expect(component['aplicaciones_check']).toBeTrue();
    expect(component['modulos_check']).toBeTrue();
    expect(component['menus_check']).toBeTrue();
    expect(component['develop']).toBeFalse();
    expect(component['maintenance']).toBeTrue();
    expect(systemServiceMock.mainLoading).toHaveBeenCalledWith(false);
    expect(component.blocking).toBeTrue();
    expect(panelControlServiceMock.notActiveModulo).toHaveBeenCalledWith(
      router,
      'maintenance',
    );
  });

  it('[15] Subscripciones: setSubscribes()', () => {
    spyOn(baseRoutingSubscribeMock, 'navigationStart').and.callThrough();
    spyOn(baseRoutingSubscribeMock, 'navigationCancel').and.callThrough();
    spyOn(errorTemplateHandlerMock.error$, 'subscribe').and.callThrough();
    spyOn(panelControlServiceMock.navigate$, 'subscribe').and.callThrough();
    spyOn(panelControlServiceMock.aplicaciones$, 'subscribe').and.callThrough();
    spyOn(panelControlServiceMock.modulos$, 'subscribe').and.callThrough();
    spyOn(panelControlServiceMock.menus$, 'subscribe').and.callThrough();

    component['setSubscribes']();

    expect(baseRoutingSubscribeMock.navigationStart).toHaveBeenCalled();
    expect(baseRoutingSubscribeMock.navigationCancel).toHaveBeenCalled();
    expect(errorTemplateHandlerMock.error$.subscribe).toHaveBeenCalled();
    expect(panelControlServiceMock.navigate$.subscribe).toHaveBeenCalled();
    expect(panelControlServiceMock.aplicaciones$.subscribe).toHaveBeenCalled();
    expect(panelControlServiceMock.modulos$.subscribe).toHaveBeenCalled();
    expect(panelControlServiceMock.menus$.subscribe).toHaveBeenCalled();
  });

  it('[16] Evento: navegación', () => {
    fixture.detectChanges();
    spyOn(gtagServiceMock, 'set').and.callThrough();
    spyOn(systemServiceMock, 'setTitle').and.returnValue();

    const emit = {
      menu: menu_activo,
      item: item,
      title: 'titulo',
    };

    panelControlServiceMock['navigateRx'].next(emit);

    expect(gtagServiceMock.set).toHaveBeenCalled();
    expect(systemServiceMock.setTitle).toHaveBeenCalledWith(
      component['title'],
      emit.title,
    );
  });

  it('[17] Evento: error :: page :: error page', () => {
    fixture.detectChanges();
    spyOn(router, 'navigate').and.resolveTo(true);
    spyOn(ngZone, 'run').and.callFake((fn: Function) => fn());

    const error = new ErrorTemplate(
      new Error('esto es un error'),
      {},
      TestBed.inject(Router),
    );

    errorTemplateHandlerMock['errorSubject'].next(error);

    expect(ngZone.run).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/error'], {
      state: error.getDetail(),
    });
  });

  it('[18] Evento: error :: page :: session page', () => {
    fixture.detectChanges();
    spyOn(router, 'navigate').and.resolveTo(true);
    spyOn(ngZone, 'run').and.callFake((fn: Function) => fn());

    const error = new ErrorTemplate(
      new Error('jwt expired'),
      {},
      TestBed.inject(Router),
    );

    errorTemplateHandlerMock['errorSubject'].next(error);

    expect(ngZone.run).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/session'], {
      state: error.getDetail(),
    });
  });

  it('[19] Evento: error :: alert :: sin titulo', () => {
    fixture.detectChanges();
    spyOn(messageService, 'add').and.callThrough();

    const error = new ErrorTemplate(
      new Error('esto es un error'),
      {},
      TestBed.inject(Router),
    );
    error.setNotifyMethod('alert');

    errorTemplateHandlerMock['errorSubject'].next(error);

    expect(messageService.add).toHaveBeenCalledWith({
      severity: 'error',
      key: 'main',
      sticky: true,
      detail: error.getDetail().error.message,
    });
  });

  it('[20] Evento: error :: alert :: con titulo', () => {
    fixture.detectChanges();
    spyOn(messageService, 'add').and.callThrough();

    const error = new ErrorTemplate(
      new Error('esto es un error'),
      {},
      TestBed.inject(Router),
    );
    error.setNotifyMethod('alert');
    error.setSummary('titulo');

    errorTemplateHandlerMock['errorSubject'].next(error);

    expect(messageService.add).toHaveBeenCalledWith({
      severity: 'error',
      key: 'main',
      sticky: true,
      detail: error.getDetail().error.message,
      summary: 'titulo',
    });
  });

  it('[21] Evento: carga aplicaciones', () => {
    fixture.detectChanges();
    spyOn(component as any, 'launch').and.callThrough();

    panelControlServiceMock['aplicacionesRx'].next({
      active: aplicacion_activa,
    });

    expect(component['aplicaciones_check']).toBeTrue();
    expect(component['launch']).toHaveBeenCalled();
  });

  it('[22] Evento: carga modulos :: token :: sistema encontrado :: modulo activo', () => {
    config.system.token = true;
    fixture.detectChanges();

    spyOn(systemServiceMock, 'setTitle').and.callThrough();
    spyOn(component as any, 'launch').and.callThrough();

    panelControlServiceMock['modulosRx'].next({
      active: modulo_activo,
    });

    expect(component['develop']).toBeFalse();
    expect(component['maintenance']).toBeFalse();
    expect(systemServiceMock.setTitle).toHaveBeenCalledWith(component['title']);
    expect(component['modulos_check']).toBeTrue();
    expect(component['launch']).toHaveBeenCalled();
  });

  it('[23] Evento: carga modulos :: token :: sistema encontrado :: modulo en mantencion', () => {
    config.system.token = true;
    fixture.detectChanges();
    spyOn(systemServiceMock, 'setTitle').and.callThrough();
    spyOn(component as any, 'launch').and.callThrough();

    panelControlServiceMock['modulosRx'].next({
      active: modulo_mantencion,
    });

    expect(component['develop']).toBeFalse();
    expect(component['maintenance']).toBeTrue();
    expect(systemServiceMock.setTitle).toHaveBeenCalledWith(component['title']);
    expect(component['modulos_check']).toBeTrue();
    expect(component['launch']).toHaveBeenCalled();
  });

  it('[24] Evento: carga modulos :: token :: sistema encontrado :: modulo en desarrollo', () => {
    config.system.token = true;
    fixture.detectChanges();
    spyOn(systemServiceMock, 'setTitle').and.callThrough();
    spyOn(component as any, 'launch').and.callThrough();

    panelControlServiceMock['modulosRx'].next({
      active: modulo_dev,
    });

    expect(component['develop']).toBeTrue();
    expect(component['maintenance']).toBeFalse();
    expect(systemServiceMock.setTitle).toHaveBeenCalledWith(component['title']);
    expect(component['modulos_check']).toBeTrue();
    expect(component['launch']).toHaveBeenCalled();
  });

  it('[25] Evento: carga modulos :: token :: sistema no encontrado', () => {
    config.system.token = true;
    fixture.detectChanges();
    spyOn(systemServiceMock, 'setTitle').and.callThrough();
    spyOn(component as any, 'launch').and.callThrough();

    panelControlServiceMock['modulosRx'].next({
      active: null,
    });

    expect(component['develop']).toBeFalse();
    expect(component['maintenance']).toBeTrue();
    expect(systemServiceMock.setTitle).toHaveBeenCalledWith(component['title']);
    expect(component['modulos_check']).toBeTrue();
    expect(component['launch']).toHaveBeenCalled();
  });

  it('[26] Evento: carga modulos :: sin token', () => {
    config.system.token = false;
    config.system.isDevelop = true;
    config.system.isMaintenance = false;

    fixture.detectChanges();
    spyOn(systemServiceMock, 'setTitle').and.callThrough();
    spyOn(component as any, 'launch').and.callThrough();

    panelControlServiceMock['modulosRx'].next({
      active: null,
    });

    expect(component['develop']).toBeTrue();
    expect(component['maintenance']).toBeFalse();
    expect(systemServiceMock.setTitle).toHaveBeenCalledWith(component['title']);
    expect(component['modulos_check']).toBeTrue();
    expect(component['launch']).toHaveBeenCalled();
  });

  it('[27] Evento: carga menus', () => {
    fixture.detectChanges();
    spyOn(component as any, 'launch').and.callThrough();

    panelControlServiceMock['menusRx'].next({
      active: menu_activo,
    });

    expect(component['menus_check']).toBeTrue();
    expect(component['launch']).toHaveBeenCalled();
  });
});
