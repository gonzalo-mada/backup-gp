import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { ErrorTemplate } from '../error-template';
import { TimeoutError } from 'rxjs';
import { fakeAsync, tick } from '@angular/core/testing';

describe('ErrorTemplate (CLASS)', () => {
  let routerMock: Router;

  const notifyMethods = ['page', 'alert', 'none'];

  beforeEach(() => {
    routerMock = jasmine.createSpyObj('Router', ['url']);
  });

  it('[1] HttpErrorResponse', () => {
    try {
      throw new HttpErrorResponse({
        error: { message: 'Server error message' },
        status: 500,
        statusText: 'Internal Server Error',
      });
    } catch (error) {
      const errorTemplate = new ErrorTemplate(error, {}, routerMock);
      expect(errorTemplate.getIsToken()).toBeFalse();
    }
  });

  it('[2] BackendError: DTIC error', () => {
    const errorTemplate = new ErrorTemplate(
      {
        type: 'FATAL',
        level: 'MEDIO',
        code: '0',
        message: 'Error del servicio.',
        trace: [],
      },
      {},
      routerMock,
    );
    expect(errorTemplate.getDetail().error.name).toBe('DticErrorResponse');
    expect(errorTemplate.getIsToken()).toBeFalse();
  });

  it('[3] TimeoutError', fakeAsync(() => {
    let errorOccurred = false;
    setTimeout(() => {
      errorOccurred = true;
    }, 5000);
    tick(4999);
    expect(errorOccurred).toBeFalse();
    tick(1);
    expect(errorOccurred).toBeTrue();
    try {
      throw new TimeoutError();
    } catch (error) {
      const errorTemplate = new ErrorTemplate(error, {}, routerMock);
      expect(errorTemplate.getDetail().timeout).toBeTrue();
      expect(errorTemplate.getIsToken()).toBeFalse();
    }
  }));

  it('[4] Otros errores', () => {
    try {
      throw new Error('soy un error');
    } catch (error) {
      const errorTemplate = new ErrorTemplate(error, {}, routerMock);
      expect(errorTemplate.getIsToken()).toBeFalse();
    }
  });

  it('[5] Detectar si es un Token error: success', () => {
    const errorTemplate = new ErrorTemplate(
      {
        type: 'FATAL',
        level: 'MEDIO',
        code: '0',
        message: 'jwt expired',
        trace: [],
      },
      {},
      routerMock,
    );
    expect(errorTemplate.getDetail().error.name).toBe('DticErrorResponse');
    expect(errorTemplate.getIsToken()).toBeTrue();
  });

  it('[6] Obtener objeto error', () => {
    const errorTemplate = new ErrorTemplate(
      new Error('soy un error'),
      {},
      routerMock,
    );
    var err = errorTemplate.getError();
    expect(err instanceof Error).toBeTrue();
  });

  it('[7] Obtener si ha sido procesado en sentry', () => {
    const errorTemplate = new ErrorTemplate(
      new Error('soy un error'),
      {},
      routerMock,
    );
    var isSentry = errorTemplate.getCaptureSentry();
    expect(typeof isSentry === 'boolean').toBeTrue();
  });

  it('[8] Obtener el metodo de notificación', () => {
    const errorTemplate = new ErrorTemplate(
      new Error('soy un error'),
      {},
      routerMock,
    );
    var method = errorTemplate.getNotifyMethod();
    expect(typeof method === 'string').toBeTrue();
    expect(notifyMethods.includes(method)).toBeTrue();
  });

  it('[9] Indicar mensaje: customizable', () => {
    const errorTemplate = new ErrorTemplate(
      new Error('soy un error'),
      {},
      routerMock,
    );
    errorTemplate.setMessage('este es un mensaje test');
    var detail = errorTemplate.getDetail();
    expect(detail.error.message).toBe('este es un mensaje test');
  });

  it('[10] Indicar que el error fue procesado en sentry (si es que esta activado)', () => {
    const errorTemplate = new ErrorTemplate(
      new Error('soy un error'),
      {},
      routerMock,
    );
    errorTemplate.setCaptureSentry(true);
    var isSentry = errorTemplate.getCaptureSentry();
    expect(typeof isSentry === 'boolean').toBeTrue();
    expect(isSentry).toBeTrue();
  });

  it('[11] Indicar vía de notificación: success', () => {
    const errorTemplate = new ErrorTemplate(
      new Error('soy un error'),
      {},
      routerMock,
    );
    errorTemplate.setNotifyMethod('alert');
    var method = errorTemplate.getNotifyMethod();
    expect(typeof method === 'string').toBeTrue();
    expect(notifyMethods.includes(method)).toBeTrue();
    errorTemplate.setNotifyMethod('none');
    method = errorTemplate.getNotifyMethod();
    expect(typeof method === 'string').toBeTrue();
    expect(notifyMethods.includes(method)).toBeTrue();
  });

  it('[12] Indicar vía de notificación: error', () => {
    const errorTemplate = new ErrorTemplate(
      new Error('soy un error'),
      {},
      routerMock,
    );
    errorTemplate.setNotifyMethod('sound');
    var method = errorTemplate.getNotifyMethod();
    expect(typeof method === 'string').toBeTrue();
    expect(notifyMethods.includes(method)).toBeFalse();
  });

  it('[13] Indicar titulo (solo aplicable alert): setSummary', () => {
    const errorTemplate = new ErrorTemplate(
      new Error('soy un error'),
      {},
      routerMock,
    );
    errorTemplate.setSummary('titulo');
    var detail = errorTemplate.getDetail();
    expect(detail.summary).toBe('titulo');
  });
});
