import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FooterComponent } from './footer.component';
import { PanelControlService } from '../../services/panel_control.service';
import { InitService } from '../../services/init.service';
import { ThemeService } from '../../services/theme.service';
import { TestingBaseModule } from '../../modules/testing.module';
import { PanelControlServiceMock } from '../../test/mocks/panel_control.service.mock';
import { ThemeServiceMock } from '../../test/mocks/theme.service.mock';
import { InitServiceMock } from '../../test/mocks/init.service.mock';
import { Modulo } from '../../models/modulo';
import { WindowService } from '../../services/window.service';
import { WindowServiceMock } from '../../test/mocks/window.service.mock';

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;
  let themeServiceMock: ThemeServiceMock;
  let panelControlServiceMock: PanelControlServiceMock;
  let windowServiceMock: WindowServiceMock;

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
      name: 'angular test',
      url: {
        logouv: {
          uv: {
            light: 'https://repositorio.uv.cl/imagenes/logouv/svg/uv_azul.svg',
            dark: 'https://repositorio.uv.cl/imagenes/logouv/svg/uv_blanco.svg',
          },
        },
      },
      theme: {
        themes: {
          default: 'light',
        },
      },
    },
    sites: {
      uv: {
        name: 'Universidad de Valparaíso',
        initials: 'UV',
        url: 'https://uv.cl',
        rut: '60921000-1',
      },
    },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingBaseModule],
      declarations: [FooterComponent],
      providers: [
        {
          provide: PanelControlService,
          useClass: PanelControlServiceMock,
        },
        {
          provide: InitService,
          useValue: new InitServiceMock(config),
        },
        {
          provide: ThemeService,
          useClass: ThemeServiceMock,
        },
        { provide: WindowService, useClass: WindowServiceMock },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    themeServiceMock = TestBed.inject(ThemeService) as any;
    panelControlServiceMock = TestBed.inject(PanelControlService) as any;
    windowServiceMock = TestBed.inject(WindowService);

    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
  });

  it('[1] Existe :: tema light', () => {
    const tema = 'light';
    spyOn(windowServiceMock, 'getItemSessionStorage').and.returnValue(tema);

    fixture.detectChanges();
    expect(component).toBeTruthy();
    expect(component.theme).toBe(tema);
    expect(component.building).toEqual({
      name: 'Universidad de Valparaíso',
      initials: 'UV',
      url: 'https://uv.cl',
      rut: '60921000-1',
    });
    expect(component.title).toEqual('angular test');
    expect(component.logouv).toEqual(
      'https://repositorio.uv.cl/imagenes/logouv/svg/uv_azul.svg',
    );
  });

  it('[2] Existe :: tema dark', () => {
    const tema = 'dark';
    spyOn(windowServiceMock, 'getItemSessionStorage').and.returnValue(tema);

    fixture.detectChanges();
    expect(component).toBeTruthy();
    expect(component.theme).toBe(tema);
    expect(component.building).toEqual({
      name: 'Universidad de Valparaíso',
      initials: 'UV',
      url: 'https://uv.cl',
      rut: '60921000-1',
    });
    expect(component.title).toEqual('angular test');
    expect(component.logouv).toEqual(
      'https://repositorio.uv.cl/imagenes/logouv/svg/uv_blanco.svg',
    );
  });

  it('[3] Evento: theme', () => {
    fixture.detectChanges();
    themeServiceMock['themeRx'].next({ theme: 'dark' });
    expect(component.theme).toBe('dark');
    expect(component.logouv).toBe(
      'https://repositorio.uv.cl/imagenes/logouv/svg/uv_blanco.svg',
    );
  });

  it('[4] Evento: modulo :: con modulo', () => {
    fixture.detectChanges();
    panelControlServiceMock['modulosRx'].next({ active: modulo_activo });
    expect(component.title).toEqual('ANGULAR 1');
  });

  it('[5] Evento: modulo :: con modulo', () => {
    fixture.detectChanges();
    panelControlServiceMock['modulosRx'].next({ active: null });
    expect(component.title).toEqual('angular test');
  });
});
