import { Component, ViewChild } from '@angular/core';
import { ContactoComponent } from './contacto/contacto.component';
import { SimbologiaComponent } from './simbologia/simbologia.component';
import { HeaderUtils } from 'src/app/base/tools/utils/header.utils';
import { SystemService } from 'src/app/base/services/system.service';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-ayuda',
  templateUrl: './ayuda.component.html',
  styleUrls: ['./ayuda.component.css'],
})
export class AyudaComponent {
  constructor(
    private headerUtils: HeaderUtils,
    private systemService: SystemService,
  ) {}

  @ViewChild('contacto') contacto!: ContactoComponent;
  @ViewChild('simbologia') simbologia!: SimbologiaComponent;

  ayudaButtons: MenuItem[] = [];
  showAyuda: boolean = false;

  ngOnInit(): void {
    this.systemService.translate$.subscribe((e: any) => {
      this.setAyudaButtons();
    });
  }

  ngAfterViewInit(): void {
    this.setAyudaButtons();
  }

  private async setAyudaButtons(): Promise<void> {
    this.ayudaButtons = await this.headerUtils.getAyudaButtons(
      this.contacto,
      this.simbologia,
    );
  }
}
