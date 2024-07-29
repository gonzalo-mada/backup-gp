import { TestBed } from '@angular/core/testing';
import { DOCUMENT } from '@angular/common';
import { ThemeService } from '../theme.service';

describe('ThemeService (SERVICE)', () => {
  let service: ThemeService;
  let mockDocument: Partial<Document>;

  beforeEach(() => {
    mockDocument = {
      getElementById: jasmine
        .createSpy('getElementById')
        .and.callFake((id: string) => {
          return document.createElement('link');
        }),
      documentElement: document.createElement('html'),
      querySelectorAll: jasmine
        .createSpy('querySelectorAll')
        .and.returnValue([]),
    };

    TestBed.configureTestingModule({
      providers: [ThemeService, { provide: DOCUMENT, useValue: mockDocument }],
    });
    service = TestBed.inject(ThemeService);
  });

  it('[1] Es creado', () => {
    expect(service).toBeTruthy();
    expect(service['theme']).toEqual('');
  });

  it('[2] Emitir un evento al seleccionar un tema: switchTheme()', () => {
    const theme = 'dark';
    const spyThemeRxNext = spyOn(service['themeRx'], 'next');
    service.switchTheme(theme);
    expect(mockDocument.getElementById).toHaveBeenCalledTimes(4);
    expect(spyThemeRxNext).toHaveBeenCalledWith({ theme: theme });
  });

  it('[3] Cambiar el tamaño de fuente: changeFontsize()', () => {
    const fontSize = 16;
    service.changeFontsize(fontSize);
    expect(mockDocument.documentElement?.style.fontSize).toBe(`${fontSize}px`);
  });

  it('[4] Cambiar el tamaño del cursor: changeCursorsize()', () => {
    service.changeCursorsize('normal');
    expect(
      mockDocument.documentElement?.classList.contains('bigCursor'),
    ).toBeFalse();

    service.changeCursorsize('big');
    expect(
      mockDocument.documentElement?.classList.contains('bigCursor'),
    ).toBeTrue();
  });

  it('[5] Obtener el tema actualmente seleccionado: getTheme()', () => {
    const theme = 'light';
    service.switchTheme(theme);

    const currentTheme = service.getTheme();
    expect(currentTheme).toBe(theme);
  });
});
