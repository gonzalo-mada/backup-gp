import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotFoundComponent } from './not-found.component';
import { InitService } from '../../services/init.service';
import { ThemeService } from '../../services/theme.service';
import { PanelControlService } from '../../services/panel_control.service';
import { TestingBaseModule } from '../../modules/testing.module';
import { InitServiceMock } from '../../test/mocks/init.service.mock';
import { PanelControlServiceMock } from '../../test/mocks/panel_control.service.mock';
import { ThemeServiceMock } from '../../test/mocks/theme.service.mock';
import { Router } from '@angular/router';

describe('NotFoundComponent', () => {
  let component: NotFoundComponent;
  let fixture: ComponentFixture<NotFoundComponent>;
  let themeServiceMock: ThemeServiceMock;
  let panelControlServiceMock: PanelControlServiceMock;

  const config = {
    sites: {
      dtic: { support: 'soporte@uv.cl' },
    },
    system: {
      icons: {
        home: 'pi pi-home',
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
      declarations: [NotFoundComponent],
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
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    themeServiceMock = TestBed.inject(ThemeService) as any;
    panelControlServiceMock = TestBed.inject(PanelControlService) as any;

    fixture = TestBed.createComponent(NotFoundComponent);
    component = fixture.componentInstance;
  });

  it('[1] Existe', () => {
    spyOn(themeServiceMock, 'getTheme').and.callThrough();
    fixture.detectChanges();
    expect(component).toBeTruthy();
    expect(themeServiceMock.getTheme).toHaveBeenCalled();
    expect(component.theme).toBe('light');
    expect(component.mail_soporte).toEqual(config.sites.dtic.support);
    expect(component.homeIcon).toEqual(config.system.icons.home);
  });

  it('[2] Evento: theme', () => {
    fixture.detectChanges();
    themeServiceMock['themeRx'].next({ theme: 'light' });
    expect(component.theme).toBe('light');
  });

  it('[3] Volver al inicio: goHome()', () => {
    spyOn(panelControlServiceMock, 'homeNavigate').and.callThrough();
    component.goHome();
    expect(panelControlServiceMock.homeNavigate).toHaveBeenCalledWith(
      TestBed.inject(Router),
    );
  });
});
