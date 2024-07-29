import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { MainLoadingComponent } from './main-loading.component';
import { PanelControlService } from '../../services/panel_control.service';
import { TestingBaseModule } from '../../modules/testing.module';
import { InitService } from '../../services/init.service';
import { PanelControlServiceMock } from '../../test/mocks/panel_control.service.mock';
import { InitServiceMock } from '../../test/mocks/init.service.mock';
import { Modulo } from '../../models/modulo';
import { WindowService } from '../../services/window.service';
import { WindowServiceMock } from '../../test/mocks/window.service.mock';
import { SystemServiceMock } from '../../test/mocks/system.service.mock';
import { SystemService } from '../../services/system.service';
import { By } from '@angular/platform-browser';

describe('MainLoadingComponent', () => {
  let component: MainLoadingComponent;
  let fixture: ComponentFixture<MainLoadingComponent>;
  let panelControlServiceMock: PanelControlServiceMock;
  let windowServiceMock: WindowServiceMock;
  let systemServiceMock: SystemServiceMock;

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
          main_loading: {
            light: 'https://repositorio.uv.cl/imagenes/logouv/svg/uv_azul.svg',
            dark: 'https://repositorio.uv.cl/imagenes/logouv/svg/uv_blanco.svg',
          },
        },
      },
    },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingBaseModule],
      declarations: [MainLoadingComponent],
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
        { provide: WindowService, useClass: WindowServiceMock },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    panelControlServiceMock = TestBed.inject(PanelControlService) as any;
    windowServiceMock = TestBed.inject(WindowService);
    systemServiceMock = TestBed.inject(SystemService) as any;

    fixture = TestBed.createComponent(MainLoadingComponent);
    component = fixture.componentInstance;
  });

  it('[1] Existe :: tema light', () => {
    const tema = 'light';
    spyOn(windowServiceMock, 'getItemSessionStorage').and.returnValue(tema);
    fixture.detectChanges();
    expect(component).toBeTruthy();
    expect(component.theme).toBe(tema);
  });

  it('[2] Existe :: tema dark', () => {
    const tema = 'dark';
    spyOn(windowServiceMock, 'getItemSessionStorage').and.returnValue(tema);
    fixture.detectChanges();
    expect(component).toBeTruthy();
    expect(component.theme).toBe(tema);
  });

  it('[3] Evento: modulo :: con modulo', () => {
    fixture.detectChanges();
    panelControlServiceMock['modulosRx'].next({ active: modulo_activo });
    expect(component.title).toEqual('ANGULAR 1');
  });

  it('[4] Evento: modulo :: sin modulo', () => {
    fixture.detectChanges();
    panelControlServiceMock['modulosRx'].next({ active: null });
    expect(component.title).toEqual('angular test');
  });

  it('[5] Evento: main loading :: show', () => {
    fixture.detectChanges();
    systemServiceMock['mainLoadingSubject'].next({ loading: true });
    var loadingElement = fixture.debugElement.query(
      By.css('.spinner-overlay'),
    ).nativeElement;
    var computedStyle = getComputedStyle(loadingElement);
    expect(computedStyle.display).toBe('flex');
  });

  it('[6] Evento: main loading :: hide', fakeAsync(() => {
    fixture.detectChanges();
    systemServiceMock['mainLoadingSubject'].next({ loading: false });
    var loadingElement = fixture.debugElement.query(
      By.css('.spinner-overlay'),
    ).nativeElement;
    var computedStyle = getComputedStyle(loadingElement);
    tick(2000);
    expect(computedStyle.display).toBe('none');
  }));
});
