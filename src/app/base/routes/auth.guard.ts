import { inject } from '@angular/core';
import {
  CanActivateFn,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { Item } from '../models/item';
import { PanelControlService } from '../services/panel_control.service';
import { SystemService } from '../services/system.service';
import { Menu } from '../models/menu';

export const AuthGuard: CanActivateFn = async (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
) => {
  var match = inject(PanelControlService)
    .getMenusArray()
    .find((e: Menu) => {
      var output;
      var contextpath: string = route.url.toString();
      if (e.metodo === contextpath) output = e;
      if (e.items.length > 0) {
        var subfind = e.items.find(
          (f: Item) => `${e.metodo},${f.metodo}` === contextpath,
        );
        output = subfind;
      }
      return output;
    });

  if (match) return true;
  else {
    var t: any = await inject(SystemService).translate([`authGuard`]);
    alert(t[`authGuard`]);
    return false;
  }
};
