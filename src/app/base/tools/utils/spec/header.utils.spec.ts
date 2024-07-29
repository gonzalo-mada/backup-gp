import { TestBed } from '@angular/core/testing';
import { HeaderUtils } from '../header.utils';
import { of } from 'rxjs';
import { InitService } from '../../../services/init.service';
import { SystemService } from '../../../services/system.service';
import { MenuItem } from 'primeng/api';
import { WindowService } from '../../../services/window.service';

describe('HeaderUtils (UTILS)', () => {
  let service: HeaderUtils;

  const config = {
    mail_domains: {
      pregrado: 'http://correo.alumnos.uv.cl/',
      postgrado: 'http://correo.postgrado.uv.cl/',
      funcionario: 'http://correo.uv.cl/',
    },
    system: {
      url: {
        cambiaclave: 'https://cambiaclave.uv.cl',
      },
      buttons: {
        ayuda: {
          active: true,
          children: {
            contacto: true,
            simbologia: true,
            manual: false,
          },
        },
        usuario: {
          active: true,
          children: {
            profile: true,
            correo: true,
            cambiaclave: true,
            logout: true,
          },
        },
      },
      mail: 'funcionario', // pregrado, postgrado, funcionario
    },
  };

  const initServiceMock = {
    get: (propPath?: string) => {
      if (propPath) {
        let props = propPath.split('.');
        let obj = JSON.parse(JSON.stringify(config));
        for (var i = 0; i < props.length; i++) {
          if (typeof obj[props[i]] == 'undefined') return undefined;
          obj = obj[props[i]];
        }
        return obj;
      } else return config;
    },
  };

  const systemServiceMock = {
    translate$: of({}),
    translate: (flags: string[], values?: any) => Promise.resolve(),
  };

  const windowServiceMock = {
    openUrl: (url?: string | URL, target?: string, features?: string) => null,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: InitService, useValue: initServiceMock },
        { provide: SystemService, useValue: systemServiceMock },
        { provide: WindowService, useValue: windowServiceMock },
      ],
    });
    service = TestBed.inject(HeaderUtils);
  });

  it('[1] Es creado', () => {
    expect(service).toBeTruthy();
  });

  it('[2] Obtener botones display "ayuda": getAyudaButtons()', async () => {
    const t = {
      ayuda: {
        titulo: '',
        contacto: { titulo: '' },
        simbologia: { titulo: '' },
        manual: { titulo: '' },
      },
    } as any;
    spyOn(systemServiceMock, 'translate').and.callFake(() => {
      return Promise.resolve(t);
    });

    var buttons = await service.getAyudaButtons(
      jasmine.createSpyObj('ContactoComponent', ['showContacto']),
      jasmine.createSpyObj('SimbologiaComponent', ['showSimbologia']),
    );

    expect(systemServiceMock.translate).toHaveBeenCalledWith([
      'ayuda.titulo',
      'ayuda.contacto.titulo',
      'ayuda.simbologia.titulo',
      'ayuda.manual.titulo',
    ]);

    expect(buttons.length).toBeGreaterThanOrEqual(0);
  });

  it('[3] Obtener botones display "mi cuenta": getMiCuentaButtons()', async () => {
    const t = {
      mi_cuenta: {
        titulo: '',
        correo: { titulo: '' },
        cambiaclave: { titulo: '' },
      },
    } as any;
    spyOn(systemServiceMock, 'translate').and.callFake(() => {
      return Promise.resolve(t);
    });

    var buttons = await service.getMiCuentaButtons();

    expect(systemServiceMock.translate).toHaveBeenCalledWith([
      'mi_cuenta.correo.titulo',
      'mi_cuenta.cambiaclave.titulo',
    ]);
    expect(buttons.length).toBeGreaterThanOrEqual(0);
  });

  it('[4] Botones display "ayuda"', async () => {
    const t = {
      ayuda: {
        titulo: '',
        contacto: { titulo: '' },
        simbologia: { titulo: '' },
        manual: { titulo: '' },
      },
    } as any;
    spyOn(systemServiceMock, 'translate').and.callFake(() => {
      return Promise.resolve(t);
    });
    var buttons = await service.getAyudaButtons(
      jasmine.createSpyObj('ContactoComponent', ['showContacto']),
      jasmine.createSpyObj('SimbologiaComponent', ['showSimbologia']),
    );

    expect(systemServiceMock.translate).toHaveBeenCalled();
    buttons.map((e: MenuItem) => {
      if (e.command) {
        e.command({});
      }
    });
  });

  it('[5] Botones display "mi cuenta"', async () => {
    const t = {
      mi_cuenta: {
        titulo: '',
        correo: { titulo: '' },
        cambiaclave: { titulo: '' },
      },
    } as any;
    spyOn(systemServiceMock, 'translate').and.callFake(() => {
      return Promise.resolve(t);
    });

    var buttons = await service.getMiCuentaButtons();

    expect(systemServiceMock.translate).toHaveBeenCalled();
    buttons.map((e: MenuItem) => {
      if (e.command) {
        e.command({});
      }
    });
  });
});
