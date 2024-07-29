import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { MiCuentaComponent } from './mi-cuenta.component';
import { SystemService } from 'src/app/base/services/system.service';
import { ThemeService } from 'src/app/base/services/theme.service';
import { InitService } from 'src/app/base/services/init.service';
import { HeaderUtils } from 'src/app/base/tools/utils/header.utils';
import { TestingBaseModule } from 'src/app/base/modules/testing.module';
import { Usuario } from 'src/app/base/models/usuario';
import { UsuarioService } from 'src/app/base/services/usuario.service';
import { WindowService } from 'src/app/base/services/window.service';
import { UsuarioServiceMock } from 'src/app/base/test/mocks/usuario.service.mock';
import { SystemServiceMock } from 'src/app/base/test/mocks/system.service.mock';
import { ThemeServiceMock } from 'src/app/base/test/mocks/theme.service.mock';
import { InitServiceMock } from 'src/app/base/test/mocks/init.service.mock';
import { WindowServiceMock } from 'src/app/base/test/mocks/window.service.mock';
import { HeaderUtilsMock } from 'src/app/base/test/mocks/header.utils.mock';

describe('MiCuentaComponent', () => {
  let component: MiCuentaComponent;
  let fixture: ComponentFixture<MiCuentaComponent>;
  let systemServiceMock: SystemServiceMock;
  let windowServiceMock: WindowServiceMock;
  let themeServiceMock: ThemeServiceMock;
  let headerUtilsMock: HeaderUtilsMock;

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
      token: true,
      url: {
        portal: 'https://portal.uv.cl',
      },
      icons: {
        logout: 'pi pi-sign-out',
      },
      buttons: {
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
        translate: { default: 'es' },
        themes: { default: 'light' },
      },
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestingBaseModule],
      declarations: [MiCuentaComponent],
      providers: [
        {
          provide: UsuarioService,
          useValue: new UsuarioServiceMock(online),
        },
        {
          provide: SystemService,
          useClass: SystemServiceMock,
        },
        {
          provide: ThemeService,
          useClass: ThemeServiceMock,
        },
        {
          provide: InitService,
          useValue: new InitServiceMock(config),
        },
        {
          provide: HeaderUtils,
          useClass: HeaderUtilsMock,
        },
        { provide: WindowService, useClass: WindowServiceMock },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    systemServiceMock = TestBed.inject(SystemService) as any;
    windowServiceMock = TestBed.inject(WindowService);
    themeServiceMock = TestBed.inject(ThemeService) as any;
    headerUtilsMock = TestBed.inject(HeaderUtils);

    fixture = TestBed.createComponent(MiCuentaComponent);
    component = fixture.componentInstance;
  });

  it('[1] Existe', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
    expect(component.theme).toBe('light');
    expect(component.usuario).toEqual(online);
    expect(component.showMiCuenta).toBeFalse();
    expect(component.isToken).toBeTrue();
    expect(component.show).toEqual({
      profile: true,
      correo: true,
      cambiaclave: true,
      logout: true,
    });
    expect(component.icon_logout).toEqual('pi pi-sign-out');
  });

  it('[2] Evento: theme', () => {
    fixture.detectChanges();
    themeServiceMock['themeRx'].next({ theme: 'light' });
    expect(component.theme).toBe('light');
  });

  it('[3] Evento: translate', () => {
    spyOn(component as any, 'setMiCuentaButtons').and.callFake(() => null);
    fixture.detectChanges();
    systemServiceMock['translateSubject'].next({});
    expect(component['setMiCuentaButtons']).toHaveBeenCalled();
  });

  it('[4] Procesar botones header: setMiCuentaButtons()', async () => {
    spyOn(headerUtilsMock, 'getMiCuentaButtons').and.callThrough();
    await component['setMiCuentaButtons']();
    expect(headerUtilsMock.getMiCuentaButtons).toHaveBeenCalled();
    expect(component.miCuentaButtons.length).toBeGreaterThanOrEqual(0);
  });

  it('[5] Cerrar sesión: logout()', async () => {
    spyOn(windowServiceMock, 'clearSessionStorage').and.callFake(() => null);
    spyOn(windowServiceMock, 'replaceLocation').and.callFake(() => null);
    component.logout();
    expect(windowServiceMock.clearSessionStorage).toHaveBeenCalled();
    expect(windowServiceMock.replaceLocation).toHaveBeenCalledWith(
      'https://portal.uv.cl',
    );
  });
});
