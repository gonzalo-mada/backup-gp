import { TestBed } from '@angular/core/testing';
import { SentryService } from '../sentry.service';
import { InitService } from '../init.service';
import { ErrorTemplate } from '../../models/error-template';
import { InitServiceMock } from '../../test/mocks/init.service.mock';
import { UsuarioServiceMock } from '../../test/mocks/usuario.service.mock';
import { Usuario } from '../../models/usuario';
import { environment } from 'src/environments/environment';
import { Injector } from '@angular/core';
import { Router } from '@angular/router';

describe('SentryService (SERVICE)', () => {
  let service: SentryService;

  const mockInjector = jasmine.createSpyObj('Injector', ['get']);

  const online: Usuario = {
    anonimo: false,
    apellidos: 'apellidos',
    correo_personal: 'correo@gmail.com',
    correo_uv: 'correo@uv.cl',
    foto: '',
    idioma: 'es',
    nombre_completo: 'nombres apellidos',
    nombres: 'nombres',
    rut: '11111111-1',
    uid: '11111111',
    adicional: null,
  };

  const config = {
    sentry: {
      active: true,
    },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SentryService,
        {
          provide: InitService,
          useValue: new InitServiceMock(config),
        },
        { provide: Injector, useValue: mockInjector },
      ],
    });
    service = TestBed.inject(SentryService);
  });

  it('[1] Es creado', () => {
    expect(service).toBeTruthy();
    expect(service['production']).toEqual(environment.production);
    expect(service['sentry']).toBeTruthy();
  });

  it('[2] Capturar un error en sentry: captureException() :: env = dev', () => {
    const realError: any = new Error('Soy un error');
    const errorTemplate: ErrorTemplate = new ErrorTemplate(
      realError,
      {},
      TestBed.inject(Router),
    );

    mockInjector.get.and.returnValue(new UsuarioServiceMock(online));
    spyOn(errorTemplate, 'setCaptureSentry').and.callThrough();

    // env = prod
    service['production'] = false;

    const result = service.captureException(errorTemplate, realError);
    expect(mockInjector.get).not.toHaveBeenCalled();
    expect(errorTemplate.setCaptureSentry).toHaveBeenCalled();
    expect(result.getCaptureSentry()).toBeTrue();
  });

  it('[3] Capturar un error en sentry: captureException() :: env = prod', () => {
    const realError: any = new Error('Soy un error');
    const errorTemplate: ErrorTemplate = new ErrorTemplate(
      realError,
      {},
      TestBed.inject(Router),
    );

    mockInjector.get.and.returnValue(new UsuarioServiceMock(online));
    spyOn(errorTemplate, 'setCaptureSentry').and.callThrough();

    // env = prod
    service['production'] = true;

    const result = service.captureException(errorTemplate, realError);
    expect(mockInjector.get).toHaveBeenCalled();
    expect(errorTemplate.setCaptureSentry).toHaveBeenCalledWith(true);
    expect(result.getCaptureSentry()).toBeTrue();
  });

  it('[4] Capturar un error en sentry: captureException() :: env = prod :: usuario no cargado', () => {
    const realError: any = new Error('Soy un error');
    const errorTemplate: ErrorTemplate = new ErrorTemplate(
      realError,
      {},
      TestBed.inject(Router),
    );

    mockInjector.get.and.returnValue(new UsuarioServiceMock());
    spyOn(errorTemplate, 'setCaptureSentry').and.callThrough();

    // env = prod
    service['production'] = true;

    const result = service.captureException(errorTemplate, realError);
    expect(mockInjector.get).toHaveBeenCalled();
    expect(errorTemplate.setCaptureSentry).toHaveBeenCalledWith(true);
    expect(result.getCaptureSentry()).toBeTrue();
  });

  it('[5] Capturar un error en sentry: captureException() :: env = prod :: try-catch', () => {
    const realError: any = new Error('Soy un error');
    const errorTemplate: ErrorTemplate = new ErrorTemplate(
      realError,
      {},
      TestBed.inject(Router),
    );

    mockInjector.get.and.throwError('');
    spyOn(errorTemplate, 'setCaptureSentry').and.callThrough();
    spyOn(console, 'error');

    // env = prod
    service['production'] = true;

    const result = service.captureException(errorTemplate, realError);
    expect(mockInjector.get).toHaveBeenCalled();
    expect(errorTemplate.setCaptureSentry).toHaveBeenCalledWith(true);
    expect(console.error).toHaveBeenCalledWith('SENTRY-ERROR');
    expect(result.getCaptureSentry()).toBeTrue();
  });
});
