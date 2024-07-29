import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DevelopComponent } from './develop.component';
import { InitService } from '../../services/init.service';
import { ThemeService } from '../../services/theme.service';
import { PanelControlService } from '../../services/panel_control.service';
import { Navigation, Router } from '@angular/router';
import { PortalService } from '../../services/portal.service';
import { TestingBaseModule } from '../../modules/testing.module';
import { InitServiceMock } from '../../test/mocks/init.service.mock';
import { ThemeServiceMock } from '../../test/mocks/theme.service.mock';
import { PanelControlServiceMock } from '../../test/mocks/panel_control.service.mock';
import { PortalServiceMock } from '../../test/mocks/portal.service.mock';

describe('DevelopComponent', () => {
  let component: DevelopComponent;
  let fixture: ComponentFixture<DevelopComponent>;
  let portalServiceMock: PortalServiceMock;
  let themeServiceMock: ThemeServiceMock;
  let panelControlServiceMock: PanelControlServiceMock;
  let router: Router;

  const config = {
    sites: {
      dtic: { support: 'soporte@uv.cl' },
    },
    system: {
      icons: {
        home: 'pi pi-home',
        develop_page: 'fa-solid fa-trowel-bricks',
        portal: 'fa-solid fa-building-columns',
      },
      token: true,
      theme: {
        themes: {
          default: 'light',
        },
      },
    },
  };

  const fakeNavigation: Navigation = {
    id: 1,
    initialUrl: '',
    extractedUrl: '',
    trigger: 'imperative',
    previousNavigation: null,
    extras: {
      state: null,
    },
  } as any;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestingBaseModule],
      declarations: [DevelopComponent],
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
          provide: PortalService,
          useClass: PortalServiceMock,
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    portalServiceMock = TestBed.inject(PortalService);
    themeServiceMock = TestBed.inject(ThemeService) as any;
    panelControlServiceMock = TestBed.inject(PanelControlService) as any;
    router = TestBed.inject(Router);

    fixture = TestBed.createComponent(DevelopComponent);
    component = fixture.componentInstance;
  });

  it('[1] Existe', () => {
    spyOn(themeServiceMock, 'getTheme').and.callThrough();
    fixture.detectChanges();
    expect(component).toBeTruthy();
    expect(themeServiceMock.getTheme).toHaveBeenCalled();
    expect(component.theme).toBe('light');
    expect(component.mail_soporte).toEqual(config.sites.dtic.support);
    expect(component.showBack).toBeTrue();
    expect(component.icons).toEqual(config.system.icons);
  });

  it('[2] Evento: theme', () => {
    fixture.detectChanges();
    themeServiceMock['themeRx'].next({ theme: 'light' });
    expect(component.theme).toBe('light');
  });

  it('[3] Modo menu', () => {
    fakeNavigation.extras.state = { mode: 'menu' };
    spyOn(router, 'getCurrentNavigation').and.returnValue(fakeNavigation);

    fixture = TestBed.createComponent(DevelopComponent);
    component = fixture.componentInstance;

    expect(router.getCurrentNavigation).toHaveBeenCalled();
    expect(component.state.mode).toEqual('menu');
  });

  it('[4] Modo modulo', () => {
    fakeNavigation.extras.state = { mode: 'modulo' };
    spyOn(router, 'getCurrentNavigation').and.returnValue(fakeNavigation);

    fixture = TestBed.createComponent(DevelopComponent);
    component = fixture.componentInstance;

    expect(router.getCurrentNavigation).toHaveBeenCalled();
    expect(component.state.mode).toEqual('modulo');
  });

  it('[5] Volver al inicio: goBack() :: menu', () => {
    spyOn(panelControlServiceMock, 'homeNavigate').and.callThrough();
    component['state'] = { mode: 'menu' };
    component.goBack();
    expect(panelControlServiceMock.homeNavigate).toHaveBeenCalledWith(router);
  });

  it('[6] Volver al portal: goBack() :: modulo', () => {
    spyOn(portalServiceMock.backToPortalRx, 'next').and.callThrough();
    component['state'] = { mode: 'modulo' };
    component.goBack();
    expect(portalServiceMock.backToPortalRx.next).toHaveBeenCalled();
  });
});
