import { Injectable } from '@angular/core';
import { InvokerService } from './invoker.service';
import { DateUtils } from '../tools/utils/date.utils';
import { Subject } from 'rxjs';
import { InitService } from './init.service';
import { CommonUtils } from '../tools/utils/common.utils';
import { Router } from '@angular/router';
import { Aplicacion } from '../models/aplicacion';
import { Modulo } from '../models/modulo';
import { Menu } from '../models/menu';
import { Item } from '../models/item';
import { SystemService } from './system.service';
import { MenuItem } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class PanelControlService {
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
  private menus: Menu[] = [this.getHomeMenu()];
  private menuActive: Menu | null = this.getHomeMenu();
  private itemActive: Item | undefined;
  private menuHome: Menu = this.getHomeMenu();

  private navigateRx = new Subject<object>();
  navigate$ = this.navigateRx.asObservable();

  private date_utils = new DateUtils();

  private today: any = null;

  constructor(
    private config: InitService,
    private invoker: InvokerService,
    private commonUtils: CommonUtils,
    private systemService: SystemService,
  ) {}

  getAplicaciones(
    idProyecto?: string,
  ): Promise<{ aplicaciones: Aplicacion[]; active: Aplicacion | undefined }> {
    return this.invoker
      .httpInvoke('base/getAplicaciones', {
        id_proyecto: idProyecto,
      })
      .then((apps: any) => {
        var aplicaciones = apps.map((e: any) => {
          var app: Aplicacion = {
            icono: `${this.config.get(
              'system.url.repositorio',
            )}${this.config.get('system.path.aplicaciones')}${e.imagen}`,
            id: e.id,
            nombre: e.nombre,
            tipo: e.tipoApp,
          };
          return app;
        });

        var active = aplicaciones.find((e: Aplicacion) => e.id === idProyecto);
        this.aplicacionActive = active;
        this.aplicaciones = this.commonUtils.mergeDeep(aplicaciones);
        return { aplicaciones: aplicaciones, active: active };
      });
  }

  getModulos(
    codModulo: string,
  ): Promise<{ modulos: Modulo[]; active: Modulo | undefined }> {
    return this.invoker
      .httpInvoke('base/getModulos', {
        codModulo: codModulo,
      })
      .then((modulos: any) => {
        modulos = modulos.filter(
          (e: any) => e.nombre != 'Volver al Portal' && e.nombre != 'inicio',
        );
        var modulos = modulos.map((e: any) => {
          var icono = '';
          switch (e.moduloActivo) {
            case 1: // NORMAL
              icono = `${this.config.get(
                'system.url.repositorio',
              )}${this.config.get('system.path.modulos')}${e.imagen}.png`;
              break;
            case 2: // MANTENCION
              icono = `${this.config.get(
                'system.url.repositorio',
              )}${this.config.get('system.path.modulos')}maintenance.png`;
              break;
            case 3: // DESARROLLO
              icono = `${this.config.get(
                'system.url.repositorio',
              )}${this.config.get('system.path.modulos')}develop.png`;
              break;
          }

          var modulo: Modulo = {
            nombre: e.nombre,
            icono: icono,
            estilo: e.estilo,
            cod_modulo: e.id,
            estado: e.moduloActivo,
            descripcion: e.descripcion || '',
            grupo: (e.grupo && e.grupo != '' ? e.grupo : 'OTROS').toUpperCase(),
            tipo: e.tipoMod,
          };
          return modulo;
        });

        var active = modulos.find((e: Modulo) => e.cod_modulo === codModulo);
        this.moduloActive = active;
        this.modulos = this.commonUtils.mergeDeep(modulos);
        return { modulos: modulos, active: active };
      });
  }

  getMenus(
    codModulo: string,
  ): Promise<{ menus: Menu[]; active: Menu | undefined }> {
    return this.invoker
      .httpInvoke('base/getMenus', {
        codModulo: codModulo,
      })
      .then((menus: any) => {
        menus = menus.filter(
          (e: any) =>
            e.nombre != 'Volver al Portal' &&
            e.nombre != 'inicio' &&
            e.metodo != 'home' &&
            e.metodo != '',
        );
        var menus = menus.map((e: any) => {
          var menu: Menu = {
            estado: e.menuActivo,
            nombre: e.nombre,
            icono: e.iconoBootstrap,
            estilo: e.estilo,
            metodo: e.metodo,
            descripcion: e.descripcion,
            id: e.idMenu,
            grupo: e.grupo,
            items: [],
          };

          menu.items = e.items.map((f: any) => {
            var hash: string = this.systemService.getHash(4);
            var item: Item = {
              icono: f.iconoBootstrap,
              estado: f.itemActivo,
              metodo: f.metodo,
              nombre: f.nombre,
              descripcion: f.descripcion,
              grupo: f.grupo,
              id: hash,
            };
            return item;
          });

          return menu;
        });

        if (this.config.get('system.buttons.home')) {
          menus.unshift(this.getHomeMenu());
        }

        var active = menus.find(
          (e: Menu) =>
            e.metodo === this.config.get('system.buttons.menus.metodo_active'),
        );

        this.menus = this.commonUtils.mergeDeep(menus);
        this.menuActive = active;
        this.menuHome = active;
        return { menus: menus, active: active };
      });
  }

  getAplicacionesArray(): Aplicacion[] {
    return this.commonUtils.mergeDeep(this.aplicaciones);
  }

  getAplicacionActive(): Aplicacion | null {
    return this.aplicacionActive;
  }

  getModulosArray(): Modulo[] {
    return this.commonUtils.mergeDeep(this.modulos);
  }

  getModuloActive(): Modulo | null {
    return this.moduloActive;
  }

  getMenusArray(): Menu[] {
    return this.commonUtils.mergeDeep(this.menus);
  }

  getMenuActive(): Menu | null {
    return this.menuActive;
  }

  getHomeMenu(): Menu {
    var home: Menu = {
      descripcion: 'Volver al inicio',
      estado: 1,
      estilo: '',
      grupo: '',
      icono: this.config.get('system.icons.home'),
      id: 0,
      items: [],
      metodo: '',
      nombre: 'Inicio',
    };
    return home;
  }

  getTodayData(): Promise<Object> {
    return this.invoker
      .httpInvoke('base/getFechaActual')
      .then(({ fechaActualNumber }) => {
        var json = this.date_utils.numberToJson(fechaActualNumber);
        this.today = json;
        var output = { json: json, date: this.date_utils.jsonToDate(json) };
        return output;
      });
  }

  getToday(): Object | null {
    return this.today;
  }

  async navigate(router: Router, menu: Menu, item?: Item): Promise<void> {
    var maintenance = false,
      devop = false;

    if (menu.estado == 2) maintenance = true;
    if (menu.estado == 3) devop = true;

    if (!devop && !maintenance && item != null) {
      if (item.estado == 2) maintenance = true;
      if (item.estado == 3) devop = true;
    }

    var bread = this.setBreadcrumb(menu, item);
    var isNavigate = true;

    if (!devop) {
      if (!maintenance) {
        isNavigate = await router.navigate(
          [`/${menu.metodo}${item != null ? '/' + item.metodo : ''}`],
          {
            state: {
              menu: menu,
              item: item,
            },
          },
        );
      } else {
        isNavigate = await router.navigate([`/maintenance`], {
          state: {
            mode: 'menu',
          },
        });
      }
    } else {
      isNavigate = await router.navigate([`/develop`], {
        state: {
          mode: 'menu',
        },
      });
    }

    this.eventNavigate(isNavigate, bread, menu, item);
  }

  private eventNavigate(
    isNavigate: boolean,
    breadCrumb: any[],
    menu: Menu,
    item?: Item,
  ) {
    if (isNavigate) {
      window.scroll({
        top: 0,
        left: 0,
      });

      var title = menu.nombre;
      if (item) title += ` :: ${item.nombre}`;

      this.menuActive = menu;
      this.itemActive = item;

      this.navigateRx.next({
        menu: menu,
        item: item,
        title: title,
        breadcrumb: breadCrumb,
      });
    }
  }

  async homeNavigate(router: Router): Promise<void> {
    await this.navigate(router, this.menuHome);
  }

  async notActiveModulo(router: Router, path: string): Promise<void> {
    await router.navigate([`/${path}`], {
      state: {
        mode: 'modulo',
      },
    });
  }

  protected setBreadcrumb(menu: any, item?: any): MenuItem[] {
    var breadCrumb: MenuItem[] = [];
    if (menu.metodo != '') {
      breadCrumb.push({ label: menu.nombre });
      if (item) breadCrumb.push({ label: item.nombre });
    }
    return breadCrumb;
  }

  protected getPosition() {
    return { menu: this.menuActive, item: this.itemActive };
  }
}
