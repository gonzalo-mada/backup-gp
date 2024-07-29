import { TestBed } from '@angular/core/testing';
import { UsuarioService } from '../usuario.service';
import { InitService } from '../init.service';
import { InvokerService } from '../invoker.service';
import { WindowService } from '../window.service';
import { InitServiceMock } from '../../test/mocks/init.service.mock';
import { WindowServiceMock } from '../../test/mocks/window.service.mock';
import { InvokerServiceMock } from '../../test/mocks/invoker.service.mock';
import { Usuario } from '../../models/usuario';
import { CommonUtilsMock } from '../../test/mocks/common.utils.mock';
import { CommonUtils } from '../../tools/utils/common.utils';

describe('UsuarioService (SERVICE)', () => {
  let service: UsuarioService;
  let invokerServiceMock: InvokerServiceMock;
  let windowServiceMock: WindowServiceMock;
  let commonUtilsMock: CommonUtilsMock;

  const online: Usuario = {
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

  const config = {
    system: {
      url: {
        repositorio: 'https://repositorio.uv.cl',
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
        default: 'https://admintui.uv.cl/data/fotos2/user_uv.jpg',
      },
    },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UsuarioService,
        { provide: InitService, useValue: new InitServiceMock(config) },
        { provide: InvokerService, useClass: InvokerServiceMock },
        { provide: WindowService, useClass: WindowServiceMock },
        { provide: CommonUtils, useClass: CommonUtilsMock },
      ],
    });

    service = TestBed.inject(UsuarioService);
    commonUtilsMock = TestBed.inject(CommonUtils);
    invokerServiceMock = TestBed.inject(InvokerService);
    windowServiceMock = TestBed.inject(WindowService);
  });

  it('[1] Es creado', () => {
    expect(service).toBeTruthy();
    expect(service['user']).toBeFalsy();
  });

  it('[2] Obtener sesión del usuario: getSession()', async () => {
    const idSesion = '123';
    const sessionData = { proyecto: 'proj', modulo: 'mod', token: 'token' };

    spyOn(windowServiceMock, 'setItemSessionStorage').and.returnValue();
    spyOn(invokerServiceMock, 'httpInvoke').and.callFake(() =>
      Promise.resolve(sessionData),
    );

    await service.getSession(idSesion);

    expect(invokerServiceMock.httpInvoke).toHaveBeenCalledWith(
      'base/getKeyUser',
      {
        idSesion: idSesion,
      },
    );
    expect(windowServiceMock.setItemSessionStorage).toHaveBeenCalledWith(
      'proyecto',
      sessionData.proyecto,
    );
    expect(windowServiceMock.setItemSessionStorage).toHaveBeenCalledWith(
      'modulo',
      sessionData.modulo,
    );
    expect(windowServiceMock.setItemSessionStorage).toHaveBeenCalledWith(
      'token',
      sessionData.token,
    );
  });

  it('[3] Obtener usuario: getUser() :: online :: con token => online', async () => {
    const token = 'token';
    const dataUsuario = {
      apellidos: 'apellidos',
      mail: 'correo@gmail.com',
      correouv: 'correo@uv.cl',
      foto: 'foto',
      idioma: 'es',
      nombreCompleto: 'nombres apellidos',
      nombres: 'nombres',
      rut: '11111111-1',
    };

    spyOn(windowServiceMock, 'getItemSessionStorage').and.returnValue(token);
    spyOn(invokerServiceMock, 'httpInvoke').and.callFake(() =>
      Promise.resolve(dataUsuario),
    );
    spyOn(commonUtilsMock, 'checkImageExists').and.callFake(() =>
      Promise.resolve(true),
    );
    spyOn(service as any, 'setUser').and.callThrough();

    var data = await service.getUser(true);

    expect(windowServiceMock.getItemSessionStorage).toHaveBeenCalledWith(
      'token',
    );
    expect(commonUtilsMock.checkImageExists).toHaveBeenCalled();
    expect(invokerServiceMock.httpInvoke).toHaveBeenCalledWith('base/getUser');
    expect(service['setUser']).toHaveBeenCalled();
    expect(data.anonimo).toBeFalse();
  });

  it('[4] Obtener usuario: getUser() :: online :: con token => online :: foto usuario no existe', async () => {
    const token = 'token';
    const dataUsuario = {
      apellidos: 'apellidos',
      mail: 'correo@gmail.com',
      correouv: 'correo@uv.cl',
      foto: 'foto',
      idioma: 'es',
      nombreCompleto: 'nombres apellidos',
      nombres: 'nombres',
      rut: '11111111-1',
    };

    spyOn(windowServiceMock, 'getItemSessionStorage').and.returnValue(token);
    spyOn(invokerServiceMock, 'httpInvoke').and.callFake(() =>
      Promise.resolve(dataUsuario),
    );
    spyOn(commonUtilsMock, 'checkImageExists').and.callFake(() =>
      Promise.resolve(false),
    );
    spyOn(service as any, 'setUser').and.callThrough();

    var data = await service.getUser(true);

    expect(windowServiceMock.getItemSessionStorage).toHaveBeenCalledWith(
      'token',
    );
    expect(commonUtilsMock.checkImageExists).toHaveBeenCalled();
    expect(invokerServiceMock.httpInvoke).toHaveBeenCalledWith('base/getUser');
    expect(service['setUser']).toHaveBeenCalled();
    expect(data.anonimo).toBeFalse();
    expect(data.foto).toBe('https://admintui.uv.cl/data/fotos2/user_uv.jpg');
  });

  it('[5] Obtener usuario: getUser() :: offline => anonimo', async () => {
    spyOn(service as any, 'setUser').and.callThrough();
    var data = await service.getUser(false);
    expect(service['setUser']).toHaveBeenCalledWith();
    expect(data.anonimo).toBeTrue();
  });

  it('[6] Obtener usuario: getUser() :: online :: sin token => NO TOKEN ERROR', async () => {
    const token = '';
    const dataUsuario = {
      apellidos: 'apellidos',
      mail: 'correo@gmail.com',
      correouv: 'correo@uv.cl',
      foto: 'foto',
      idioma: 'es',
      nombreCompleto: 'nombres apellidos',
      nombres: 'nombres',
      rut: '11111111-1',
    };

    spyOn(windowServiceMock, 'getItemSessionStorage').and.returnValue(token);
    spyOn(invokerServiceMock, 'httpInvoke').and.callFake(() =>
      Promise.resolve(dataUsuario),
    );

    try {
      await service.getUser(true);
    } catch (e) {
      expect(windowServiceMock.getItemSessionStorage).toHaveBeenCalledWith(
        'token',
      );
      expect(invokerServiceMock.httpInvoke).not.toHaveBeenCalledWith(
        'base/getUser',
      );
    }
  });

  it('[7] Guardar idioma seleccionado: saveIdioma()', async () => {
    const idioma = 'es';
    spyOn(invokerServiceMock, 'httpInvoke').and.callFake(() =>
      Promise.resolve(),
    );

    await service.saveIdioma(idioma);

    expect(invokerServiceMock.httpInvoke).toHaveBeenCalledWith(
      { service: 'base/saveIdioma', loading: false },
      { idioma: idioma },
    );
  });

  it('[8] Obtener usuario en el sistema: getUserOnline()', async () => {
    service['user'] = online;
    var data = service.getUserOnline();
    expect(data.anonimo).toBeFalse();
  });

  it('[9] Indicar el idioma a la cuenta del usuario al momento de seleccionar: setLang()', async () => {
    const newIdioma = 'en';
    service['user'] = online;
    service.setLang(newIdioma);
    expect(service['user'].idioma).toEqual(newIdioma);
  });

  it('[10] Mapear usuario: setUser() :: casos faltantes', async () => {
    spyOn(windowServiceMock, 'getItemSessionStorage').and.returnValue('');
    const dataUsuario = {
      apellidos: 'apellidos',
      mail: 'correo@gmail.com',
      correouv: 'correo@uv.cl',
      foto: 'foto',
      idioma: 'en',
      nombreCompleto: 'nombres apellidos',
      nombres: 'nombres',
      rut: '11111111-1',
      adicional: { colorFavorito: 'rojo' },
    };
    var usuario = service['setUser'](dataUsuario);
    expect(windowServiceMock.getItemSessionStorage).toHaveBeenCalledWith(
      'lang',
    );
    expect((await usuario).idioma).toBe('en');
    expect((await usuario).adicional).not.toBeNull();
  });
});
