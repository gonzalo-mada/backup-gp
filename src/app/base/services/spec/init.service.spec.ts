import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { InitService } from '../init.service';
import { base_config } from '../../configs/main';
import { project_config } from '../../../project/configs/main';

declare var $: any;

describe('InitService', () => {
  let service: InitService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InitService],
    });
    service = TestBed.inject(InitService);
  });

  it('[1] Es creado', () => {
    expect(service).toBeTruthy();
  });

  it('[2] Cargar/Merge datos: load()', fakeAsync(() => {
    service.load().then((result) => {
      expect(result).toEqual($.extend(true, {}, base_config, project_config));
    });
    tick();
  }));

  it('[4] Obtener una propiedad: get()', () => {
    const propPath = 'system.token';
    const expectedValue = true;

    service['config'] = {
      system: {
        token: expectedValue,
      },
    };

    const result = service.get(propPath);
    expect(result).toEqual(expectedValue);
  });

  it('[5] Obtener todas las propiedades: get()', () => {
    const fullConfig = { ...base_config, ...project_config };
    service['config'] = fullConfig;

    const result = service.get();
    expect(result).toEqual(fullConfig);
  });

  it('[6] Obtener una propiedad inexistente: get()', () => {
    const propPath = 'system.hola';
    const result = service.get(propPath);
    expect(result).toBeUndefined();
  });
});
