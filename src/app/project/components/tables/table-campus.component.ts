import { AfterContentInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Table } from 'primeng/table';
import { Campus } from '../../models/Campus';

@Component({
  selector: 'app-table-campus',
  templateUrl: './table-campus.component.html',
  styles: [
  ]
})
export class TableCampusComponent implements OnChanges {
  

  @Input() data : any;
  @Input() cols : any;
  @Input() globalFiltros : any;
  @Input() dataKeyTable : any;


  @Output() refreshTable = new EventEmitter<any>();
  @Output() actionMode = new EventEmitter<any>();
  @Output() deleteSelectedCampus = new EventEmitter<any>();
  @Output() actionSelectRow = new EventEmitter<any>();

  // @Output() selectedCampus: EventEmitter<Campus> = new EventEmitter<Campus>();

  selectedCampus: Campus[] = [] ;
  mode : string = '';



  ngOnChanges(changes: SimpleChanges): void {

    if (changes['data'] && changes['data'].currentValue) {
      // console.log("data from onchanges:", this.data);
      
    }
    if (changes['dataKeyTable'] && changes['dataKeyTable'].currentValue) {
      // console.log("dataKeyTable from onchanges:", this.dataKeyTable);
    }

  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  refresh(){
    this.refreshTable.emit();
  }

  edit(campus: Campus){
    this.mode = 'edit';
    this.actionMode.emit({data: campus , mode: this.mode})
  }

  show(campus: Campus){
    this.mode = 'show';
    this.actionMode.emit({data: campus , mode: this.mode})
  }

  delete(campus: Campus){
    this.mode = 'delete';
    this.actionMode.emit({data: campus , mode: this.mode})
  }


  selectedRows(event: any){
    this.actionSelectRow.emit(event);
  }

  












  

}
