import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { PrimeNGConfig } from 'primeng/api';
import { Title } from '@angular/platform-browser';
import { SystemService } from '../system.service';

describe('SystemService (SERVICE)', () => {
  let service: SystemService;
  let mockTranslateService: Partial<TranslateService>;
  let mockTitleUtils: Partial<Title>;
  let mockPrimeNGConfig: Partial<PrimeNGConfig>;
  let loadingElement: HTMLDivElement;

  beforeEach(() => {
    mockTranslateService = {
      setDefaultLang: jasmine.createSpy('setDefaultLang'),
      use: jasmine.createSpy('use'),
      get: jasmine.createSpy().and.returnValue({
        subscribe: (fn: Function) => fn('Translated text'),
      }),
      currentLang: 'en',
    };

    mockTitleUtils = {
      setTitle: jasmine.createSpy('setTitle'),
    };

    mockPrimeNGConfig = {
      setTranslation: jasmine.createSpy('setTranslation'),
    };

    TestBed.configureTestingModule({
      providers: [
        SystemService,
        { provide: TranslateService, useValue: mockTranslateService },
        { provide: Title, useValue: mockTitleUtils },
        { provide: PrimeNGConfig, useValue: mockPrimeNGConfig },
      ],
    });
    service = TestBed.inject(SystemService);
  });

  it('[1] Es creado', () => {
    expect(service).toBeTruthy();
    expect(service['sitename']).toBe('');
  });

  it('[2] Efecto cargando principal: mainLoading :: activo', () => {
    const loading = true;
    spyOn(service['mainLoadingSubject'], 'next').and.returnValue();
    service.mainLoading(loading);
    expect(service['mainLoadingSubject'].next).toHaveBeenCalledWith({
      loading: loading,
    });
  });

  it('[3] Efecto cargando principal: mainLoading :: activo', () => {
    const loading = false;
    spyOn(service['mainLoadingSubject'], 'next').and.returnValue();
    service.mainLoading(loading);
    expect(service['mainLoadingSubject'].next).toHaveBeenCalledWith({
      loading: loading,
    });
  });

  it('[4] Efecto cargando: loading() :: sin opciones', (done) => {
    const loadingObject = { active: true };
    service.loading$.subscribe((result) => {
      expect(result).toEqual(loadingObject);
      done();
    });
    service.loading(true);
  });

  it('[5] Efecto cargando: loading() :: con opciones', (done) => {
    const loadingObject = { active: true, bgColor: 'color' };
    service.loading$.subscribe((result) => {
      expect(result).toEqual(loadingObject);
      done();
    });
    service.loading(true, { bgColor: 'color' });
  });

  it('[6] Indicar el idioma del sitio: setTranslation()', () => {
    service.setTranslation('es', mockPrimeNGConfig as PrimeNGConfig);
    expect(mockTranslateService.setDefaultLang).toHaveBeenCalledWith('es');
    expect(mockTranslateService.use).toHaveBeenCalledWith('es');
    expect(mockPrimeNGConfig.setTranslation).toHaveBeenCalled();
  });

  it('[7] Traducir: translate()', async () => {
    const result = await service.translate(['key1', 'key2']);
    expect(mockTranslateService.get).toHaveBeenCalledWith(['key1', 'key2'], {});
    expect(result).toBe('Translated text');
  });

  it('[8] Traducir: translate()', async () => {
    const result = await service.translate(['key1', 'key2']);
    expect(mockTranslateService.get).toHaveBeenCalledWith(['key1', 'key2'], {});
    expect(result).toBe('Translated text');
  });

  it('[9] Obtener el idioma actualmente seleccionado: getCurrentLang()', () => {
    const currentLang = service.getCurrentLang();
    expect(currentLang).toBe('en');
  });

  it('[10] Definir el nombre de la pestaña: setTitle() :: con sitio', () => {
    const sitename = 'Universidad de Valparaíso';
    const title = 'Universidades';
    service.setTitle(sitename, title);
    expect(mockTitleUtils.setTitle).toHaveBeenCalledWith(
      `${sitename} - ${title}`,
    );
  });

  it('[11] Definir el nombre de la pestaña: setTitle() :: sin sitio', () => {
    const sitename = 'Universidad de Valparaíso';
    service.setTitle(sitename);
    expect(mockTitleUtils.setTitle).toHaveBeenCalledWith(`${sitename}`);
  });

  it('[12] Obtener el nombre actual del sitio: getSitename()', () => {
    const sitename = 'Universidad de Valparaíso';
    const title = 'Universidades';
    service.setTitle(sitename, title);
    var data = service.getSitename();
    expect(data).toEqual(sitename);
  });

  it('[13] Generar un hashCode aleatorio de tamaño definido: getHash() :: tamaño > 0', () => {
    const hashLength = 8;
    const hash = service.getHash(hashLength);
    expect(hash.length).toBe(hashLength);
    expect(typeof hash).toEqual('string');
    expect(hash).not.toEqual('');
  });

  it('[14] Generar un hashCode aleatorio de tamaño definido: getHash() :: tamaño = 0', () => {
    const hashLength = 0;
    const hash = service.getHash(hashLength);
    expect(hash.length).toBe(hashLength);
    expect(typeof hash).toEqual('string');
    expect(hash).toEqual('');
  });
});
