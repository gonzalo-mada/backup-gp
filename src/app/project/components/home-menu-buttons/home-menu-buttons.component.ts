import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { Item } from 'src/app/base/models/item';
import { PanelControlService } from 'src/app/base/services/panel_control.service';
import { CommonUtils } from 'src/app/base/tools/utils/common.utils';
import { Menu } from 'src/app/base/models/menu';
import { Menu as MenuPrime } from 'primeng/menu';

@Component({
  selector: 'app-home-menu-buttons',
  templateUrl: './home-menu-buttons.component.html',
  styleUrls: ['./home-menu-buttons.component.css'],
})
export class HomeMenuButtonsComponent {
  constructor(
    private panelControlService: PanelControlService,
    private router: Router,
    private commonUtils: CommonUtils,
  ) {}

  menus: Menu[] = [];
  items: any[] = [];
  inview: any[] = [];
  filter: string = '';
  show: boolean = false;
  menusRx!: Subscription;

  ngOnInit() {
    this.setMenus(this.panelControlService.getMenusArray());
    this.menusRx = this.panelControlService.menus$.subscribe((e: any) => {
      this.setMenus(e.menus);
    });
  }

  filtering() {
    this.inview = this.commonUtils.filtering(this.menus, this.filter, 'nombre');
  }

  setMenus(menus: Menu[]) {
    this.menus = menus.filter((e: Menu) => e.metodo != '');
    this.inview = this.menus.map((e: Menu) => {
      var items: any = [];
      if (e.items.length > 0) {
        items = e.items.map((f: Item) => {
          return {
            label: f.nombre,
            title: f.descripcion,
            icon: f.icono,
            command: () => {
              this.goToMenu(e, f);
            },
          };
        });
      }
      var m: Menu = {
        id: e.id,
        nombre: e.nombre,
        icono: e.icono,
        descripcion: e.descripcion,
        estilo: e.estilo,
        items: items,
        grupo: e.grupo,
        estado: e.estado,
        metodo: e.metodo,
      };

      return m;
    });
  }

  showItems(items: Item[], itemsMenu: MenuPrime, event: any) {
    this.items = items;
    itemsMenu.show(event);
  }

  goToMenu(menu: Menu, item?: Item) {
    this.panelControlService.navigate(this.router, menu, item);
  }

  ngOnDestroy() {
    if (this.menusRx) this.menusRx.unsubscribe();
  }
}
