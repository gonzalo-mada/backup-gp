import { Component, ViewChild } from '@angular/core';
import { InitService } from 'src/app/base/services/init.service';
import { ModulosComponent } from './modulos/modulos.component';
import { AplicacionesComponent } from './aplicaciones/aplicaciones.component';

@Component({
  selector: 'app-sistemas',
  templateUrl: './sistemas.component.html',
  styleUrls: ['./sistemas.component.css'],
})
export class SistemasComponent {
  constructor(private config: InitService) {}

  @ViewChild('modulos') modulos!: ModulosComponent;
  @ViewChild('aplicaciones') aplicaciones!: AplicacionesComponent;

  showSistemas: boolean = false;
  icons: any = this.config.get('system.icons');
  selected: string = 'modulos';
  show: any = this.config.get('system.buttons.sistemas.children');
}
