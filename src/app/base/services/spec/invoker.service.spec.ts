import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { InvokerService } from '../invoker.service';
import { SystemServiceMock } from '../../test/mocks/system.service.mock';
import { SystemService } from '../system.service';
import { InvokerUtils } from '../../tools/utils/invoker.utils';
import { InvokerUtilsMock } from '../../test/mocks/invoker.utils.mock';
import { environment } from 'src/environments/environment';
import { ErrorTemplate } from '../../models/error-template';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';

describe('InvokerService (SERVICE)', () => {
  let service: InvokerService;
  let httpMock: HttpTestingController;
  let systemServiceMock: SystemServiceMock;
  let invokerUtilsMock: InvokerUtilsMock;

  const backend: string = environment.backend;

  const serviceBasic = 'getData';

  const serviceCustom = {
    service: 'getData',
    timeout: 6000,
    retry: 10,
    loading: false,
  };

  const reportResponseSuccess = new Blob(['soy un pdf'], {
    type: 'application/pdf',
  });

  const responseSuccess = {
    status: 'OK',
    data: { nombre: 'universidad de valparaiso', year: '2024' },
  };

  const responseError = {
    status: 'ERROR',
    error: {
      type: 'FATAL',
      level: 'MEDIO',
      code: '0',
      message: 'Error del servicio.',
      trace: [],
    },
  };

  const reportResponseError = new Blob(
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

  const serverError = new HttpErrorResponse({
    status: 500,
    statusText: 'Internal Server Error',
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        InvokerService,
        { provide: SystemService, useClass: SystemServiceMock },
        { provide: InvokerUtils, useClass: InvokerUtilsMock },
      ],
    });

    systemServiceMock = TestBed.inject(SystemService) as any;
    invokerUtilsMock = TestBed.inject(InvokerUtils) as any;
    service = TestBed.inject(InvokerService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('[1] Es creado', () => {
    expect(service).toBeTruthy();
    expect(backend).toBeTruthy();
    expect(backend).not.toBeNull();
    expect(backend).not.toEqual('');
  });

  it('[2] HttpInvoke() :: servicio basico :: success', fakeAsync(() => {
    let result: any;
    spyOn(systemServiceMock, 'loading').and.callThrough();
    spyOn(invokerUtilsMock, 'prepareInvokerData').and.callThrough();
    spyOn(invokerUtilsMock, 'processResponse').and.callThrough();
    service.httpInvoke(serviceBasic).then((response) => {
      result = response;
    });

    const req = httpMock.expectOne(`${backend}/${serviceBasic}`);
    expect(req.request.method).toBe('POST');
    req.flush(responseSuccess);

    tick();

    expect(result).toEqual(responseSuccess.data);
    expect(systemServiceMock.loading).toHaveBeenCalledWith(true);
    expect(systemServiceMock.loading).toHaveBeenCalledWith(false);
    expect(invokerUtilsMock.prepareInvokerData).toHaveBeenCalled();
    expect(invokerUtilsMock.processResponse).toHaveBeenCalled();
  }));

  it('[3] HttpInvoke() :: servicio detallado :: success', fakeAsync(() => {
    let result: any;
    spyOn(systemServiceMock, 'loading').and.callThrough();
    spyOn(invokerUtilsMock, 'prepareInvokerData').and.callThrough();
    spyOn(invokerUtilsMock, 'processResponse').and.callThrough();
    service.httpInvoke(serviceCustom).then((response) => {
      result = response;
    });

    const req = httpMock.expectOne(`${backend}/${serviceCustom.service}`);
    expect(req.request.method).toBe('POST');
    req.flush(responseSuccess);

    tick();

    expect(result).toEqual(responseSuccess.data);
    expect(systemServiceMock.loading).toHaveBeenCalledWith(false);
    expect(systemServiceMock.loading).toHaveBeenCalledWith(false);
    expect(invokerUtilsMock.prepareInvokerData).toHaveBeenCalled();
    expect(invokerUtilsMock.processResponse).toHaveBeenCalled();
  }));

  it('[4] HttpInvoke() :: error :: DTIC error', fakeAsync(() => {
    spyOn(systemServiceMock, 'loading').and.callThrough();
    spyOn(invokerUtilsMock, 'prepareInvokerData').and.callThrough();
    spyOn(invokerUtilsMock, 'processResponse').and.callThrough();

    let result: any;
    service.httpInvoke(serviceBasic).catch((error) => {
      result = error;
    });

    const req = httpMock.expectOne(`${backend}/${serviceBasic}`);
    expect(req.request.method).toBe('POST');
    req.flush(responseError);

    tick();

    expect(result instanceof ErrorTemplate).toBeTrue();
    expect((result as ErrorTemplate).getDetail().error.name).toBe(
      'DticErrorResponse',
    );
    expect(systemServiceMock.loading).toHaveBeenCalledWith(true);
    expect(systemServiceMock.loading).toHaveBeenCalledWith(false);
    expect(invokerUtilsMock.prepareInvokerData).toHaveBeenCalled();
    expect(invokerUtilsMock.processResponse).toHaveBeenCalled();
  }));

  it('[5] HttpInvoke() :: error :: server error', fakeAsync(() => {
    spyOn(service['http'], 'post').and.returnValue(
      throwError(() => serverError),
    );

    spyOn(systemServiceMock, 'loading').and.callThrough();
    spyOn(invokerUtilsMock, 'prepareInvokerData').and.callThrough();
    spyOn(invokerUtilsMock, 'processResponse').and.callThrough();
    spyOn(invokerUtilsMock, 'processError').and.callThrough();

    let result: any;
    service.httpInvoke(serviceBasic).catch((error) => {
      result = error;
    });

    tick();

    expect(result instanceof ErrorTemplate).toBeTrue();
    var httpError = (result as ErrorTemplate).getDetail().error;
    expect(httpError instanceof HttpErrorResponse).toBeTrue();
    expect(httpError.status).toBe(500);
    expect(systemServiceMock.loading).toHaveBeenCalledWith(true);
    expect(systemServiceMock.loading).toHaveBeenCalledWith(false);
    expect(invokerUtilsMock.prepareInvokerData).toHaveBeenCalled();
    expect(invokerUtilsMock.processResponse).not.toHaveBeenCalled();
    expect(invokerUtilsMock.processError).toHaveBeenCalled();
  }));

  it('[6] httpInvokeReport() :: servicio basico :: success', fakeAsync(() => {
    spyOn(systemServiceMock, 'loading').and.callThrough();
    spyOn(invokerUtilsMock, 'prepareInvokerData').and.callThrough();
    spyOn(invokerUtilsMock, 'processReport').and.callThrough();
    tick();

    service.httpInvokeReport(serviceBasic, 'pdf').then((response) => {
      expect(response instanceof Blob).toBeTrue();
      expect(response).toEqual(reportResponseSuccess);
    });

    const req = httpMock.expectOne(`${backend}/${serviceBasic}`);
    expect(req.request.method).toBe('POST');
    req.flush(reportResponseSuccess);

    tick();

    expect(systemServiceMock.loading).toHaveBeenCalledWith(true);
    expect(systemServiceMock.loading).toHaveBeenCalledWith(false);
    expect(invokerUtilsMock.prepareInvokerData).toHaveBeenCalled();
    expect(invokerUtilsMock.processReport).toHaveBeenCalled();
  }));

  it('[7] httpInvokeReport() :: servicio detallado :: success', fakeAsync(() => {
    spyOn(systemServiceMock, 'loading').and.callThrough();
    spyOn(invokerUtilsMock, 'prepareInvokerData').and.callThrough();
    spyOn(invokerUtilsMock, 'processReport').and.callThrough();
    tick();

    service.httpInvokeReport(serviceCustom, 'pdf').then((response) => {
      expect(response instanceof Blob).toBeTrue();
      expect(response).toEqual(reportResponseSuccess);
    });

    const req = httpMock.expectOne(`${backend}/${serviceCustom.service}`);
    expect(req.request.method).toBe('POST');
    req.flush(reportResponseSuccess);

    tick();

    expect(systemServiceMock.loading).toHaveBeenCalledWith(false);
    expect(systemServiceMock.loading).toHaveBeenCalledWith(false);
    expect(invokerUtilsMock.prepareInvokerData).toHaveBeenCalled();
    expect(invokerUtilsMock.processReport).toHaveBeenCalled();
  }));

  it('[8] httpInvokeReport() :: error :: DTIC error', fakeAsync(() => {
    spyOn(systemServiceMock, 'loading').and.callThrough();
    spyOn(invokerUtilsMock, 'prepareInvokerData').and.callThrough();
    spyOn(invokerUtilsMock, 'processReport').and.callThrough();
    tick();

    service.httpInvokeReport(serviceBasic, 'pdf').catch((error) => {
      expect(error instanceof ErrorTemplate).toBeTrue();
      expect((error as ErrorTemplate).getDetail().error.name).toBe(
        'DticErrorResponse',
      );
    });

    const req = httpMock.expectOne(`${backend}/${serviceBasic}`);
    expect(req.request.method).toBe('POST');
    req.flush(reportResponseError);

    tick();

    expect(systemServiceMock.loading).toHaveBeenCalledWith(true);
    expect(systemServiceMock.loading).toHaveBeenCalledWith(false);
    expect(invokerUtilsMock.prepareInvokerData).toHaveBeenCalled();
    expect(invokerUtilsMock.processReport).toHaveBeenCalled();
  }));

  it('[9] httpInvokeReport() :: error :: server error', fakeAsync(() => {
    spyOn(service['http'], 'post').and.returnValue(
      throwError(() => serverError),
    );

    spyOn(systemServiceMock, 'loading').and.callThrough();
    spyOn(invokerUtilsMock, 'prepareInvokerData').and.callThrough();
    spyOn(invokerUtilsMock, 'processReport').and.callThrough();
    spyOn(invokerUtilsMock, 'processError').and.callThrough();

    service.httpInvokeReport(serviceBasic, 'pdf').catch((error) => {
      expect(error instanceof ErrorTemplate).toBeTrue();
      var httpError = (error as ErrorTemplate).getDetail().error;
      expect(httpError instanceof HttpErrorResponse).toBeTrue();
      expect(httpError.status).toBe(500);
    });

    tick();

    expect(systemServiceMock.loading).toHaveBeenCalledWith(true);
    expect(systemServiceMock.loading).toHaveBeenCalledWith(false);
    expect(invokerUtilsMock.prepareInvokerData).toHaveBeenCalled();
    expect(invokerUtilsMock.processReport).not.toHaveBeenCalled();
    expect(invokerUtilsMock.processError).toHaveBeenCalled();
  }));
});
