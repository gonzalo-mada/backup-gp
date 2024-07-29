import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { MenusComponent } from './menus.component';
import { PanelControlService } from 'src/app/base/services/panel_control.service';
import { ThemeService } from 'src/app/base/services/theme.service';
import { SystemService } from 'src/app/base/services/system.service';
import { ErrorTemplateHandler } from 'src/app/base/tools/error/error.handler';
import { Item } from 'src/app/base/models/item';
import { Menu } from 'src/app/base/models/menu';
import { TestingBaseModule } from 'src/app/base/modules/testing.module';
import { InitService } from 'src/app/base/services/init.service';
import { MenuItem } from 'primeng/api';
import { WindowService } from 'src/app/base/services/window.service';
import { ErrorTemplateHandlerMock } from 'src/app/base/test/mocks/error-template.mock';
import { InitServiceMock } from 'src/app/base/test/mocks/init.service.mock';
import { PanelControlServiceMock } from 'src/app/base/test/mocks/panel_control.service.mock';
import { SystemServiceMock } from 'src/app/base/test/mocks/system.service.mock';
import { ThemeServiceMock } from 'src/app/base/test/mocks/theme.service.mock';
import { WindowServiceMock } from 'src/app/base/test/mocks/window.service.mock';

describe('MenusComponent', () => {
  let component: MenusComponent;
  let fixture: ComponentFixture<MenusComponent>;
  let themeServiceMock: ThemeServiceMock;
  let panelControlServiceMock: PanelControlServiceMock;
  let windowServiceMock: WindowServiceMock;
  let systemServiceMock: SystemServiceMock;
  let errorTemplateHandlerMock: ErrorTemplateHandlerMock;

  const item: Item = {
    descripcion: 'descripcion',
    estado: 1,
    grupo: 'GRUPO',
    icono: 'pi pi-home',
    id: '2',
    metodo: 'metodo2',
    nombre: 'item1',
  };

  const menu: Menu = {
    descripcion: 'descripcion',
    estado: 1,
    estilo: '',
    grupo: 'GRUPO',
    icono: 'pi pi-home',
    id: 1,
    metodo: 'metodo1',
    nombre: 'menu1',
    items: [item],
  };

  const menu_activo: Menu = {
    descripcion: 'descripcion',
    estado: 1,
    estilo: '',
    grupo: 'GRUPO',
    icono: 'pi pi-home',
    id: 3,
    items: [],
    metodo: 'metodo3',
    nombre: 'menu2',
  };

  const config = {
    system: {
      data: {
        menus: true,
      },
      breadcrumb: true,
      icons: {
        home: 'pi pi-home',
      },
      theme: {
        themes: {
          default: 'light',
        },
      },
    },
  };

  const translate: any = {
    menus: { error_get: '' },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestingBaseModule],
      declarations: [MenusComponent],
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
          provide: PanelControlService,
          useClass: PanelControlServiceMock,
        },
        {
          provide: SystemService,
          useClass: SystemServiceMock,
        },
        {
          provide: ErrorTemplateHandler,
          useClass: ErrorTemplateHandlerMock,
        },
        { provide: WindowService, useClass: WindowServiceMock },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    themeServiceMock = TestBed.inject(ThemeService) as any;
    panelControlServiceMock = TestBed.inject(PanelControlService) as any;
    windowServiceMock = TestBed.inject(WindowService);
    systemServiceMock = TestBed.inject(SystemService) as any;
    errorTemplateHandlerMock = TestBed.inject(ErrorTemplateHandler) as any;

    config.system.data.menus = true;

    fixture = TestBed.createComponent(MenusComponent);
    component = fixture.componentInstance;
  });

  it('[1] Existe', () => {
    spyOn(component as any, 'getMenus').and.callFake(() => null);
    fixture.detectChanges();
    expect(component).toBeTruthy();
    expect(component.getMenus).toHaveBeenCalled();
    expect(component.theme).toBe('light');
    expect(component.showMenus).toBeFalse();
  });

  it('[2] Evento: theme', () => {
    fixture.detectChanges();
    themeServiceMock['themeRx'].next({ theme: 'light' });
    expect(component.theme).toBe('light');
  });

  it('[3] Evento: navigate', () => {
    spyOn(component as any, 'positionating').and.callFake(() => null);
    fixture.detectChanges();
    panelControlServiceMock['navigateRx'].next({ menu: menu, item: item });
    expect(component['positionating']).toHaveBeenCalledWith(menu, item);
  });

  it('[4] Obtener menus: getMenus() :: success :: activo', fakeAsync(() => {
    const menus: Menu[] = [menu, menu_activo];
    spyOn(panelControlServiceMock, 'getMenus').and.callThrough();
    spyOn(windowServiceMock, 'getItemSessionStorage').and.returnValue('mod123');
    spyOn(component as any, 'setMenusPanelMenu').and.callFake(() => menus);
    spyOn(panelControlServiceMock['menusRx'], 'next').and.callThrough();

    component.getMenus();
    tick();

    expect(panelControlServiceMock.getMenus).toHaveBeenCalled();
    expect(windowServiceMock.getItemSessionStorage).toHaveBeenCalledWith(
      'modulo',
    );
    expect(component.menuActive).not.toBeFalsy();
    expect(component.menuActive?.id).toBe(3);
    expect(component['setMenusPanelMenu']).toHaveBeenCalledWith(menus);
    expect(panelControlServiceMock['menusRx'].next).toHaveBeenCalledWith({
      menus: menus,
      active: menu_activo,
    });
    expect(component.menus.length).toBeGreaterThanOrEqual(0);
  }));

  it('[5] Obtener menus: getMenus() :: error :: activo', fakeAsync(() => {
    spyOn(systemServiceMock, 'translate').and.callFake(() =>
      Promise.resolve(translate),
    );
    spyOn(panelControlServiceMock, 'getMenus').and.returnValue(
      Promise.reject(),
    );
    spyOn(errorTemplateHandlerMock, 'processError').and.callFake(() => null);

    component.getMenus();
    tick();

    expect(panelControlServiceMock.getMenus).toHaveBeenCalled();
    expect(errorTemplateHandlerMock.processError).toHaveBeenCalled();
    expect(systemServiceMock.translate).toHaveBeenCalledWith([
      'menus.error_get',
    ]);
    expect(component.menus.length).toBe(0);
  }));

  it('[6] Obtener menus: getMenus() :: inactivo', fakeAsync(() => {
    config.system.data.menus = false;

    spyOn(panelControlServiceMock['menusRx'], 'next').and.callThrough();

    component.getMenus();
    tick();

    expect(component.menuActive).toBeFalsy();
    expect(panelControlServiceMock['menusRx'].next).toHaveBeenCalledWith({
      menus: [],
      active: undefined,
    });
    expect(component.menus.length).toBe(0);
  }));

  it('[7] Procesar menus: setMenusPanelMenu() :: menu activo', () => {
    component.menuActive = menu_activo;
    spyOn(component as any, 'setMenusPanelMenu').and.callThrough();
    var data = component['setMenusPanelMenu']([menu_activo, menu]);
    expect(component['setMenusPanelMenu']).toHaveBeenCalledWith([
      menu_activo,
      menu,
    ]);
    expect(data.length).toBeGreaterThan(0);
  });

  it('[8] Procesar menus: setMenusPanelMenu() :: no menu activo', () => {
    component.menuActive = undefined;
    spyOn(component as any, 'setMenusPanelMenu').and.callThrough();
    var data = component['setMenusPanelMenu']([menu_activo, menu]);
    expect(component['setMenusPanelMenu']).toHaveBeenCalledWith([
      menu_activo,
      menu,
    ]);
    expect(data.length).toBeGreaterThan(0);
  });

  it('[9] Navegación: navigate() :: menu', fakeAsync(() => {
    spyOn(panelControlServiceMock, 'navigate').and.callFake(() =>
      Promise.resolve(),
    );

    fixture.detectChanges();
    tick();

    if (component.menus[1].command) {
      component.menus[1].command({});
      expect(panelControlServiceMock.navigate).toHaveBeenCalled();
      expect(component.showMenus).toBeFalse();
    }
  }));

  it('[10] Navegación: navigate() :: item', fakeAsync(() => {
    spyOn(panelControlServiceMock, 'navigate').and.callFake(() =>
      Promise.resolve(),
    );

    fixture.detectChanges();
    tick();

    if (component.menus[0]) {
      var items: MenuItem[] = component.menus[0].items || [];
      if (items[0].command) {
        items[0].command({});
        expect(panelControlServiceMock.navigate).toHaveBeenCalled();
        expect(component.showMenus).toBeFalse();
      }
    }
  }));

  it('[11] Posicionamiento: positionating() :: menu', () => {
    component.menus = component['setMenusPanelMenu']([menu_activo]);
    component['positionating'](menu_activo);
    expect(component.menus[0].styleClass).toBe('active');
  });

  it('[12] Posicionamiento: positionating() :: item', () => {
    component.menus = component['setMenusPanelMenu']([menu]);
    component['positionating'](menu, item);
    expect(component.menus[0].styleClass).toBe('active');
    var items: MenuItem[] = component.menus[0].items || [];
    expect(items[0].styleClass).toBe('active');
  });
});
