import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ErrorComponent } from './error.component';
import { InitService } from '../../services/init.service';
import { ThemeService } from '../../services/theme.service';
import { TestingBaseModule } from '../../modules/testing.module';
import { Navigation, Router } from '@angular/router';
import { InitServiceMock } from '../../test/mocks/init.service.mock';
import { ThemeServiceMock } from '../../test/mocks/theme.service.mock';

describe('ErrorComponent', () => {
  let component: ErrorComponent;
  let fixture: ComponentFixture<ErrorComponent>;
  let themeServiceMock: ThemeServiceMock;
  let router: Router;

  const config = {
    sites: {
      dtic: { support: 'soporte@uv.cl' },
    },
    system: {
      icons: {
        error_page: 'fa-regular fa-times-circle',
      },
      theme: {
        themes: {
          default: 'light',
        },
      },
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestingBaseModule],
      declarations: [ErrorComponent],
      providers: [
        {
          provide: InitService,
          useValue: new InitServiceMock(config),
        },
        {
          provide: ThemeService,
          useClass: ThemeServiceMock,
        },
      ],
    }).compileComponents();
  });

  const fakeNavigation: Navigation = {
    id: 1,
    initialUrl: '',
    extractedUrl: '',
    trigger: 'imperative',
    previousNavigation: null,
    extras: {
      state: {
        error: {
          name: 'error',
          type: 'type',
          level: 'level',
          message: 'esto es un error',
        },
        router: '/',
      },
    },
  } as any;

  beforeEach(() => {
    themeServiceMock = TestBed.inject(ThemeService) as any;
    router = TestBed.inject(Router);

    fixture = TestBed.createComponent(ErrorComponent);
    component = fixture.componentInstance;
  });

  it('[1] Existe', () => {
    spyOn(themeServiceMock, 'getTheme').and.callThrough();
    fixture.detectChanges();
    expect(component).toBeTruthy();
    expect(themeServiceMock.getTheme).toHaveBeenCalled();
    expect(component.theme).toBe('light');
    expect(component.mail_soporte).toEqual(config.sites.dtic.support);
    expect(component.icons).toEqual(config.system.icons);
  });

  it('[2] Evento: theme', () => {
    fixture.detectChanges();
    themeServiceMock['themeRx'].next({ theme: 'light' });
    expect(component.theme).toBe('light');
  });

  it('[3] Modo error', () => {
    spyOn(router, 'getCurrentNavigation').and.returnValue(fakeNavigation);

    fixture = TestBed.createComponent(ErrorComponent);
    component = fixture.componentInstance;

    expect(router.getCurrentNavigation).toHaveBeenCalled();
    expect(component.state.router).toBe('/');
    expect(component.state.error.name).toBe('error');
    expect(component.state.error.type).toBe('type');
    expect(component.state.error.level).toBe('level');
    expect(component.state.error.message != '').toBeTrue();
  });
});
