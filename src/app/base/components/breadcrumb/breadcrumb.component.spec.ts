import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BreadcrumbComponent } from './breadcrumb.component';
import { PanelControlService } from '../../services/panel_control.service';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ThemeService } from '../../services/theme.service';
import { TestingBaseModule } from '../../modules/testing.module';
import { InitService } from '../../services/init.service';
import { ThemeServiceMock } from '../../test/mocks/theme.service.mock';
import { PanelControlServiceMock } from '../../test/mocks/panel_control.service.mock';
import { InitServiceMock } from '../../test/mocks/init.service.mock';
import { Router } from '@angular/router';

describe('BreadcrumbComponent', () => {
  let component: BreadcrumbComponent;
  let fixture: ComponentFixture<BreadcrumbComponent>;
  let themeServiceMock: ThemeServiceMock;
  let panelControlServiceMock: PanelControlServiceMock;

  const config = {
    system: {
      breadcrumb: true,
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

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingBaseModule],
      declarations: [BreadcrumbComponent],
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
          provide: InitService,
          useValue: new InitServiceMock(config),
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    themeServiceMock = TestBed.inject(ThemeService) as any;
    panelControlServiceMock = TestBed.inject(PanelControlService) as any;

    fixture = TestBed.createComponent(BreadcrumbComponent);
    component = fixture.componentInstance;
  });

  it('[1] Existe', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
    expect(component.breadCrumb.length).toBe(0);
    expect(component.home.icon).toBe('pi pi-home');
    expect(component.show).toBeTrue();
    expect(component.theme).toBe('light');
  });

  it('[2] Evento: theme', () => {
    fixture.detectChanges();
    themeServiceMock['themeRx'].next({ theme: 'light' });
    expect(component.theme).toBe('light');
  });

  it('[3] Evento: breadcrumb :: activo :: con miga', () => {
    fixture.detectChanges();
    panelControlServiceMock['navigateRx'].next({
      breadcrumb: [{ label: 'Page1' }],
    });
    expect(component.breadCrumb.length).toBeGreaterThanOrEqual(1);
  });

  it('[4] Evento: breadcrumb :: activo :: sin miga', () => {
    fixture.detectChanges();
    panelControlServiceMock['navigateRx'].next({
      breadcrumb: null,
    });
    expect(component.breadCrumb.length).toBe(0);
  });

  it('[5] Evento breadcrumb :: inactivo', () => {
    component.show = false;
    fixture.detectChanges();
    panelControlServiceMock['navigateRx'].next({
      breadcrumb: [{ label: 'Page1' }],
    });
    expect(component.breadCrumb.length).toBe(0);
  });

  it('[6] Ir al inicio: goHome()', () => {
    spyOn(panelControlServiceMock, 'homeNavigate').and.callFake(() =>
      Promise.resolve(),
    );
    component.goHome();
    expect(panelControlServiceMock.homeNavigate).toHaveBeenCalledWith(
      TestBed.inject(Router),
    );
  });

  it('[7] Botón ir al inicio: goHome()', () => {
    spyOn(panelControlServiceMock, 'homeNavigate').and.callFake(() =>
      Promise.resolve(),
    );
    if (component.home.command) {
      component.home.command({});
    }
    expect(panelControlServiceMock.homeNavigate).toHaveBeenCalledWith(
      TestBed.inject(Router),
    );
  });
});
