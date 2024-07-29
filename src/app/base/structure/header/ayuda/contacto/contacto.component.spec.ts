import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { ContactoComponent } from './contacto.component';
import { UsuarioService } from 'src/app/base/services/usuario.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';
import { SystemService } from 'src/app/base/services/system.service';
import { ConfirmationService } from 'primeng/api';
import { Usuario } from 'src/app/base/models/usuario';
import { PortalService } from 'src/app/base/services/portal.service';
import { TestingBaseModule } from 'src/app/base/modules/testing.module';
import { ErrorTemplateHandler } from 'src/app/base/tools/error/error.handler';
import { UsuarioServiceMock } from 'src/app/base/test/mocks/usuario.service.mock';
import { PortalServiceMock } from 'src/app/base/test/mocks/portal.service.mock';
import { SystemServiceMock } from 'src/app/base/test/mocks/system.service.mock';
import { ErrorTemplateHandlerMock } from 'src/app/base/test/mocks/error-template.mock';

describe('ContactoComponent', () => {
  let component: ContactoComponent;
  let fixture: ComponentFixture<ContactoComponent>;
  let confirmationService: ConfirmationService;
  let systemServiceMock: SystemServiceMock;
  let portalServiceMock: PortalServiceMock;
  let errorTemplateHandlerMock: ErrorTemplateHandlerMock;
  let usuarioServiceMock: UsuarioServiceMock;

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

  const anonimo: Usuario = {
    anonimo: true,
    apellidos: 'apellidos',
    correo_personal: 'anonimo@gmail.com',
    correo_uv: 'anonimo@uv.cl',
    foto: '',
    idioma: 'es',
    nombre_completo: 'anonimo',
    nombres: 'anonimo',
    rut: '22222222-2',
    uid: '22222222',
    adicional: null,
  };

  const translate: any = {
    ayuda: {
      contacto: {
        confirm: 'test',
        titulo: 'titulo',
        success: 'success',
        error: 'error',
      },
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestingBaseModule],
      declarations: [ContactoComponent],
      providers: [
        {
          provide: UsuarioService,
          useValue: new UsuarioServiceMock(online),
        },
        ConfirmationService,
        { provide: PortalService, useClass: PortalServiceMock },
        { provide: SystemService, useClass: SystemServiceMock },
        {
          provide: ErrorTemplateHandler,
          useClass: ErrorTemplateHandlerMock,
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    errorTemplateHandlerMock = TestBed.inject(ErrorTemplateHandler) as any;
    systemServiceMock = TestBed.inject(SystemService) as any;
    usuarioServiceMock = TestBed.inject(UsuarioService) as any;
    portalServiceMock = TestBed.inject(PortalService);
    confirmationService = TestBed.inject(ConfirmationService);

    fixture = TestBed.createComponent(ContactoComponent);
    component = fixture.componentInstance;
  });

  it('[1] Existe', () => {
    expect(component).toBeTruthy();
    expect(component.show).toBeFalse();
    expect(component.usuario).toEqual(online);
    expect(typeof component.form).toBe('undefined');
  });

  it('[2] Muestra formulario contacto: showContacto', () => {
    component.showContacto();
    expect(component.show).toBe(true);
  });

  it('[3] Formulario válido: usuario', () => {
    fixture.detectChanges();
    component.usuario = usuarioServiceMock.getUserOnline();
    var form = component.form;
    form.controls['mensaje'].setValue('este es un mensaje de prueba');
    expect(form.valid).toBeTrue();
  });

  it('[4] Formulario válido: anonimo', () => {
    usuarioServiceMock.getUserOnline = () => anonimo;
    component.usuario = usuarioServiceMock.getUserOnline();
    fixture.detectChanges();
    var form = component.form;
    form.controls['mensaje'].setValue('este es un mensaje de prueba');
    form.controls['rut'].setValue('22222222-2');
    form.controls['correo'].setValue('anonimo@gmail.com');
    form.controls['nombre'].setValue('nombre anonimo');
    expect(form.valid).toBeTrue();
  });

  it('[5] Formulario inválido: usuario', () => {
    usuarioServiceMock.getUserOnline = () => online;
    component.usuario = usuarioServiceMock.getUserOnline();
    fixture.detectChanges();
    var form = component.form;
    expect(form.valid).toBeFalse();
  });

  it('[6] Formulario inválido: anonimo', () => {
    usuarioServiceMock.getUserOnline = () => anonimo;
    component.usuario = usuarioServiceMock.getUserOnline();
    fixture.detectChanges();
    var form = component.form;
    expect(form.valid).toBeFalse();
  });

  it('[7] Enviar correo contacto: sendMail (success)', fakeAsync(async () => {
    fixture.detectChanges();
    spyOn(systemServiceMock, 'translate').and.callFake(() =>
      Promise.resolve(translate),
    );
    spyOn(confirmationService, 'confirm').and.callFake((options) => {
      expect(options.accept).toBeDefined();
      if (options && options.accept) {
        return options.accept();
      }
    });

    spyOn(portalServiceMock, 'sendContactMail').and.returnValue(
      Promise.resolve(of({})),
    );

    await component.sendMail();

    expect(systemServiceMock.translate).toHaveBeenCalledWith([
      'ayuda.contacto.titulo',
      'ayuda.contacto.confirm',
      'ayuda.contacto.success',
      'ayuda.contacto.error',
    ]);
    expect(confirmationService.confirm).toHaveBeenCalled();
    tick();
    expect(portalServiceMock.sendContactMail).toHaveBeenCalled();
  }));

  it('[8] Enviar correo contacto: sendMail (error)', fakeAsync(async () => {
    fixture.detectChanges();
    spyOn(systemServiceMock, 'translate').and.callFake(() =>
      Promise.resolve(translate),
    );
    spyOn(confirmationService, 'confirm').and.callFake((options) => {
      expect(options.accept).toBeDefined();
      if (options && options.accept) {
        return options.accept();
      }
    });

    spyOn(portalServiceMock, 'sendContactMail')
      .and.returnValue(Promise.resolve(of({})))
      .and.throwError('');

    spyOn(errorTemplateHandlerMock, 'processError').and.callFake(() => null);

    await component.sendMail();

    expect(systemServiceMock.translate).toHaveBeenCalledWith([
      'ayuda.contacto.titulo',
      'ayuda.contacto.confirm',
      'ayuda.contacto.success',
      'ayuda.contacto.error',
    ]);
    expect(confirmationService.confirm).toHaveBeenCalled();
    tick();
    expect(portalServiceMock.sendContactMail).toHaveBeenCalled();
    expect(errorTemplateHandlerMock.processError).toHaveBeenCalled();
  }));
});
