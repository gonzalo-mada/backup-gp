import { TestBed } from '@angular/core/testing';
import { ComponentFixture } from '@angular/core/testing';
import { BackToPortalComponent } from './back-to-portal.component';
import { PortalService } from '../../services/portal.service';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { SystemService } from '../../services/system.service';
import { PanelControlService } from '../../services/panel_control.service';
import { ErrorTemplateHandler } from '../../tools/error/error.handler';
import { TestingBaseModule } from '../../modules/testing.module';
import { WindowService } from '../../services/window.service';
import { WindowServiceMock } from '../../test/mocks/window.service.mock';
import { ErrorTemplateHandlerMock } from '../../test/mocks/error-template.mock';
import { SystemServiceMock } from '../../test/mocks/system.service.mock';
import { PortalServiceMock } from '../../test/mocks/portal.service.mock';
import { PanelControlServiceMock } from '../../test/mocks/panel_control.service.mock';

describe('BackToPortalComponent', () => {
  let component: BackToPortalComponent;
  let fixture: ComponentFixture<BackToPortalComponent>;
  let errorTemplateHandlerMock: ErrorTemplateHandlerMock;
  let windowServiceMock: WindowServiceMock;
  let systemServiceMock: SystemServiceMock;
  let portalServiceMock: PortalServiceMock;
  let panelControlServiceMock: PanelControlServiceMock;

  const translate: any = { portal: { error_navigate: '' } };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingBaseModule],
      declarations: [BackToPortalComponent],
      providers: [
        {
          provide: PortalService,
          useClass: PortalServiceMock,
        },
        {
          provide: SystemService,
          useClass: SystemServiceMock,
        },
        {
          provide: PanelControlService,
          useClass: PanelControlServiceMock,
        },
        {
          provide: ErrorTemplateHandler,
          useClass: ErrorTemplateHandlerMock,
        },
        { provide: WindowService, useClass: WindowServiceMock },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    errorTemplateHandlerMock = TestBed.inject(ErrorTemplateHandler) as any;
    windowServiceMock = TestBed.inject(WindowService);
    systemServiceMock = TestBed.inject(SystemService) as any;
    portalServiceMock = TestBed.inject(PortalService);
    panelControlServiceMock = TestBed.inject(PanelControlService) as any;

    fixture = TestBed.createComponent(BackToPortalComponent);
    component = fixture.componentInstance;
  });

  it('[1] Existe', () => {
    expect(component).toBeTruthy();
  });

  it('[2] Evento: volver al portal: goBackPortal() :: success', () => {
    spyOn(component, 'goBackPortal').and.callFake(() => Promise.resolve());
    fixture.detectChanges();
    portalServiceMock.backToPortalRx.next({});
    expect(component.goBackPortal).toHaveBeenCalled();
  });

  it('[3] Volver al portal: goBackPortal() :: error :: portal activo', async () => {
    spyOn(windowServiceMock, 'getItemSessionStorage').and.returnValue('');
    spyOn(portalServiceMock, 'backToPortal').and.throwError('');
    spyOn(systemServiceMock, 'translate').and.callFake(() =>
      Promise.resolve(translate),
    );
    spyOn(panelControlServiceMock, 'getAplicacionActive').and.callThrough();
    spyOn(errorTemplateHandlerMock, 'processError').and.callFake(() => null);

    await component.goBackPortal();

    expect(portalServiceMock.backToPortal).toHaveBeenCalledWith('');
    expect(systemServiceMock.translate).toHaveBeenCalledWith([
      'portal.error_navigate',
    ]);
    expect(panelControlServiceMock.getAplicacionActive).toHaveBeenCalled();
    expect(errorTemplateHandlerMock.processError).toHaveBeenCalled();
    expect(windowServiceMock.getItemSessionStorage).toHaveBeenCalled();
  });

  it('[4] Volver al portal: goBackPortal() :: error :: portal inactivo', async () => {
    spyOn(windowServiceMock, 'getItemSessionStorage').and.returnValue('');
    spyOn(portalServiceMock, 'backToPortal').and.throwError('');
    spyOn(systemServiceMock, 'translate').and.callFake(() =>
      Promise.resolve(translate),
    );
    spyOn(panelControlServiceMock, 'getAplicacionActive').and.callFake(() => {
      return null;
    });
    spyOn(errorTemplateHandlerMock, 'processError').and.callFake(() => null);

    await component.goBackPortal();

    expect(portalServiceMock.backToPortal).toHaveBeenCalledWith('');
    expect(systemServiceMock.translate).toHaveBeenCalledWith([
      'portal.error_navigate',
    ]);
    expect(panelControlServiceMock.getAplicacionActive).toHaveBeenCalled();
    expect(errorTemplateHandlerMock.processError).toHaveBeenCalled();
    expect(windowServiceMock.getItemSessionStorage).toHaveBeenCalled();
  });
});
