import { Injectable } from '@angular/core';
import { Usuario } from '../../models/usuario';

@Injectable()
export class UsuarioServiceMock {
  private user!: Usuario;

  constructor(user?: Usuario) {
    if (user) this.user = user;
  }

  async getSession(uid: string): Promise<void> {}

  async getUser(online: boolean): Promise<Usuario> {
    return this.user;
  }

  private setUser(u?: any): Usuario {
    return {} as Usuario;
  }

  async saveIdioma(idioma: string): Promise<void> {}

  getUserOnline(): Usuario {
    return this.user;
  }

  setLang(lang: string): void {}
}
