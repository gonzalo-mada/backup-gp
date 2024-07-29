import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';

import { TemasComponent } from './temas.component';
import { InitService } from 'src/app/base/services/init.service';
import { UsuarioService } from 'src/app/base/services/usuario.service';
import { SystemService } from 'src/app/base/services/system.service';
import { ThemeService } from 'src/app/base/services/theme.service';
import { PrimeNGConfig } from 'primeng/api';
import { TestingBaseModule } from 'src/app/base/modules/testing.module';
import { Usuario } from 'src/app/base/models/usuario';
import { ErrorTemplateHandler } from 'src/app/base/tools/error/error.handler';
import { InitServiceMock } from 'src/app/base/test/mocks/init.service.mock';
import { ThemeServiceMock } from 'src/app/base/test/mocks/theme.service.mock';
import { SystemServiceMock } from 'src/app/base/test/mocks/system.service.mock';
import { UsuarioServiceMock } from 'src/app/base/test/mocks/usuario.service.mock';
import { ErrorTemplateHandlerMock } from 'src/app/base/test/mocks/error-template.mock';
import { WindowService } from 'src/app/base/services/window.service';
import { WindowServiceMock } from 'src/app/base/test/mocks/window.service.mock';

describe('TemasComponent', () => {
  let component: TemasComponent;
  let fixture: ComponentFixture<TemasComponent>;
  let usuarioServiceMock: UsuarioServiceMock;
  let systemServiceMock: SystemServiceMock;
  let errorTemplateHandlerMock: ErrorTemplateHandlerMock;
  let themeServiceMock: ThemeServiceMock;
  let windowServiceMock: WindowServiceMock;

  const userOnline: Usuario = {
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
    system: {
      token: true,
      theme: {
        fontSize: {
          min: 12,
          max: 20,
          default: 16,
        },
        themes: { values: ['light', 'dark'], default: 'light' },
        translate: {
          active: false,
          langs: [
            { lang: 'Español', code: 'es' },
            { lang: 'English', code: 'en' },
          ],
          default: 'es',
        },
      },
    },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingBaseModule],
      declarations: [TemasComponent],
      providers: [
        {
          provide: InitService,
          useValue: new InitServiceMock(config),
        },
        {
          provide: ThemeService,
          useClass: ThemeServiceMock,
        },
        {
          provide: SystemService,
          useClass: SystemServiceMock,
        },
        {
          provide: UsuarioService,
          useValue: new UsuarioServiceMock(userOnline),
        },
        { provide: ErrorTemplateHandler, useClass: ErrorTemplateHandlerMock },
        { provide: WindowService, useClass: WindowServiceMock },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    errorTemplateHandlerMock = TestBed.inject(ErrorTemplateHandler) as any;
    systemServiceMock = TestBed.inject(SystemService) as any;
    usuarioServiceMock = TestBed.inject(UsuarioService) as any;
    themeServiceMock = TestBed.inject(ThemeService) as any;
    windowServiceMock = TestBed.inject(WindowService);

    fixture = TestBed.createComponent(TemasComponent);
    component = fixture.componentInstance;
  });

  it('[1] Existe :: tema light', () => {
    const tema = 'light';
    spyOn(windowServiceMock, 'getItemSessionStorage').and.returnValue(tema);
    spyOn(component as any, 'selectTheme').and.callFake(() => null);
    spyOn(component as any, 'changeFontsize').and.callFake(() => null);

    fixture.detectChanges();

    expect(component).toBeTruthy();
    expect(component.langs.length).toBeGreaterThan(0);
    expect(component.fontSize_position.length).toBeGreaterThan(0);
    expect(component.langSelected.code).toBe('es');
    expect(component.fontSize_min).toBe(12);
    expect(component.fontSize_max).toBe(20);
    expect(component.font).toBe(16);
    expect(component.lang).toBe('es');
    expect(component.cursorSize).toBe('normal');
    expect(component.showTemas).toBeFalse();
    expect(component.selectTheme).toHaveBeenCalledWith(tema);
    expect(component.changeFontsize).toHaveBeenCalledWith(0);
  });

  it('[2] Existe :: tema dark', () => {
    const tema = 'dark';
    spyOn(windowServiceMock, 'getItemSessionStorage').and.returnValue(tema);
    spyOn(component as any, 'selectTheme').and.callFake(() => null);
    spyOn(component as any, 'changeFontsize').and.callFake(() => null);

    fixture.detectChanges();

    expect(component).toBeTruthy();
    expect(component.langs.length).toBeGreaterThan(0);
    expect(component.fontSize_position.length).toBeGreaterThan(0);
    expect(component.langSelected.code).toBe('es');
    expect(component.fontSize_min).toBe(12);
    expect(component.fontSize_max).toBe(20);
    expect(component.font).toBe(16);
    expect(component.lang).toBe('es');
    expect(component.cursorSize).toBe('normal');
    expect(component.showTemas).toBeFalse();
    expect(component.selectTheme).toHaveBeenCalledWith(tema);
    expect(component.changeFontsize).toHaveBeenCalledWith(0);
  });

  it('[3] Cambiar tema: selectTheme() :: light', () => {
    const tema = 'light';
    spyOn(themeServiceMock, 'switchTheme').and.callFake(() => null);
    component.selectTheme(tema);
    expect(themeServiceMock.switchTheme).toHaveBeenCalled();
    expect(component.theme).toBe(tema);
  });

  it('[4] Cambiar tema: selectTheme() :: dark', () => {
    const tema = 'dark';
    spyOn(themeServiceMock, 'switchTheme').and.callFake(() => null);
    component.selectTheme(tema);
    expect(themeServiceMock.switchTheme).toHaveBeenCalled();
    expect(component.theme).toBe(tema);
  });

  it('[5] Cambiar tamaño fuentes: changeFontsize() :: big', () => {
    spyOn(themeServiceMock, 'changeFontsize').and.callFake(() => null);
    component.changeFontsize(1);
    expect(themeServiceMock.changeFontsize).toHaveBeenCalled();
    expect(component.font).toBeGreaterThan(16);
  });

  it('[6] Cambiar tamaño fuentes: changeFontsize() :: small', () => {
    spyOn(themeServiceMock, 'changeFontsize').and.callFake(() => null);
    component.changeFontsize(-1);
    expect(themeServiceMock.changeFontsize).toHaveBeenCalled();
    expect(component.font).toBeLessThan(16);
  });

  it('[7] Seleccionar tamaño fuentes: selectFontsize() :: normal', () => {
    spyOn(themeServiceMock, 'changeFontsize').and.callFake(() => null);
    component.selectFontsize(16);
    expect(themeServiceMock.changeFontsize).toHaveBeenCalled();
    expect(component.font).toBe(16);
  });

  it('[8] Seleccionar tamaño fuentes: selectFontsize() :: big', () => {
    spyOn(themeServiceMock, 'changeFontsize').and.callFake(() => null);
    component.selectFontsize(18);
    expect(themeServiceMock.changeFontsize).toHaveBeenCalled();
    expect(component.font).toBe(18);
  });

  it('[9] Seleccionar tamaño fuentes: selectFontsize() :: small', () => {
    spyOn(themeServiceMock, 'changeFontsize').and.callFake(() => null);
    component.selectFontsize(12);
    expect(themeServiceMock.changeFontsize).toHaveBeenCalled();
    expect(component.font).toBe(12);
  });

  it('[10] Cambiar tamaño cursor: changeCursorSize() :: big', () => {
    const size = 'big';
    spyOn(themeServiceMock, 'changeCursorsize').and.callFake(() => null);
    component.changeCursorSize(size);
    expect(themeServiceMock.changeCursorsize).toHaveBeenCalled();
    expect(component.cursorSize).toBe(size);
  });

  it('[11] Cambiar tamaño cursor: changeCursorSize() :: normal', () => {
    const size = 'normal';
    spyOn(themeServiceMock, 'changeCursorsize').and.callFake(() => null);
    component.changeCursorSize(size);
    expect(themeServiceMock.changeCursorsize).toHaveBeenCalled();
    expect(component.cursorSize).toBe(size);
  });

  it('[12] Cambiar idioma: changeLang() :: success :: sistema con login', fakeAsync(() => {
    spyOn(usuarioServiceMock, 'saveIdioma').and.callFake(() =>
      Promise.resolve(),
    );
    fixture.detectChanges();
    component.changeLang({
      originalEvent: true,
      value: 'es',
    });
    tick();
    expect(usuarioServiceMock.saveIdioma).toHaveBeenCalled();
  }));

  it('[13] Cambiar idioma: changeLang() :: error :: sistema con login', fakeAsync(() => {
    spyOn(usuarioServiceMock, 'saveIdioma').and.returnValue(Promise.reject());
    spyOn(errorTemplateHandlerMock, 'processError').and.callFake(() => null);
    fixture.detectChanges();
    component.changeLang({
      originalEvent: true,
      value: 'es',
    });
    tick();
    expect(usuarioServiceMock.saveIdioma).toHaveBeenCalled();
    expect(errorTemplateHandlerMock.processError).toHaveBeenCalled();
  }));

  it('[14] Cambiar idioma: changeLang() :: sistema sin login', () => {
    spyOn(usuarioServiceMock, 'saveIdioma').and.callFake(() =>
      Promise.resolve(),
    );
    config.system.token = false;

    fixture.detectChanges();

    component.changeLang({
      originalEvent: true,
      value: 'es',
    });

    expect(usuarioServiceMock.saveIdioma).not.toHaveBeenCalled();
  });

  it('[15] Define idioma sitio: setLang()', () => {
    const idioma = { value: 'es', label: 'Español' };

    const primengConfig = TestBed.inject(PrimeNGConfig);
    spyOn(usuarioServiceMock, 'getUserOnline').and.callFake(() => userOnline);
    spyOn(usuarioServiceMock, 'setLang').and.callFake(() => null);
    spyOn(systemServiceMock, 'setTranslation').and.callFake(() => null);

    fixture.detectChanges();
    component['setLang'](idioma.value);

    expect(usuarioServiceMock.getUserOnline).toHaveBeenCalled();
    expect(usuarioServiceMock.setLang).toHaveBeenCalledWith(idioma.value);
    expect(systemServiceMock.setTranslation).toHaveBeenCalledWith(
      idioma.value,
      primengConfig,
    );
    expect(component.langSelected.code).toBe(idioma.value);
  });

  it('[16] Existe :: traducción activada', () => {
    // configuración para activar la traducción
    config.system.theme.translate.active = true;
    component.langActive = true;

    const tema = 'light';
    spyOn(windowServiceMock, 'getItemSessionStorage').and.returnValue(tema);
    spyOn(component as any, 'selectTheme').and.callFake(() => null);
    spyOn(component as any, 'changeFontsize').and.callFake(() => null);
    spyOn(usuarioServiceMock, 'getUserOnline').and.callFake(() => userOnline);

    fixture.detectChanges();

    expect(component).toBeTruthy();
    expect(usuarioServiceMock.getUserOnline).toHaveBeenCalled();
    expect(component.langs.length).toBeGreaterThan(0);
    expect(component.fontSize_position.length).toBeGreaterThan(0);
    expect(component.langSelected.code).toBe('es');
    expect(component.fontSize_min).toBe(12);
    expect(component.fontSize_max).toBe(20);
    expect(component.font).toBe(16);
    expect(component.lang).toBe('es');
    expect(component.cursorSize).toBe('normal');
    expect(component.showTemas).toBeFalse();
    expect(component.selectTheme).toHaveBeenCalledWith(tema);
    expect(component.changeFontsize).toHaveBeenCalledWith(0);
  });
});
