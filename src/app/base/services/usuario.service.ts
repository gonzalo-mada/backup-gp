import { Injectable } from '@angular/core';
import { InvokerService } from './invoker.service';
import { Usuario } from '../models/usuario';
import { InitService } from './init.service';
import { WindowService } from './window.service';
import { CommonUtils } from '../tools/utils/common.utils';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private user!: Usuario;

  constructor(
    private config: InitService,
    private invoker: InvokerService,
    private windowService: WindowService,
    private commonUtils: CommonUtils,
  ) {}

  async getSession(uid: string): Promise<void> {
    var session: any = await this.invoker.httpInvoke('base/getKeyUser', {
      idSesion: uid,
    });
    this.windowService.setItemSessionStorage('proyecto', session.proyecto);
    this.windowService.setItemSessionStorage('modulo', session.modulo);
    this.windowService.setItemSessionStorage('token', session.token);
  }

  async getUser(online: boolean): Promise<Usuario> {
    var user!: Usuario;
    if (online) {
      if (this.windowService.getItemSessionStorage('token') != '') {
        var data: any = await this.invoker.httpInvoke('base/getUser');
        user = await this.setUser(data);
      } else {
        throw new Error('NO TOKEN');
      }
    } else {
      user = await this.setUser();
    }
    this.user = user;
    return user;
  }

  private async setUser(u?: any): Promise<Usuario> {
    var sl = this.windowService.getItemSessionStorage('lang');
    var userIdioma = u
      ? u.idioma
      : this.config.get('system.theme.translate.default');

    var lang: any = sl != '' ? sl : userIdioma;
    this.windowService.setItemSessionStorage('lang', lang);

    var foto = u
      ? new URL(
          `${this.config.get('sites.tui_uv.server')}${u.foto}.${this.config.get('sites.tui_uv.format')}`,
        ).toString()
      : new URL(
          `${this.config.get(
            'system.url.repositorio',
          )}/imagenes/iconos_sistemas/user/user_uv.png`,
        ).toString();

    var isFoto = u ? await this.commonUtils.checkImageExists(foto) : true;

    var usuario: Usuario = {
      anonimo: u === null || u === undefined,
      apellidos: u ? u.apellidos : '',
      correo_personal: u ? u.mail : '',
      correo_uv: u ? u.correouv : this.config.get('sites.dtic.support'),
      foto: isFoto ? foto : this.config.get('sites.tui_uv.default'),
      idioma: lang,
      nombre_completo: u ? u.nombreCompleto : this.config.get('sites.uv.name'),
      nombres: u ? u.nombres : this.config.get('sites.uv.name'),
      rut: u ? u.rut : this.config.get('sites.uv.rut'),
      uid: u
        ? u.rut.substring(0, u.rut.length - 2)
        : this.config
            .get('sites.uv.rut')
            .substring(0, this.config.get('sites.uv.rut').length - 2),
      adicional: u && u.hasOwnProperty('adicional') ? u.adicional : null,
    };
    return usuario;
  }

  async saveIdioma(idioma: string): Promise<void> {
    await this.invoker.httpInvoke(
      { service: 'base/saveIdioma', loading: false },
      {
        idioma: idioma,
      },
    );
  }

  getUserOnline(): Usuario {
    return this.user;
  }

  setLang(lang: string): void {
    this.user.idioma = lang;
  }
}
