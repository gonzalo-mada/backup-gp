import { AfterContentInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Table } from 'primeng/table';
import { Campus } from '../../models/Campus';

@Component({
  selector: 'app-table-campus',
  templateUrl: './table-campus.component.html',
  styles: [
  ]
})
export class TableCampusComponent implements OnInit, OnChanges {
  

  @Input() data : any;
  @Input() cols : any;
  @Input() globalFiltros : any;
  @Input() dataKeyTable : any;

  @Output() refreshTable = new EventEmitter<any>();
  @Output() activeEditMode = new EventEmitter<any>();
  @Output() selectedCampus: EventEmitter<Campus> = new EventEmitter<Campus>();

  selectedValue: {} = {} ;

  ngOnInit(): void {
    console.log("data cols:", this.cols);
    console.log("data:", this.data);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && changes['data'].currentValue) {
      console.log("data from onchanges:", this.data);
      
    }
    if (changes['dataKeyTable'] && changes['dataKeyTable'].currentValue) {
      console.log("dataKeyTable from onchanges:", this.dataKeyTable);
      
    }
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  refresh(){
    this.refreshTable.emit();
  }

  edit(data: any){
    // console.log("data",data);
    this.activeEditMode.emit(data);
    
  }

  show(campus: Campus){
    this.selectedCampus.emit(campus);
  }











  

}
