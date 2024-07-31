import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Table } from 'primeng/table';
import { Campus } from '../../models/Campus';

@Component({
  selector: 'app-table-campus',
  templateUrl: './table-campus.component.html',
  styles: [
  ]
})
export class TableCampusComponent {
  @Input() campuses: Campus[] = [];
  @Input() campus: Campus = {}; //campus para iterar en ng-template
  
  @Input() cols: any[] = [];

  @Output()
  selectedCampus: EventEmitter<Campus> = new EventEmitter<Campus>();
  
  @Output() refresh = new EventEmitter<void>();

  constructor(){}

  ngOnInit(){
    
  }
  selectCampus(campus: Campus){
    this.selectedCampus.emit(campus);
  }
  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
  refreshTable() {
    this.refresh.emit();
  }
}
