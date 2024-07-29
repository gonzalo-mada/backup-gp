import { TestBed } from '@angular/core/testing';
import { ErrorTemplateHandler } from '../error.handler';
import { SystemService } from '../../../services/system.service';
import { SentryService } from 'src/app/base/services/sentry.service';
import { TestingBaseModule } from '../../../modules/testing.module';
import { Router } from '@angular/router';
import { ErrorTemplate } from '../../../models/error-template';
import { SystemServiceMock } from 'src/app/base/test/mocks/system.service.mock';
import { SentryServiceMock } from 'src/app/base/test/mocks/sentry.service.mock';

describe('ErrorTemplateHandler (HANDLER)', () => {
  let handler: ErrorTemplateHandler;
  let router: Router;
  let systemServiceMock: SystemServiceMock;
  let sentryServiceMock: SentryServiceMock;
  let consoleErrorSpy: jasmine.Spy;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingBaseModule],
      providers: [
        ErrorTemplateHandler,
        { provide: SystemService, useClass: SystemServiceMock },
        { provide: SentryService, useClass: SentryServiceMock },
      ],
    });

    router = TestBed.inject(Router);
    systemServiceMock = TestBed.inject(SystemService) as any;
    sentryServiceMock = TestBed.inject(SentryService);
    consoleErrorSpy = spyOn(console, 'error');

    handler = TestBed.inject(ErrorTemplateHandler);
  });

  it('[1] Es creado', () => {
    expect(handler).toBeTruthy();
  });

  it('[2] Manejo de error: handleError() :: errorTemplate: false, sentry: false', () => {
    spyOn(systemServiceMock, 'loading').and.callFake(() => null);
    spyOn(systemServiceMock, 'mainLoading').and.callFake(() => null);

    var error = new Error('error');
    handler.handleError(error);

    expect(systemServiceMock.loading).toHaveBeenCalledWith(false);
    expect(systemServiceMock.mainLoading).toHaveBeenCalledWith(false);
    expect(error instanceof ErrorTemplate).toBeFalse();
  });

  it('[3] Manejo de error: handleError() :: errorTemplate: true, sentry: false', () => {
    spyOn(systemServiceMock, 'loading').and.callFake(() => null);
    spyOn(systemServiceMock, 'mainLoading').and.callFake(() => null);

    var error = new ErrorTemplate(
      new Error('error'),
      {},
      TestBed.inject(Router),
    );
    handler.handleError(error);

    expect(systemServiceMock.loading).toHaveBeenCalledWith(false);
    expect(systemServiceMock.mainLoading).toHaveBeenCalledWith(false);
    expect(error instanceof ErrorTemplate).toBeTrue();
    expect(error.getCaptureSentry()).toBeFalse();
  });

  it('[4] Manejo de error: handleError() :: errorTemplate: true, sentry: true', () => {
    spyOn(systemServiceMock, 'loading').and.callFake(() => null);
    spyOn(systemServiceMock, 'mainLoading').and.callFake(() => null);

    var error = new ErrorTemplate(
      new Error('error'),
      {},
      TestBed.inject(Router),
    );
    error.setCaptureSentry(true);
    handler.handleError(error);

    expect(systemServiceMock.loading).toHaveBeenCalledWith(false);
    expect(systemServiceMock.mainLoading).toHaveBeenCalledWith(false);
    expect(error instanceof ErrorTemplate).toBeTrue();
    expect(error.getCaptureSentry()).toBeTrue();
  });

  it('[5] Procesar error: processError() :: errorTemplate: false, options: false', () => {
    spyOn(handler as any, 'verifyError').and.callThrough();
    spyOn(handler as any, 'proccessOptions').and.callThrough();
    spyOn(handler as any, 'handleError').and.callThrough();

    var error = new Error('error');
    handler.processError(error);

    expect(handler['verifyError']).toHaveBeenCalled();
    expect(handler['proccessOptions']).toHaveBeenCalled();
    expect(handler['handleError']).toHaveBeenCalled();
  });

  it('[6] Procesar error: processError() :: errorTemplate: true, options: false', () => {
    spyOn(handler as any, 'verifyError').and.callThrough();
    spyOn(handler as any, 'proccessOptions').and.callThrough();
    spyOn(handler as any, 'handleError').and.callThrough();

    var error = new ErrorTemplate(
      new Error('error'),
      {},
      TestBed.inject(Router),
    );
    handler.processError(error);

    expect(handler['verifyError']).toHaveBeenCalled();
    expect(handler['proccessOptions']).toHaveBeenCalled();
    expect(handler['handleError']).toHaveBeenCalled();
  });

  it('[7] Procesar error: processError() :: errorTemplate: true, options: true', () => {
    var error = new ErrorTemplate(
      new Error('error'),
      {},
      TestBed.inject(Router),
    );

    spyOn(handler as any, 'verifyError').and.callThrough();
    spyOn(handler as any, 'proccessOptions').and.callThrough();
    spyOn(handler as any, 'handleError').and.callThrough();
    spyOn(error, 'setMessage').and.callThrough();
    spyOn(error, 'setNotifyMethod').and.callThrough();
    spyOn(error, 'setSummary').and.callThrough();

    var opciones = {
      notifyMethod: 'alert',
      summary: 'titulo',
      message: 'este es un mensaje personalizado',
    };
    handler.processError(error, opciones);

    expect(handler['verifyError']).toHaveBeenCalled();
    expect(handler['proccessOptions']).toHaveBeenCalled();
    expect(handler['handleError']).toHaveBeenCalled();
    expect(error.setMessage).toHaveBeenCalled();
    expect(error.setNotifyMethod).toHaveBeenCalled();
    expect(error.setSummary).toHaveBeenCalled();
  });

  it('[8] Procesar error: processError() :: errorTemplate: true, options: false, timeout: true', () => {
    var error = new ErrorTemplate(
      new Error('error'),
      {},
      TestBed.inject(Router),
    );
    error.getDetail().timeout = true;

    spyOn(handler as any, 'verifyError').and.callThrough();
    spyOn(handler as any, 'proccessOptions').and.callThrough();
    spyOn(handler as any, 'handleError').and.callThrough();

    handler.processError(error);

    expect(handler['verifyError']).toHaveBeenCalled();
    expect(handler['proccessOptions']).toHaveBeenCalled();
    expect(handler['handleError']).toHaveBeenCalled();
  });

  it('[9] Verifica si un error ya esta procesado o no: verifyError() :: error no verificado', () => {
    var data = handler['verifyError'](new Error('error'));
    expect(data instanceof ErrorTemplate).toBeTrue();
  });

  it('[10] Verifica si un error ya esta procesado o no: verifyError() :: error verificado', () => {
    var data = handler['verifyError'](
      new ErrorTemplate(new Error('error'), {}, TestBed.inject(Router)),
    );
    expect(data instanceof ErrorTemplate).toBeTrue();
  });

  it('[11] Procesar opciones: proccessOptions() :: sin opciones', () => {
    var data = handler['proccessOptions'](
      new ErrorTemplate(new Error('error'), {}, TestBed.inject(Router)),
    );
    expect(data.notifyMethod).toEqual('page');
    expect(data.summary).toBeNull();
    expect(data.message).toBeNull();
  });

  it('[12] Procesar opciones: proccessOptions() :: con opciones', () => {
    var data = handler['proccessOptions'](
      new ErrorTemplate(new Error('error'), {}, TestBed.inject(Router)),
      { notifyMethod: 'alert', summary: 'titulo', message: 'mensaje' },
    );
    expect(data.notifyMethod).toEqual('alert');
    expect(data.summary).toEqual('titulo');
    expect(data.message).toEqual('mensaje');
  });

  it('[13] Procesar opciones: proccessOptions() :: sin opciones :: timeout', () => {
    var errorTemplate = new ErrorTemplate(
      new Error('error'),
      {},
      TestBed.inject(Router),
    );
    errorTemplate.getDetail().timeout = true;
    var data = handler['proccessOptions'](errorTemplate);

    expect(data.notifyMethod).toEqual('page');
    expect(data.summary).toBeNull();
    expect(data.message).toEqual('Tiempo de espera excedido (timeout)');
  });

  it('[14] Manejo de error: handleError() :: console.error()', () => {
    handler['isTestEnvironment'] = false;
    consoleErrorSpy.and.callFake(() => null);
    var error = new Error('error');
    handler.handleError(error);
    expect(handler['production']).toBeFalse();
    expect(consoleErrorSpy).toHaveBeenCalled();
  });
});
