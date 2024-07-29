import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeMenuButtonsComponent } from './home-menu-buttons.component';
import {
  CUSTOM_ELEMENTS_SCHEMA,
  DebugElement,
  NO_ERRORS_SCHEMA,
} from '@angular/core';
import { By } from '@angular/platform-browser';
import { PanelControlServiceMock } from 'src/app/base/test/mocks/panel_control.service.mock';
import { CommonUtilsMock } from 'src/app/base/test/mocks/common.utils.mock';
import { Item } from 'src/app/base/models/item';
import { Menu } from 'src/app/base/models/menu';
import { TestingBaseModule } from 'src/app/base/modules/testing.module';
import { PanelControlService } from 'src/app/base/services/panel_control.service';
import { CommonUtils } from 'src/app/base/tools/utils/common.utils';

describe('HomeMenuButtonsComponent', () => {
  let component: HomeMenuButtonsComponent;
  let fixture: ComponentFixture<HomeMenuButtonsComponent>;
  let panelControlServiceMock: PanelControlServiceMock;
  let commonUtilsMock: CommonUtilsMock;

  const item: Item = {
    descripcion: 'descripcion',
    estado: 1,
    grupo: 'GRUPO',
    icono: 'pi pi-home',
    id: '2',
    metodo: 'metodo2',
    nombre: 'item1',
  };

  const menu1: Menu = {
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

  const menu2: Menu = {
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

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingBaseModule],
      declarations: [HomeMenuButtonsComponent],
      providers: [
        { provide: PanelControlService, useClass: PanelControlServiceMock },
        { provide: CommonUtils, useClass: CommonUtilsMock },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    panelControlServiceMock = TestBed.inject(PanelControlService) as any;
    commonUtilsMock = TestBed.inject(CommonUtils);

    fixture = TestBed.createComponent(HomeMenuButtonsComponent);
    component = fixture.componentInstance;
  });

  it('[1] Existe', () => {
    spyOn(component as any, 'setMenus').and.callFake(() => null);
    fixture.detectChanges();
    expect(component).toBeTruthy();
    expect(component.setMenus).toHaveBeenCalled();
    expect(component.show).toBeFalse();
    expect(component.filter).toBe('');
    expect(component.menus.length).toBeGreaterThanOrEqual(0);
  });

  it('[2] Evento: menus', () => {
    spyOn(component as any, 'setMenus').and.callFake(() => null);
    fixture.detectChanges();
    panelControlServiceMock['menusRx'].next({ menus: [menu1, menu2] });
    expect(component.setMenus).toHaveBeenCalled();
    expect(component.menus.length).toBeGreaterThanOrEqual(0);
  });

  it('[3] Desplega items: showItems()', () => {
    fixture.detectChanges();
    var buttons: DebugElement[] = fixture.debugElement.queryAll(
      By.css('.menu-button'),
    );
    var find = buttons.find((e: DebugElement) =>
      e.attributes['class']?.includes('menu-item'),
    );
    expect(find).not.toBeUndefined();
    find?.nativeElement.click();
    expect(component.items.length).toBeGreaterThan(0);
  });

  it('[4] Navega menu: goToMenu(menu)', () => {
    fixture.detectChanges();
    spyOn(panelControlServiceMock, 'navigate').and.callFake(() =>
      Promise.resolve(),
    );
    var buttons: DebugElement[] = fixture.debugElement.queryAll(
      By.css('.menu-button'),
    );
    var find = buttons.find((e: DebugElement) =>
      e.attributes['class']?.includes('menu-menu'),
    );
    expect(find).not.toBeUndefined();
    find?.nativeElement.click();
    expect(panelControlServiceMock.navigate).toHaveBeenCalled();
  });

  it('[5] Navega item: goToMenu(menu, item)', () => {
    fixture.detectChanges();
    spyOn(panelControlServiceMock, 'navigate').and.callFake(() =>
      Promise.resolve(),
    );
    var buttons: DebugElement[] = fixture.debugElement.queryAll(
      By.css('.menu-button'),
    );
    var find = buttons.find((e: DebugElement) =>
      e.attributes['class']?.includes('menu-item'),
    );
    expect(find).not.toBeUndefined();
    find?.nativeElement.click();
    expect(component.items.length).toBeGreaterThan(0);
    if (component.items[0].command) {
      component.items[0].command({});
    }
    expect(panelControlServiceMock.navigate).toHaveBeenCalled();
  });

  it('[6] Filtrar menus: filtering() :: success', () => {
    fixture.detectChanges();
    spyOn(commonUtilsMock, 'filtering').and.callFake(() => [menu1]);
    component.filtering();
    expect(commonUtilsMock.filtering).toHaveBeenCalled();
    expect(component.inview.length).toBeGreaterThan(0);
  });

  it('[7] Filtrar menus: filtering() :: no data', () => {
    fixture.detectChanges();
    spyOn(commonUtilsMock, 'filtering').and.callFake(() => []);
    component.filtering();
    expect(commonUtilsMock.filtering).toHaveBeenCalled();
    expect(component.inview.length).toBe(0);
  });
});
