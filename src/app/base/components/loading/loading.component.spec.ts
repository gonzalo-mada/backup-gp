import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoadingComponent } from './loading.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { SystemService } from '../../services/system.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestingBaseModule } from '../../modules/testing.module';
import { InitService } from '../../services/init.service';
import { SystemServiceMock } from '../../test/mocks/system.service.mock';
import { InitServiceMock } from '../../test/mocks/init.service.mock';
import { ThemeService } from '../../services/theme.service';
import { ThemeServiceMock } from '../../test/mocks/theme.service.mock';
import { WindowServiceMock } from '../../test/mocks/window.service.mock';
import { WindowService } from '../../services/window.service';

describe('LoadingComponent', () => {
  let component: LoadingComponent;
  let fixture: ComponentFixture<LoadingComponent>;
  let systemServiceMock: SystemServiceMock;
  let themeServiceMock: ThemeServiceMock;
  let windowServiceMock: WindowServiceMock;

  const translate: any = {
    loading: 'cargando',
  };

  const config = {
    system: {
      name: 'angular test',
    },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingBaseModule],
      declarations: [LoadingComponent],
      providers: [
        {
          provide: SystemService,
          useClass: SystemServiceMock,
        },
        {
          provide: ThemeService,
          useClass: ThemeServiceMock,
        },
        {
          provide: WindowService,
          useClass: WindowServiceMock,
        },
        NgxSpinnerService,
        { provide: InitService, useValue: new InitServiceMock(config) },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    themeServiceMock = TestBed.inject(ThemeService) as any;
    systemServiceMock = TestBed.inject(SystemService) as any;
    windowServiceMock = TestBed.inject(WindowService) as any;

    fixture = TestBed.createComponent(LoadingComponent);
    component = fixture.componentInstance;
  });

  it('[1] Existe', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
    expect(component.loading.msgs).toBe('angular test');
  });

  it('[2] Evento: loading :: show :: default', () => {
    spyOn(systemServiceMock, 'translate').and.callFake(() =>
      Promise.resolve(translate),
    );
    fixture.detectChanges();
    systemServiceMock['loadingSubject'].next({ active: true });
    expect(systemServiceMock.translate).toHaveBeenCalledWith(['loading']);
  });

  it('[3] Evento: loading :: hide', () => {
    spyOn(systemServiceMock, 'translate').and.callFake(() =>
      Promise.resolve(translate),
    );
    fixture.detectChanges();
    systemServiceMock['loadingSubject'].next({ active: false });
    expect(systemServiceMock.translate).toHaveBeenCalledWith(['loading']);
    systemServiceMock.translate$.subscribe((e: any) => {
      expect(e.active).toBeFalse();
    });
  });

  it('[4] Evento: loading :: show :: custom', () => {
    spyOn(systemServiceMock, 'translate').and.callFake(() =>
      Promise.resolve(translate),
    );
    fixture.detectChanges();
    systemServiceMock['loadingSubject'].next({
      active: true,
      msgs: 'angular test custom',
      bdColor: 'bdColor',
      color: 'color',
    });
    expect(systemServiceMock.translate).toHaveBeenCalledWith(['loading']);
    systemServiceMock.translate$.subscribe((e: any) => {
      expect(component.loading.msgs).toEqual('angular test custom');
    });
  });

  it('[5] Evento: theme', () => {
    fixture.detectChanges();
    themeServiceMock['themeRx'].next({ theme: 'dark' });
    expect(component.theme).toBe('dark');
  });

  it('[6] Existe un tema seleccionado por el usuario y esta en sessionStorage', () => {
    spyOn(windowServiceMock, 'getItemSessionStorage').and.returnValue('light');
    fixture.detectChanges();
    expect(component.theme).toBe('light');
  });
});
