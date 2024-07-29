import { Subject } from 'rxjs';
import { Aplicacion } from '../../models/aplicacion';
import { Modulo } from '../../models/modulo';
import { Menu } from '../../models/menu';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { Item } from '../../models/item';
import { Injectable } from '@angular/core';

const aplicacion1: Aplicacion = {
  icono: 'icono1',
  id: 'abc123',
  nombre: 'aplicacion test 1',
  tipo: 'ANGULAR',
};

const aplicacion2: Aplicacion = {
  icono: 'icono2',
  id: 'abc12345',
  nombre: 'aplicacion test 2',
  tipo: 'ANGULAR',
};

const modulo1: Modulo = {
  cod_modulo: '1234',
  descripcion: '',
  estado: 1,
  estilo: '',
  grupo: 'GRUPO',
  icono: 'icono1',
  nombre: 'ANGULAR 1',
  tipo: 'ANGULAR',
};

const modulo2: Modulo = {
  cod_modulo: '5678',
  descripcion: '',
  estado: 1,
  estilo: '',
  grupo: 'GRUPO',
  icono: 'icono2',
  nombre: 'ANGULAR 2',
  tipo: 'ANGULAR',
};

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

const menu_home: Menu = {
  descripcion: 'inicio',
  estado: 1,
  estilo: '',
  grupo: '',
  icono: 'pi pi-home',
  id: 0,
  items: [],
  metodo: '',
  nombre: 'home',
};

@Injectable()
export class PanelControlServiceMock {
  private aplicacionesRx = new Subject<object>();
  aplicaciones$ = this.aplicacionesRx.asObservable();
  private aplicaciones: Aplicacion[] = [];
  private aplicacionActive!: Aplicacion | null;

  private modulosRx = new Subject<object>();
  modulos$ = this.modulosRx.asObservable();
  private modulos: Modulo[] = [];
  private moduloActive!: Modulo | null;

  private menusRx = new Subject<object>();
  menus$ = this.menusRx.asObservable();
  private menus: Menu[] = [menu_home];
  private menuActive: Menu | null = menu_home;
  private menuHome: Menu = menu_home;

  private navigateRx = new Subject<object>();
  navigate$ = this.navigateRx.asObservable();

  private today: any = null;

  constructor() {
    this.aplicaciones = [aplicacion1, aplicacion2];
    this.aplicacionActive = aplicacion1;
    this.modulos = [modulo1, modulo2];
    this.moduloActive = modulo1;
    this.menus = [menu1, menu2];
    this.menuActive = menu2;
    this.menuHome = menu_home;

    var f: Date = new Date();
    var date = f.getUTCDate();
    var month = f.getUTCMonth() + 1;
    var year = f.getFullYear();

    this.today = {
      json: {
        date: (date < 10 ? `0${date}` : date).toString(),
        month: (month < 10 ? `0${month}` : month).toString(),
        year: year.toString(),
      },
      date: f,
    };
  }

  getAplicaciones(
    idProyecto?: string,
  ): Promise<{ aplicaciones: Aplicacion[]; active: Aplicacion | null }> {
    return Promise.resolve({
      aplicaciones: [aplicacion1, aplicacion2],
      active: aplicacion1,
    });
  }

  getModulos(
    codModulo: string,
  ): Promise<{ modulos: Modulo[]; active: Modulo | null }> {
    return Promise.resolve({ modulos: [modulo1, modulo2], active: modulo1 });
  }

  getMenus(codModulo: string): Promise<{ menus: Menu[]; active: Menu | null }> {
    return Promise.resolve({ menus: [menu1, menu2], active: menu2 });
  }

  async navigate(router: Router, menu: Menu, item?: MenuItem): Promise<void> {}

  async homeNavigate(router: Router): Promise<void> {}

  async notActiveModulo(router: Router, path: string): Promise<void> {}

  setBreadcrumb(menu: Menu, item?: MenuItem): MenuItem[] {
    return [];
  }

  getAplicacionesArray(): Aplicacion[] {
    return this.aplicaciones;
  }

  getAplicacionActive(): Aplicacion | null {
    return this.aplicacionActive;
  }

  getModulosArray(): Modulo[] {
    return this.modulos;
  }

  getModuloActive(): Modulo | null {
    return this.moduloActive;
  }

  getMenusArray(): Menu[] {
    return this.menus;
  }

  getMenuActive(): Menu | null {
    return this.menuActive;
  }

  getHomeMenu(): Menu | null {
    return this.menuHome;
  }

  getTodayData(): Promise<Object> {
    var f: Date = new Date();
    var date = f.getUTCDate();
    var month = f.getUTCMonth() + 1;
    var year = f.getFullYear();
    return new Promise((onsuccess) => {
      onsuccess({
        json: {
          date: (date < 10 ? `0${date}` : date).toString(),
          month: (month < 10 ? `0${month}` : month).toString(),
          year: year.toString(),
        },
        date: f,
      });
    });
  }

  getToday(): Object | null {
    return this.today;
  }
}
