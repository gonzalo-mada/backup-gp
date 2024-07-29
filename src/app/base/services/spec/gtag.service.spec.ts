import { TestBed } from '@angular/core/testing';
import { ElementRef } from '@angular/core';
import { InitService } from '../init.service';
import { GtagService } from '../gtag.service';
import { environment } from '../../../../environments/environment';
import { InitServiceMock } from '../../test/mocks/init.service.mock';
import { Menu } from '../../models/menu';
import { Item } from '../../models/item';

describe('GtagService (SERVICE)', () => {
  let service: GtagService;

  const analitycs: string = environment.analytics;

  const item: Item = {
    descripcion: 'descripcion',
    estado: 1,
    grupo: 'GRUPO',
    icono: 'pi pi-home',
    id: '2',
    metodo: 'metodo_item',
    nombre: 'item',
  };

  const menu: Menu = {
    descripcion: 'descripcion',
    estado: 1,
    estilo: '',
    grupo: 'GRUPO',
    icono: 'pi pi-home',
    id: 1,
    metodo: 'metodo_menu',
    nombre: 'menu',
    items: [],
  };

  const config = {
    gtag: {
      active: true,
    },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        GtagService,
        { provide: InitService, useValue: new InitServiceMock(config) },
      ],
    });
    service = TestBed.inject(GtagService);
    config.gtag.active = true;
  });

  it('[1] Es creado', () => {
    expect(service).toBeTruthy();
    expect(analitycs).toBeTruthy();
    expect(analitycs).not.toBeNull();
    expect(analitycs).not.toEqual('');
  });

  it('[2] Iniciar GTAG: init() :: activo', () => {
    var elementRef: ElementRef = {
      nativeElement: document.createElement('div'),
    };
    service.init(elementRef);
    var scriptElement = elementRef.nativeElement.querySelector('script');
    expect(scriptElement).toBeTruthy();
    expect(scriptElement.src).toBe(
      `https://www.googletagmanager.com/gtag/js?id=${environment.analytics}`,
    );
  });

  it('[3] Iniciar GTAG: init() :: inactivo', () => {
    var elementRef: ElementRef = {
      nativeElement: document.createElement('div'),
    };
    config.gtag.active = false;
    service.init(elementRef);
    var scriptElement = elementRef.nativeElement.querySelector('script');
    expect(scriptElement).toBeFalsy();
  });

  it('[4] Correr analitycs al momento de ingresar en una vista: set() :: activo :: menu + item', () => {
    var elementRef: ElementRef = {
      nativeElement: document.createElement('div'),
    };
    service.set(elementRef, menu, item);

    var scriptElement = elementRef.nativeElement.querySelector('script');
    expect(scriptElement).toBeTruthy();
    expect(scriptElement.id).toBe('g_analytics');

    const expectedCode = `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${analitycs}', {
                    page_title: '${menu.nombre} > ${item.nombre}', 
                    page_path: '/${menu.metodo}/${item.metodo}'}
                );
            `;
    expect(scriptElement.textContent.trim()).toBe(expectedCode.trim());
  });

  it('[5] Correr analitycs al momento de ingresar en una vista: set() :: activo :: menu', () => {
    var elementRef: ElementRef = {
      nativeElement: document.createElement('div'),
    };
    service.set(elementRef, menu);

    var scriptElement = elementRef.nativeElement.querySelector('script');
    expect(scriptElement).toBeTruthy();
    expect(scriptElement.id).toBe('g_analytics');

    const expectedCode = `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${analitycs}', {
                    page_title: '${menu.nombre}', 
                    page_path: '/${menu.metodo}'}
                );
            `;
    expect(scriptElement.textContent.trim()).toBe(expectedCode.trim());
  });

  it('[6] Correr analitycs al momento de ingresar en una vista: set() :: inactivo', () => {
    var elementRef: ElementRef = {
      nativeElement: document.createElement('div'),
    };
    config.gtag.active = false;
    service.set(elementRef, menu);
    var scriptElement = elementRef.nativeElement.querySelector('script');
    expect(scriptElement).toBeFalsy();
  });
});
