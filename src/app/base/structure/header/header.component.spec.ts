import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ThemeService } from '../../services/theme.service';
import { PanelControlService } from '../../services/panel_control.service';
import { PortalService } from '../../services/portal.service';
import { TestingBaseModule } from '../../modules/testing.module';
import { InitService } from '../../services/init.service';
import { Usuario } from '../../models/usuario';
import { UsuarioService } from '../../services/usuario.service';
import { UsuarioServiceMock } from '../../test/mocks/usuario.service.mock';
import { InitServiceMock } from '../../test/mocks/init.service.mock';
import { PortalServiceMock } from '../../test/mocks/portal.service.mock';
import { ThemeServiceMock } from '../../test/mocks/theme.service.mock';
import { PanelControlServiceMock } from '../../test/mocks/panel_control.service.mock';
import { Modulo } from '../../models/modulo';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let panelControlServiceMock: PanelControlServiceMock;
  let portalServiceMock: PortalServiceMock;
  let themeServiceMock: ThemeServiceMock;

  const usuarioOnline: Usuario = {
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

  const config = {
    system: {
      name: 'Mi Sistema',
      token: true,
      icons: {
        portal: 'fa-solid fa-building-columns',
        ayuda: 'pi pi-question-circle',
        sistemas: 'pi pi-th-large',
        avisos: 'pi pi-bell',
        menus: 'pi pi-bars',
        theme: 'fa-solid fa-universal-access',
      },
      theme: {
        active: true,
        themes: {
          default: 'light',
        },
      },
      buttons: {
        home: true,
        theme: {
          active: true,
        },
        sistemas: {
          active: true,
        },
        menus: {
          active: true,
        },
        avisos: true,
        portal: true,
        ayuda: {
          active: true,
        },
        usuario: {
          active: true,
        },
      },
    },
    sites: {
      uv: {
        name: 'Universidad de Valparaíso',
      },
    },
  };

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [TestingBaseModule],
      declarations: [HeaderComponent],
      providers: [
        {
          provide: PanelControlService,
          useClass: PanelControlServiceMock,
        },
        {
          provide: ThemeService,
          useClass: ThemeServiceMock,
        },
        {
          provide: PortalService,
          useClass: PortalServiceMock,
        },
        { provide: InitService, useValue: new InitServiceMock(config) },
        {
          provide: UsuarioService,
          useValue: new UsuarioServiceMock(usuarioOnline),
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    panelControlServiceMock = TestBed.inject(PanelControlService) as any;
    portalServiceMock = TestBed.inject(PortalService);
    themeServiceMock = TestBed.inject(ThemeService) as any;

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
  });

  it('[1] Existe', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
    expect(component.title).toEqual('Mi Sistema');
    expect(component.avisos_count).toBe(0);
    expect(component.theme).toBe('light');
    expect(component.icons).toEqual({
      portal: 'fa-solid fa-building-columns',
      ayuda: 'pi pi-question-circle',
      sistemas: 'pi pi-th-large',
      avisos: 'pi pi-bell',
      menus: 'pi pi-bars',
      theme: 'fa-solid fa-universal-access',
    });
    expect(component.uvname).toEqual('Universidad de Valparaíso');
    expect(component.usuario).toEqual(usuarioOnline);
    expect(component.isToken).toBeTrue();
    expect(component.showVolverPortal_b).toBeTrue();
    expect(component.showAyuda_b).toBeTrue();
    expect(component.showMiCuenta_b).toBeTrue();
    expect(component.showSistemas_b).toBeTrue();
    expect(component.showAvisos_b).toBeTrue();
    expect(component.showMenus_b).toBeTrue();
    expect(component.showTheme_b).toBeTrue();
  });

  it('[2] Evento: theme', () => {
    fixture.detectChanges();
    themeServiceMock['themeRx'].next({ theme: 'light' });
    expect(component.theme).toBe('light');
  });

  it('[3] Evento: modulo', () => {
    fixture.detectChanges();
    panelControlServiceMock['modulosRx'].next({ active: modulo_activo });
    expect(component.title).toEqual(modulo_activo.nombre);
  });

  it('[4] goBackPortal()', () => {
    spyOn(portalServiceMock.backToPortalRx, 'next').and.callFake(() => {});
    component.goBackPortal();
    expect(portalServiceMock.backToPortalRx.next).toHaveBeenCalled();
  });

  it('[5] showAyuda()', () => {
    (component['ayuda'] as any) = { showAyuda: false };
    component.showAyuda();
    expect(component.ayuda.showAyuda).toBe(true);
  });

  it('[6] showMiCuenta()', () => {
    (component['miCuenta'] as any) = { showMiCuenta: false };
    component.showMiCuenta();
    expect(component.miCuenta.showMiCuenta).toBe(true);
  });

  it('[7] showSistemas()', () => {
    component.blocking = false;
    (component['sistemas'] as any) = { showMiCuenta: false };
    component.showSistemas();
    expect(component.sistemas.showSistemas).toBe(true);
  });

  it('[8] showAvisos()', () => {
    (component['avisos'] as any) = { showAvisos: false };
    component.showAvisos();
    expect(component.avisos.showAvisos).toBe(true);
  });

  it('[9] showMenus()', () => {
    component.blocking = false;
    (component['menus'] as any) = { showMenus: false };
    component.showMenus();

    expect(component.menus.showMenus).toBe(true);
  });

  it('[10] showTheme()', () => {
    (component['temas'] as any) = { showTemas: false };
    component.showTheme();
    expect(component.temas.showTemas).toBe(true);
  });
});
