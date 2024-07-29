import { TestBed } from '@angular/core/testing';
import { InitService } from '../../../services/init.service';
import { InvokerUtils } from '../invoker.utils';
import { ErrorTemplate } from '../../../models/error-template';
import { SentryService } from '../../../services/sentry.service';
import { WindowService } from '../../../services/window.service';
import { HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { InitServiceMock } from 'src/app/base/test/mocks/init.service.mock';
import { WindowServiceMock } from 'src/app/base/test/mocks/window.service.mock';
import { SentryServiceMock } from 'src/app/base/test/mocks/sentry.service.mock';

describe('InvokerUtils (UTILS)', () => {
  let service: InvokerUtils;
  let sentryServiceMock: SentryServiceMock;
  let windowServiceMock: WindowServiceMock;

  const url = 'https://controladorexterno.uv.cl/sistema/base/angularUnitTest';
  const backend = 'https://controladorexterno.uv.cl/sistema';
  const params = { param: 'test' };

  const config = {
    reports: {
      types: {
        pdf: 'application/pdf',
        xls: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        doc: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      },
    },
    system: {
      backend: {
        timeout: 5000,
        retry: 1,
      },
    },
  };

  const service_1 = 'base/angularUnitTest';
  const service_2 = {
    service: 'base/angularUnitTest',
    timeout: 10000,
    retry: 5,
    loading: false,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: InitService, useValue: new InitServiceMock(config) },
        { provide: SentryService, useClass: SentryServiceMock },
        { provide: WindowService, useClass: WindowServiceMock },
      ],
    });

    sentryServiceMock = TestBed.inject(SentryService);
    windowServiceMock = TestBed.inject(WindowService);

    service = TestBed.inject(InvokerUtils);
  });

  it('[1] Es creado', () => {
    expect(service).toBeTruthy();
  });

  it('[2] Procesar contexto servicio: setService() :: llamado básico', () => {
    var dataService = service['setService'](service_1);
    expect(dataService.service).toBe(service_1);
    expect(dataService.timeout).toBe(service['timeoutDF']);
    expect(dataService.retry).toBe(service['retryDF']);
    expect(dataService.loading).toBeTrue();
  });

  it('[3] Procesar contexto servicio: setService() :: llamado custom', () => {
    var dataService = service['setService'](service_2);
    expect(dataService.service).toBe(service_2.service);
    expect(dataService.timeout).toBe(service_2.timeout);
    expect(dataService.retry).toBe(service_2.retry);
    expect(dataService.loading).toBeFalse();
  });

  it('[4] Obtener headers servicio: getHeaders() :: con token', () => {
    spyOn(windowServiceMock, 'getItemSessionStorage').and.returnValue('token');
    var headers = service['getHeaders']();
    expect(windowServiceMock.getItemSessionStorage).toHaveBeenCalledWith(
      'token',
    );
    expect(headers instanceof HttpHeaders).toBeTrue();
    expect(headers.get('Content-Type')).toBe(
      'application/x-www-form-urlencoded;charset=utf-8',
    );
    expect(headers.get('Authorization')).toBe('token');
  });

  it('[5] Obtener headers servicio: getHeaders() :: sin token', () => {
    spyOn(windowServiceMock, 'getItemSessionStorage').and.returnValue('');
    var headers = service['getHeaders']();
    expect(windowServiceMock.getItemSessionStorage).toHaveBeenCalledWith(
      'token',
    );
    expect(headers instanceof HttpHeaders).toBeTrue();
    expect(headers.get('Content-Type')).toBe(
      'application/x-www-form-urlencoded;charset=utf-8',
    );
    expect(headers.get('Authorization')).toBe('');
  });

  it('[6] Procesar request servicio: getRequest()', () => {
    var headers = service['getHeaders']();
    var request = service['getRequest'](headers, url, params);
    expect(request.method).toBe('POST');
    expect(request.service).toBe(url);
    expect(request.params).toEqual(params);
    expect(request.headers['authorization']).toEqual(
      headers.get('Authorization'),
    );
    expect(request.headers['content-type']).toEqual(
      headers.get('Content-Type'),
    );
  });

  it('[7] Procesar params servicio: setParams() :: con parametros', () => {
    var params = { param: 'test' };
    var data = service['setParams'](params);
    expect(data).toEqual('arg=%7B%22param%22%3A%22test%22%7D');
  });

  it('[8] Procesar params servicio: setParams() :: sin parametros', () => {
    var data = service['setParams']();
    expect(data).toEqual('arg=%7B%7D');
  });

  it('[9] Procesar error servicio: processError() :: no ErrorTemplate', () => {
    var error = new Error('backend error');
    var errorTemplate = new ErrorTemplate(
      new Error('backend error'),
      {},
      TestBed.inject(Router),
    );
    const router = TestBed.inject(Router);

    spyOn(sentryServiceMock, 'captureException').and.callFake(
      () => errorTemplate,
    );
    var data = service.processError(
      error,
      service['getRequest'](service['getHeaders'](), url, params),
      router,
    );
    expect(sentryServiceMock.captureException).toHaveBeenCalledWith(
      errorTemplate,
      error,
    );
    expect(data instanceof ErrorTemplate).toBeTrue();
  });

  it('[10] Procesar error servicio: processError() :: ErrorTemplate', () => {
    var errorTemplate = new ErrorTemplate(
      new Error('backend error'),
      {},
      TestBed.inject(Router),
    );
    const router = TestBed.inject(Router);
    var data = service.processError(errorTemplate, {}, router);
    expect(data instanceof ErrorTemplate).toBeTrue();
    expect(data).toEqual(errorTemplate);
  });

  it('[11] Procesar response servicio: processResponse() :: normal :: OK', async () => {
    const router = TestBed.inject(Router);
    var response = { status: 'OK', data: { name: 'jorge', age: 36 } };

    var data = await service.processResponse(
      service['getRequest'](service['getHeaders'](), url, params),
      response,
      router,
    );

    expect(data instanceof ErrorTemplate).toBeFalse();
    expect(data).toEqual(response.data);
  });

  it('[12] Procesar response servicio: processResponse() :: normal :: ERROR', async () => {
    const router = TestBed.inject(Router);
    var response = {
      status: 'ERROR',
      error: {
        type: 'FATAL',
        level: 'MEDIO',
        code: '0',
        message: 'Error del servicio.',
        trace: [],
      },
    };

    var data = await service.processResponse(
      service['getRequest'](service['getHeaders'](), url, params),
      response,
      router,
    );

    expect(data instanceof ErrorTemplate).toBeTrue();
  });

  it('[13] Procesar response servicio: processResponse() :: report :: OK', async () => {
    const router = TestBed.inject(Router);
    var type = 'application/pdf';
    const response = `data:${type};base64,UERGIGNvbnRlbnQ=`;

    var data: any = await service.processReport(
      service['getRequest'](service['getHeaders'](), url, params),
      response,
      router,
      'pdf',
    );

    expect(data instanceof ErrorTemplate).toBeFalse();
    expect(data.type.includes(type)).toBeTrue();
  });

  it('[14] Procesar response servicio: processResponse() :: report :: error', async () => {
    const router = TestBed.inject(Router);
    var response = new Blob(
      [
        JSON.stringify({
          status: 'ERROR',
          error: {
            type: 'FATAL',
            level: 'SUPERIOR',
            code: '0',
            message: 'ESTE ES UN ERROR',
            trace: [],
          },
        }),
      ],
      { type: 'application/json' },
    );

    var data = await service.processReport(
      service['getRequest'](service['getHeaders'](), url, params),
      response,
      router,
      'pdf',
    );

    expect(data instanceof ErrorTemplate).toBeTrue();
  });

  it('[15] Procesar response servicio: processResponse() :: report :: OK :: BAD PARSING', async () => {
    const router = TestBed.inject(Router);
    const response = `data:text/plain;base64,c295IHVuIHR4dA==`;

    var data = await service.processReport(
      service['getRequest'](service['getHeaders'](), url, params),
      response,
      router,
      'txt',
    );

    expect(data instanceof ErrorTemplate).toBeTrue();
  });

  it('[16] Preparar datos de conexión: prepareInvokerData() :: type: normal :: serviceData: Object', () => {
    const router = TestBed.inject(Router);
    var data = service.prepareInvokerData(backend, service_2, router);

    expect(data.headers instanceof HttpHeaders).toBeTrue();
    expect(data.router instanceof Router).toBeTrue();
    expect(typeof data.params).toBe('string');
    expect(typeof data.url).toBe('string');
    expect(typeof data.request).toBe('object');
    expect(typeof data.service).toBe('object');
  });
});
