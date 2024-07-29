import { ElementRef, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { InitService } from './init.service';
import { Item } from '../models/item';
import { Menu } from '../models/menu';

@Injectable({
  providedIn: 'root',
})
export class GtagService {
  constructor(private config: InitService) {}

  init(elementRef: ElementRef): void {
    if (this.config.get('gtag.active')) {
      var s = document.createElement('script');
      s.type = 'text/javascript';
      s.async = true;
      s.src = `https://www.googletagmanager.com/gtag/js?id=${environment.analytics}`;
      elementRef.nativeElement.appendChild(s);
    }
  }

  set(elementRef: ElementRef, menu: Menu, item?: Item): void {
    if (this.config.get('gtag.active')) {
      document.getElementById('g_analytics')?.remove();
      var s = document.createElement('script');
      s.id = 'g_analytics';
      s.type = 'text/javascript';

      var title = menu.nombre;
      var path = `/${menu.metodo}`;

      if (item) {
        title += ` > ${item.nombre}`;
        path += `/${item.metodo}`;
      }

      var code = `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${environment.analytics}', {
                    page_title: '${title}', 
                    page_path: '${path}'}
                );
            `;

      s.append(code);
      elementRef.nativeElement.appendChild(s);
    }
  }
}
