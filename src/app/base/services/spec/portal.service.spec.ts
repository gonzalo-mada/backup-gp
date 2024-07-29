import { TestBed } from '@angular/core/testing';
import { PortalService } from '../portal.service';
import { InvokerService } from '../invoker.service';
import { InvokerServiceMock } from '../../test/mocks/invoker.service.mock';
import { WindowServiceMock } from '../../test/mocks/window.service.mock';
import { WindowService } from '../window.service';
import { SystemService } from '../system.service';
import { SystemServiceMock } from '../../test/mocks/system.service.mock';

describe('PortalService (SERVICE)', () => {
  let service: PortalService;
  let invokerServiceMock: InvokerServiceMock;
  let windowServiceMock: WindowServiceMock;
  let systemServiceMock: SystemServiceMock;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PortalService,
        { provide: InvokerService, useClass: InvokerServiceMock },
        { provide: WindowService, useClass: WindowServiceMock },
        { provide: SystemService, useClass: SystemServiceMock },
      ],
    });
    invokerServiceMock = TestBed.inject(InvokerService);
    windowServiceMock = TestBed.inject(WindowService);
    systemServiceMock = TestBed.inject(SystemService) as any;

    service = TestBed.inject(PortalService);
  });

  it('[1] Es creado', () => {
    expect(service).toBeTruthy();
  });

  it('[2] Obtener avisos: getAvisos()', async () => {
    const avisosData = [
      {
        mensaje: 'in<CORTE>titulo<CORTE><div>este es un aviso</div>',
        fecha: '11/04/2024',
      },
    ];
    spyOn(invokerServiceMock, 'httpInvoke').and.callFake(() =>
      Promise.resolve(avisosData),
    );
    spyOn(systemServiceMock, 'getHash').and.callThrough();

    const avisos = await service.getAvisos();
    expect(invokerServiceMock.httpInvoke).toHaveBeenCalledWith(
      'base/getAvisos',
    );
    expect(systemServiceMock.getHash).toHaveBeenCalledWith(4);
    expect(avisos.length).toBeGreaterThanOrEqual(0);
  });

  it('[3] Ir a otro sistema: gotoModule()', async () => {
    const idProyecto = 'proyecto';
    const codModulo = 'modulo';
    const response = {
      url: 'https://sistema.uv.cl',
    };
    spyOn(invokerServiceMock, 'httpInvoke').and.callFake(() =>
      Promise.resolve(response),
    );
    spyOn(windowServiceMock, 'replaceLocation').and.callFake(() => null);

    await service.gotoModule(idProyecto, codModulo);
    expect(invokerServiceMock.httpInvoke).toHaveBeenCalledWith(
      'base/navigate',
      {
        proyecto: idProyecto,
        modulo: codModulo,
        idProyecto: idProyecto,
        codModulo: codModulo,
      },
    );
    expect(windowServiceMock.replaceLocation).toHaveBeenCalledWith(
      response.url,
    );
  });

  it('[4] Ir a otro portal: gotoApp()', async () => {
    const idProyecto = 'proyecto';
    const response = {
      url: 'https://portal.uv.cl',
    };
    spyOn(invokerServiceMock, 'httpInvoke').and.callFake(() =>
      Promise.resolve(response),
    );
    spyOn(windowServiceMock, 'replaceLocation').and.callFake(() => null);

    await service.gotoApp(idProyecto);
    expect(invokerServiceMock.httpInvoke).toHaveBeenCalledWith(
      'base/navigateApp',
      {
        proyecto: idProyecto,
        idProyecto: idProyecto,
      },
    );
    expect(windowServiceMock.replaceLocation).toHaveBeenCalledWith(
      response.url,
    );
  });

  it('[5] Volver al portal por donde ingreso: backToPortal()', async () => {
    const idProyecto = 'proyecto';
    const response = {
      url: 'https://portal.uv.cl',
    };
    spyOn(invokerServiceMock, 'httpInvoke').and.callFake(() =>
      Promise.resolve(response),
    );
    spyOn(windowServiceMock, 'replaceLocation').and.callFake(() => null);

    await service.backToPortal(idProyecto);
    expect(invokerServiceMock.httpInvoke).toHaveBeenCalledWith(
      'base/getAppUrl',
      {
        proyecto: idProyecto,
        idProyecto: idProyecto,
      },
    );
    expect(windowServiceMock.replaceLocation).toHaveBeenCalledWith(
      response.url,
    );
  });

  it('[6] Enviar correo de contacto-soporte: sendContactMail()', async () => {
    const d = {
      mensaje: 'mensaje',
      correouv: 'correo@uv.cl',
      nombre: 'nombre apellido',
      rut: '11111111-1',
      sitename: 'Sistema',
    };

    spyOn(invokerServiceMock, 'httpInvoke').and.callFake(() =>
      Promise.resolve(),
    );

    await service.sendContactMail(
      d.mensaje,
      d.correouv,
      d.nombre,
      d.rut,
      d.sitename,
    );
    expect(invokerServiceMock.httpInvoke).toHaveBeenCalledWith(
      'base/sendMail',
      {
        correoUV: d.correouv,
        subject: `[${d.sitename}]`,
        body: `${d.mensaje}<br/><br/>-------------<br/>Este correo ha sido generado desde:<br/><br/>Sistema: ${d.sitename}`,
        rut: d.rut,
        user: d.nombre,
      },
    );
  });
});
