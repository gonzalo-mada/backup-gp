import { Component, OnInit } from '@angular/core';
import { CampusService } from '../../services/campus.service';
import { Table } from 'primeng/table';
import { ErrorTemplateHandler } from 'src/app/base/tools/error/error.handler';
import { SystemService } from 'src/app/base/services/system.service';
import { Campus } from '../../models/Campus';



@Component({
  selector: 'app-campus',
  templateUrl: './campus.component.html',
  styles: [
  ]
})
export class CampusComponent implements OnInit {

  campuses: Campus[] = [];
  cols: any[] = [];
  selectedCampus: Campus[] = [];

  constructor(private campusService: CampusService,
              private errorTemplateHandler: ErrorTemplateHandler,
              private systemService: SystemService
  ){}

  ngOnInit() {
    
    this.getCampuses();

    this.cols = [
      { field: 'nombre', header: 'Nombre' },
      { field: 'estado', header: 'Estado' },
      { field: 'accion', header: 'Acciones' }
    ];
    
  }

  async getCampuses(){
    try {
      this.systemService.loading(true);
      this.campuses = <Campus[]> await this.campusService.getCampus();
      console.log("campuses",this.campuses);
      this.systemService.loading(false);
      
    } catch (error) {
      this.errorTemplateHandler.processError(error, {
        notifyMethod: 'alert',
        message: 'Hubo un error al obtener la data. Intente nuevamente.',
      });
    }
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
}

  

}
