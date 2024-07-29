import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SessionComponent } from './session.component';
import { InitService } from '../../services/init.service';
import { ThemeService } from '../../services/theme.service';
import { TestingBaseModule } from '../../modules/testing.module';
import { WindowService } from '../../services/window.service';
import { InitServiceMock } from '../../test/mocks/init.service.mock';
import { ThemeServiceMock } from '../../test/mocks/theme.service.mock';
import { WindowServiceMock } from '../../test/mocks/window.service.mock';

describe('SessionComponent', () => {
  let component: SessionComponent;
  let fixture: ComponentFixture<SessionComponent>;
  let themeServiceMock: ThemeServiceMock;
  let windowServiceMock: WindowServiceMock;

  const config = {
    sites: {
      dtic: { support: 'soporte@uv.cl' },
    },
    system: {
      icons: {
        login: 'pi pi-sign-in',
        sesion_page: 'fa-solid fa-user-clock',
      },
      url: {
        portal: 'https://portal.uv.cl',
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
      declarations: [SessionComponent],
      providers: [
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
    windowServiceMock = TestBed.inject(WindowService);

    fixture = TestBed.createComponent(SessionComponent);
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

  it('[3] Cerrar sesión: logout()', () => {
    spyOn(windowServiceMock, 'clearSessionStorage').and.callFake(() => null);
    spyOn(windowServiceMock, 'replaceLocation').and.callFake(() => null);
    component.logout();
    expect(windowServiceMock.clearSessionStorage).toHaveBeenCalled();
    expect(windowServiceMock.replaceLocation).toHaveBeenCalledWith(
      'https://portal.uv.cl',
    );
  });
});
