import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { Item } from 'src/app/base/models/item';
import { Menu } from 'src/app/base/models/menu';
import { InitService } from 'src/app/base/services/init.service';
import { PanelControlService } from 'src/app/base/services/panel_control.service';
import { SystemService } from 'src/app/base/services/system.service';
import { ThemeService } from 'src/app/base/services/theme.service';
import { WindowService } from 'src/app/base/services/window.service';
import { ErrorTemplateHandler } from 'src/app/base/tools/error/error.handler';

@Component({
  selector: 'app-menus',
  templateUrl: './menus.component.html',
  styleUrls: ['./menus.component.css'],
})
export class MenusComponent {
  constructor(
    private config: InitService,
    private panelControlService: PanelControlService,
    private errorTemplateHandler: ErrorTemplateHandler,
    private systemService: SystemService,
    private router: Router,
    private themeService: ThemeService,
    private windowService: WindowService,
  ) {}

  theme: string = this.config.get('system.theme.themes.default');
  showMenus: boolean = false;
  menus: MenuItem[] = [];
  menuActive!: Menu | undefined;
  itemActive!: Item | undefined;

  ngOnInit(): void {
    this.getMenus();
    this.panelControlService.navigate$.subscribe((e: any) => {
      this.positionating(e.menu, e.item);
    });
    this.themeService.theme$.subscribe((e: any) => {
      this.theme = e.theme;
    });
  }

  getMenus(): void {
    if (this.config.get('system.data.menus')) {
      this.panelControlService
        .getMenus(this.windowService.getItemSessionStorage('modulo'))
        .then((res) => {
          this.menus = this.setMenusPanelMenu(res.menus);
          this.menuActive = res.active;
          this.panelControlService['menusRx'].next(res);
        })
        .catch(async (e) => {
          var t: any = await this.systemService.translate(['menus.error_get']);
          this.errorTemplateHandler.processError(e, {
            notifyMethod: 'page',
            message: t['menus.error_get'],
          });
        });
    } else {
      this.panelControlService['menusRx'].next({
        menus: this.menus,
        active: this.menuActive,
      });
    }
  }

  private setMenusPanelMenu(menus: Menu[]): MenuItem[] {
    var panelMenu: MenuItem[] = menus.map((e: Menu) => {
      var mi: MenuItem | null = {
        label: `<i class='${e.icono} mr-2'></i> ${e.nombre}`,
        escape: false,
        command: async () => {
          if (e.items.length === 0) {
            await this.navigate(e);
          }
        },
        title: e.descripcion,
        id: `m-${e.id}`,
        styleClass: e.id === this.menuActive?.id ? 'active' : '',
        items: [],
      };
      if (e.items.length > 0) {
        mi.items = e.items.map((f: Item) => {
          var ii: MenuItem = {
            label: f.nombre,
            title: f.descripcion,
            id: `i-${f.id}`,
            command: async () => {
              await this.navigate(e, f);
            },
            styleClass: '',
          };
          return ii;
        });
      }
      return mi;
    });
    return panelMenu;
  }

  private async navigate(menu: Menu, item?: Item): Promise<void> {
    await this.panelControlService.navigate(this.router, menu, item);
    this.showMenus = false;
  }

  private positionating(menu: Menu, item?: Item) {
    this.menus.map((e: MenuItem) => {
      e.styleClass = '';
      if (e.id === `m-${menu.id}`) e.styleClass = 'active';
      if (e.items) {
        e.items.map((f: MenuItem) => {
          f.styleClass = '';
          if (item && f.id === `i-${item.id}`) f.styleClass = 'active';
        });
      }
    });
    this.menus = [...this.menus];
  }
}
