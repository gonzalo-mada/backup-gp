import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PanelControlService } from '../panel_control.service';
import { InvokerService } from '../invoker.service';
import { SystemService } from '../system.service';
import { InitService } from '../init.service';
import { CommonUtils } from '../../tools/utils/common.utils';
import { DateUtils } from '../../tools/utils/date.utils';
import { InvokerServiceMock } from '../../test/mocks/invoker.service.mock';
import { SystemServiceMock } from '../../test/mocks/system.service.mock';
import { InitServiceMock } from '../../test/mocks/init.service.mock';
import { CommonUtilsMock } from '../../test/mocks/common.utils.mock';
import { DateUtilsMock } from '../../test/mocks/date.utils.mock';
import { Menu } from '../../models/menu';
import { Item } from '../../models/item';
import { DevelopComponent } from '../../pages/develop/develop.component';
import { Modulo } from '../../models/modulo';
import { Aplicacion } from '../../models/aplicacion';

describe('PanelControlService (SERVICE)', () => {
  let service: PanelControlService;
  let invokerServiceMock: InvokerServiceMock;
  let systemServiceMock: SystemServiceMock;
  let commonUtilsMock: CommonUtilsMock;
  let dateUtilsMock: DateUtilsMock;

  const homeMenu: Menu = {
    descripcion: 'Volver al inicio',
    estado: 1,
    estilo: '',
    grupo: '',
    icono: 'pi pi-home',
    id: 0,
    items: [],
    metodo: '',
    nombre: 'Inicio',
  };

  const config = {
    system: {
      icons: {
        home: 'pi pi-home',
      },
      url: {
        repositorio: 'https://repositorio.uv.cl',
      },
      path: {
        aplicaciones: '/imagenes/iconos_sistemas/aplicaciones/',
        modulos: '/imagenes/iconos_sistemas/modulos/',
        static: '/static/sistemas/base/',
      },
      data: {
        aplicaciones: true,
        modulos: true,
        menus: true,
        avisos: true,
        usuario: true,
        today: true,
        startservices: true,
      },
      buttons: {
        home: true,
        theme: {
          active: true,
        },
        sistemas: {
          active: true,
          children: {
            aplicaciones: true,
            modulos: true,
          },
        },
        menus: {
          active: true,
          metodo_active: '',
        },
        avisos: true,
        portal: true,
        ayuda: {
          active: true,
          children: {
            contacto: true,
            simbologia: true,
            manual: false,
          },
        },
        usuario: {
          active: true,
          children: {
            profile: true,
            correo: true,
            cambiaclave: true,
            logout: true,
          },
        },
      },
      theme: {
        translate: {
          default: 'es',
        },
      },
    },
    sites: {
      dtic: {
        support: 'soporte@uv.cl',
      },
      uv: {
        name: 'Universidad de Valparaíso',
        initials: 'UV',
        rut: '60921000-1',
      },
      tui_uv: {
        server: 'https://admintui.uv.cl/data/fotos2/',
        format: 'jpg',
      },
    },
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

  const menu_mantencion: Menu = {
    descripcion: 'descripcion',
    estado: 2,
    estilo: '',
    grupo: 'GRUPO',
    icono: 'pi pi-home',
    id: 2,
    metodo: 'menuM',
    nombre: 'menu1',
    items: [],
  };

  const menu_desarrollo: Menu = {
    descripcion: 'descripcion',
    estado: 3,
    estilo: '',
    grupo: 'GRUPO',
    icono: 'pi pi-home',
    id: 3,
    metodo: 'menuD',
    nombre: 'menu1',
    items: [],
  };

  const item_activo: Item = {
    descripcion: 'descripcion',
    estado: 1,
    grupo: 'GRUPO',
    icono: 'pi pi-home',
    id: '2',
    metodo: 'itemA',
    nombre: 'item1',
  };

  const item_mantencion: Item = {
    descripcion: 'descripcion',
    estado: 2,
    grupo: 'GRUPO',
    icono: 'pi pi-home',
    id: '2',
    metodo: 'itemM',
    nombre: 'item1',
  };

  const item_desarrollo: Item = {
    descripcion: 'descripcion',
    estado: 3,
    grupo: 'GRUPO',
    icono: 'pi pi-home',
    id: '2',
    metodo: 'itemD',
    nombre: 'item1',
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

  const aplicacion_activa: Aplicacion = {
    icono: 'icono1',
    id: 'abc123',
    nombre: 'aplicacion test 1',
    tipo: 'ANGULAR',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([
          { path: 'develop', component: DevelopComponent },
        ]),
      ],
      providers: [
        PanelControlService,
        { provide: InvokerService, useClass: InvokerServiceMock },
        { provide: SystemService, useClass: SystemServiceMock },
        { provide: InitService, useValue: new InitServiceMock(config) },
        { provide: CommonUtils, useClass: CommonUtilsMock },
        { provide: DateUtils, useClass: DateUtilsMock },
      ],
    });

    invokerServiceMock = TestBed.inject(InvokerService);
    systemServiceMock = TestBed.inject(SystemService) as any;
    commonUtilsMock = TestBed.inject(CommonUtils);
    dateUtilsMock = TestBed.inject(DateUtils) as any;

    service = TestBed.inject(PanelControlService);
  });

  it('[1] Es creado', () => {
    expect(service).toBeTruthy();
  });

  it('[2] Obtener aplicaciones: getAplicaciones() :: con aplicacion activa', async () => {
    const proyecto = 'proyecto1';
    spyOn(invokerServiceMock, 'httpInvoke').and.returnValue(
      Promise.resolve([
        {
          id: 'proyecto1',
          nombre: 'App1',
          tipoApp: 'ANGULAR',
          imagen: 'app1.png',
        },
        {
          id: 'proyecto2',
          nombre: 'App2',
          tipoApp: 'ANGULAR',
          imagen: 'app2.png',
        },
      ]),
    );
    spyOn(commonUtilsMock, 'mergeDeep').and.callThrough();

    const response = await service.getAplicaciones(proyecto);
    expect(invokerServiceMock.httpInvoke).toHaveBeenCalledWith(
      'base/getAplicaciones',
      { id_proyecto: proyecto },
    );
    expect(commonUtilsMock.mergeDeep).toHaveBeenCalled();
    expect(response.aplicaciones.length).toBe(2);
    expect(response.active).not.toBeFalsy();
  });

  it('[3] Obtener aplicaciones: getAplicaciones() :: sin aplicacion activa', async () => {
    const proyecto = 'proyecto3';
    spyOn(invokerServiceMock, 'httpInvoke').and.returnValue(
      Promise.resolve([
        {
          id: 'proyecto1',
          nombre: 'App1',
          tipoApp: 'ANGULAR',
          imagen: 'app1.png',
        },
        {
          id: 'proyecto2',
          nombre: 'App2',
          tipoApp: 'ANGULAR',
          imagen: 'app2.png',
        },
      ]),
    );
    spyOn(commonUtilsMock, 'mergeDeep').and.callThrough();

    const response = await service.getAplicaciones(proyecto);
    expect(invokerServiceMock.httpInvoke).toHaveBeenCalledWith(
      'base/getAplicaciones',
      { id_proyecto: proyecto },
    );
    expect(commonUtilsMock.mergeDeep).toHaveBeenCalled();
    expect(response.aplicaciones.length).toBe(2);
    expect(response.active).toBeFalsy();
  });

  it('[4] Obtener modulos: getModulos() :: con modulo activa :: modulos activos', async () => {
    const modulo = 'modulo1';
    spyOn(invokerServiceMock, 'httpInvoke').and.returnValue(
      Promise.resolve([
        {
          id: 'modulo1',
          nombre: 'Mod1',
          tipoMod: 'ANGULAR',
          imagen: 'app1.png',
          estilo: '',
          moduloActivo: 1,
          descripcion: 'descripcion',
          grupo: null,
        },
        {
          id: 'modulo2',
          nombre: 'Mod2',
          tipoMod: 'ANGULAR',
          imagen: 'app2.png',
          estilo: '',
          moduloActivo: 1,
          descripcion: 'descripcion',
          grupo: 'ACADEMICAS',
        },
      ]),
    );
    spyOn(commonUtilsMock, 'mergeDeep').and.callThrough();

    const response = await service.getModulos(modulo);
    expect(invokerServiceMock.httpInvoke).toHaveBeenCalledWith(
      'base/getModulos',
      { codModulo: modulo },
    );
    expect(commonUtilsMock.mergeDeep).toHaveBeenCalled();
    expect(response.modulos.length).toBe(2);
    expect(response.active).not.toBeFalsy();
  });

  it('[5] Obtener modulos: getModulos() :: con modulo activa :: un modulo en mantencion', async () => {
    const modulo = 'modulo1';
    spyOn(invokerServiceMock, 'httpInvoke').and.returnValue(
      Promise.resolve([
        {
          id: 'modulo1',
          nombre: 'Mod1',
          tipoMod: 'ANGULAR',
          imagen: 'app1.png',
          estilo: '',
          moduloActivo: 1,
          descripcion: 'descripcion',
          grupo: null,
        },
        {
          id: 'modulo2',
          nombre: 'Mod2',
          tipoMod: 'ANGULAR',
          imagen: 'app2.png',
          estilo: '',
          moduloActivo: 2,
          descripcion: 'descripcion',
          grupo: 'ACADEMICAS',
        },
      ]),
    );
    spyOn(commonUtilsMock, 'mergeDeep').and.callThrough();

    const response = await service.getModulos(modulo);
    expect(invokerServiceMock.httpInvoke).toHaveBeenCalledWith(
      'base/getModulos',
      { codModulo: modulo },
    );
    expect(commonUtilsMock.mergeDeep).toHaveBeenCalled();
    expect(response.modulos.length).toBe(2);
    expect(response.active).not.toBeFalsy();
  });

  it('[6] Obtener modulos: getModulos() :: con modulo activa :: un modulo en desarrollo', async () => {
    const modulo = 'modulo1';
    spyOn(invokerServiceMock, 'httpInvoke').and.returnValue(
      Promise.resolve([
        {
          id: 'modulo1',
          nombre: 'Mod1',
          tipoMod: 'ANGULAR',
          imagen: 'app1.png',
          estilo: '',
          moduloActivo: 1,
          descripcion: 'descripcion',
          grupo: null,
        },
        {
          id: 'modulo2',
          nombre: 'Mod2',
          tipoMod: 'ANGULAR',
          imagen: 'app2.png',
          estilo: '',
          moduloActivo: 3,
          descripcion: 'descripcion',
          grupo: 'ACADEMICAS',
        },
      ]),
    );
    spyOn(commonUtilsMock, 'mergeDeep').and.callThrough();

    const response = await service.getModulos(modulo);
    expect(invokerServiceMock.httpInvoke).toHaveBeenCalledWith(
      'base/getModulos',
      { codModulo: modulo },
    );
    expect(commonUtilsMock.mergeDeep).toHaveBeenCalled();
    expect(response.modulos.length).toBe(2);
    expect(response.active).not.toBeFalsy();
  });

  it('[7] Obtener modulos: getModulos() :: sin modulo activo', async () => {
    const modulo = 'modulo3';
    spyOn(invokerServiceMock, 'httpInvoke').and.returnValue(
      Promise.resolve([
        {
          id: 'modulo1',
          nombre: 'Mod1',
          tipoMod: 'ANGULAR',
          imagen: 'app1.png',
          estilo: '',
          moduloActivo: 1,
          descripcion: 'descripcion',
          grupo: null,
        },
        {
          id: 'modulo2',
          nombre: 'Mod2',
          tipoMod: 'ANGULAR',
          imagen: 'app2.png',
          estilo: '',
          moduloActivo: 1,
          descripcion: '',
          grupo: 'ACADEMICAS',
        },
      ]),
    );
    spyOn(commonUtilsMock, 'mergeDeep').and.callThrough();

    const response = await service.getModulos(modulo);
    expect(invokerServiceMock.httpInvoke).toHaveBeenCalledWith(
      'base/getModulos',
      { codModulo: modulo },
    );
    expect(commonUtilsMock.mergeDeep).toHaveBeenCalled();
    expect(response.modulos.length).toBe(2);
    expect(response.active).toBeFalsy();
  });

  it('[8] Obtener menus: getMenus() :: sin items :: con menu activo', async () => {
    const modulo = 'modulo';
    spyOn(invokerServiceMock, 'httpInvoke').and.returnValue(
      Promise.resolve([
        {
          idMenu: 'menu1',
          nombre: 'Menu1',
          tipoMod: 'ANGULAR',
          iconoBootstrap: 'pi pi-home',
          estilo: '',
          menuActivo: 1,
          descripcion: 'descripcion',
          grupo: null,
          metodo: 'metodo1',
          items: [],
        },
        {
          idMenu: 'menu2',
          nombre: 'Menu2',
          tipoMod: 'ANGULAR',
          iconoBootstrap: 'pi pi-user',
          estilo: '',
          menuActivo: 1,
          descripcion: '',
          grupo: 'ACADEMICOS',
          metodo: 'metodo2',
          items: [],
        },
        {
          idMenu: 'menu3',
          nombre: 'Volver al Portal',
          tipoMod: 'ANGULAR',
          iconoBootstrap: 'pi pi-home',
          estilo: '',
          menuActivo: 1,
          descripcion: 'descripcion',
          grupo: null,
          metodo: '',
          items: [],
        },
        {
          idMenu: 'menu4',
          nombre: 'inicio',
          tipoMod: 'ANGULAR',
          iconoBootstrap: 'pi pi-home',
          estilo: '',
          menuActivo: 1,
          descripcion: 'descripcion',
          grupo: null,
          metodo: 'home',
          items: [],
        },
      ]),
    );
    spyOn(commonUtilsMock, 'mergeDeep').and.callThrough();

    const response = await service.getMenus(modulo);
    expect(invokerServiceMock.httpInvoke).toHaveBeenCalledWith(
      'base/getMenus',
      { codModulo: modulo },
    );
    expect(commonUtilsMock.mergeDeep).toHaveBeenCalled();
    expect(response.menus.length).toBe(3);
    expect(response.active).not.toBeFalsy();
  });

  it('[9] Obtener menus: getMenus() :: con items :: con menu activo', async () => {
    const modulo = 'modulo';
    spyOn(invokerServiceMock, 'httpInvoke').and.returnValue(
      Promise.resolve([
        {
          idMenu: 'menu1',
          nombre: 'Menu1',
          tipoMod: 'ANGULAR',
          iconoBootstrap: 'pi pi-home',
          estilo: '',
          menuActivo: 1,
          descripcion: 'descripcion',
          grupo: null,
          metodo: 'metodo1',
          items: [
            {
              nombre: 'item1',
              iconoBootstrap: 'pi pi-home',
              itemActivo: 1,
              descripcion: 'descripcion',
              grupo: null,
              metodo: 'metodoitem',
            },
          ],
        },
      ]),
    );
    spyOn(commonUtilsMock, 'mergeDeep').and.callThrough();
    spyOn(systemServiceMock, 'getHash').and.callThrough();

    const response = await service.getMenus(modulo);
    expect(invokerServiceMock.httpInvoke).toHaveBeenCalledWith(
      'base/getMenus',
      { codModulo: modulo },
    );
    expect(commonUtilsMock.mergeDeep).toHaveBeenCalled();
    expect(systemServiceMock.getHash).toHaveBeenCalledWith(4);
    expect(response.menus.length).toBe(2);
    expect(response.active).not.toBeFalsy();
  });

  it('[10] Obtener menus: getMenus() :: sin menu activo', async () => {
    config.system.buttons.home = false;

    const modulo = 'modulo';
    spyOn(invokerServiceMock, 'httpInvoke').and.returnValue(
      Promise.resolve([
        {
          idMenu: 'menu1',
          nombre: 'Menu1',
          tipoMod: 'ANGULAR',
          iconoBootstrap: 'pi pi-home',
          estilo: '',
          menuActivo: 1,
          descripcion: 'descripcion',
          grupo: null,
          metodo: 'metodo1',
          items: [],
        },
      ]),
    );
    spyOn(commonUtilsMock, 'mergeDeep').and.callThrough();

    const response = await service.getMenus(modulo);
    expect(invokerServiceMock.httpInvoke).toHaveBeenCalledWith(
      'base/getMenus',
      { codModulo: modulo },
    );
    expect(commonUtilsMock.mergeDeep).toHaveBeenCalled();
    expect(response.menus.length).toBe(1);
    expect(response.active).toBeFalsy();
  });

  it('[11] Obtener aplicaciones cargadas: getAplicacionesArray() ', () => {
    spyOn(commonUtilsMock, 'mergeDeep').and.callThrough();
    var data = service.getAplicacionesArray();
    expect(commonUtilsMock.mergeDeep).toHaveBeenCalled();
    expect(data.length).toBeGreaterThanOrEqual(0);
  });

  it('[12] Obtener modulos cargados: getModulosArray() ', () => {
    spyOn(commonUtilsMock, 'mergeDeep').and.callThrough();
    var data = service.getModulosArray();
    expect(commonUtilsMock.mergeDeep).toHaveBeenCalled();
    expect(data.length).toBeGreaterThanOrEqual(0);
  });

  it('[13] Obtener menus cargados: getMenusArray() ', () => {
    spyOn(commonUtilsMock, 'mergeDeep').and.callThrough();
    var data = service.getMenusArray();
    expect(commonUtilsMock.mergeDeep).toHaveBeenCalled();
    expect(data.length).toBeGreaterThanOrEqual(0);
  });

  it('[14] Obtener aplicacion activa: getAplicacionActive() ', () => {
    service['aplicacionActive'] = aplicacion_activa;
    var data = service.getAplicacionActive();
    expect(data).toEqual(aplicacion_activa);
  });

  it('[15] Obtener modulo activo: getModuloActive() ', () => {
    service['moduloActive'] = modulo_activo;
    var data = service.getModuloActive();
    expect(data).toEqual(modulo_activo);
  });

  it('[16] Obtener menu activo: getMenuActive() ', () => {
    service['menuActive'] = menu_activo;
    var data = service.getMenuActive();
    expect(data).toEqual(menu_activo);
  });

  it('[17] Obtener fecha actual: getTodayData()', async () => {
    spyOn(invokerServiceMock, 'httpInvoke').and.returnValue(
      Promise.resolve(20240411),
    );

    const response = await service.getTodayData();
    expect(invokerServiceMock.httpInvoke).toHaveBeenCalledWith(
      'base/getFechaActual',
    );
    expect(response).not.toBeNull();
  });

  it('[18] Obtener fecha actual cargada: getToday() ', async () => {
    spyOn(invokerServiceMock, 'httpInvoke').and.returnValue(
      Promise.resolve(20240411),
    );
    await service.getTodayData();
    expect(invokerServiceMock.httpInvoke).toHaveBeenCalledWith(
      'base/getFechaActual',
    );
    var data = service.getToday();
    expect(data).not.toBeNull();
  });

  it('[19] Navegar en el sistema: navigate() :: menu activo + item activo', async () => {
    const mockRouter: any = {
      navigate: jasmine.createSpy('navigate'),
    };

    await service.navigate(mockRouter, menu_activo, item_activo);
    expect(mockRouter.navigate).toHaveBeenCalledWith(
      [`/${menu_activo.metodo}/${item_activo.metodo}`],
      {
        state: {
          menu: menu_activo,
          item: item_activo,
        },
      },
    );
  });

  it('[20] Navegar en el sistema: navigate() :: menu activo + item mantencion', async () => {
    const mockRouter: any = {
      navigate: jasmine.createSpy('navigate'),
    };

    await service.navigate(mockRouter, menu_activo, item_mantencion);
    expect(mockRouter.navigate).toHaveBeenCalledWith([`/maintenance`], {
      state: {
        mode: 'menu',
      },
    });
  });

  it('[21] Navegar en el sistema: navigate() :: menu activo + item desarrollo', async () => {
    const mockRouter: any = {
      navigate: jasmine.createSpy('navigate'),
    };

    await service.navigate(mockRouter, menu_activo, item_desarrollo);
    expect(mockRouter.navigate).toHaveBeenCalledWith([`/develop`], {
      state: {
        mode: 'menu',
      },
    });
  });

  it('[22] Navegar en el sistema: navigate() :: menu activo', async () => {
    const mockRouter: any = {
      navigate: jasmine.createSpy('navigate'),
    };

    await service.navigate(mockRouter, menu_activo);
    expect(mockRouter.navigate).toHaveBeenCalledWith(
      [`/${menu_activo.metodo}`],
      {
        state: {
          menu: menu_activo,
          item: undefined,
        },
      },
    );
  });

  it('[23] Navegar en el sistema: navigate() :: menu mantencion', async () => {
    const mockRouter: any = {
      navigate: jasmine.createSpy('navigate'),
    };

    await service.navigate(mockRouter, menu_mantencion);
    expect(mockRouter.navigate).toHaveBeenCalledWith([`/maintenance`], {
      state: {
        mode: 'menu',
      },
    });
  });

  it('[24] Navegar en el sistema: navigate() :: menu desarrollo', async () => {
    const mockRouter: any = {
      navigate: jasmine.createSpy('navigate'),
    };

    await service.navigate(mockRouter, menu_desarrollo);
    expect(mockRouter.navigate).toHaveBeenCalledWith([`/develop`], {
      state: {
        mode: 'menu',
      },
    });
  });

  it('[25] Navegacion modulo no activo: notActiveModulo() :: en mantención:', async () => {
    const mockRouter: any = {
      navigate: jasmine.createSpy('navigate'),
    };

    await service.notActiveModulo(mockRouter, 'maintenance');
    expect(mockRouter.navigate).toHaveBeenCalledWith([`/maintenance`], {
      state: {
        mode: 'modulo',
      },
    });
  });

  it('[26] Navegacion modulo no activo: notActiveModulo() :: en desarrollo:', async () => {
    const mockRouter: any = {
      navigate: jasmine.createSpy('navigate'),
    };

    await service.notActiveModulo(mockRouter, 'develop');
    expect(mockRouter.navigate).toHaveBeenCalledWith([`/develop`], {
      state: {
        mode: 'modulo',
      },
    });
  });

  it('[27] Anunciar una navegacion: eventNavigate()', async () => {
    spyOn(service['navigateRx'], 'next').and.callThrough();
    service['eventNavigate'](true, [], menu_activo, item_activo);
    expect(service['navigateRx'].next).toHaveBeenCalled();
  });

  it('[28] Ir al inicio: homeNavigate()', async () => {
    const mockRouter: any = {
      navigate: jasmine.createSpy('navigate'),
    };

    service['menuHome'] = homeMenu;
    spyOn(service, 'navigate').and.callThrough();
    await service.homeNavigate(mockRouter);
    expect(service.navigate).toHaveBeenCalledWith(mockRouter, homeMenu);
    expect(mockRouter.navigate).toHaveBeenCalledWith([`/`], {
      state: {
        menu: homeMenu,
        item: undefined,
      },
    });
  });

  it('[29] Migas de pan: setBreadcrumb() :: menu + item', async () => {
    var data = service['setBreadcrumb'](menu_activo, item_activo);
    expect(data.length).toBe(2);
  });

  it('[30] Migas de pan: setBreadcrumb() :: menu', async () => {
    var data = service['setBreadcrumb'](menu_activo);
    expect(data.length).toBe(1);
  });

  it('[31] Migas de pan: setBreadcrumb() :: menu home', async () => {
    var data = service['setBreadcrumb'](homeMenu);
    expect(data.length).toBe(0);
  });

  it('[32] Posición navegación: getPosition() :: menu', () => {
    service['menuActive'] = menu_activo;
    var posicion = service['getPosition']();
    expect(posicion.menu).toEqual(menu_activo);
    expect(posicion.item).toBeFalsy();
  });

  it('[33] Posición navegación: getPosition() :: menu + item', () => {
    service['menuActive'] = menu_activo;
    service['itemActive'] = item_activo;
    var posicion = service['getPosition']();
    expect(posicion.menu).toEqual(menu_activo);
    expect(posicion.item).toEqual(item_activo);
  });
});
