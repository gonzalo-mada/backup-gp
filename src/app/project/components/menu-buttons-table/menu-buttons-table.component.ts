import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-menu-buttons-table',
  templateUrl: './menu-buttons-table.component.html',
  styles: [
  ]
})
export class MenuButtonsTableComponent implements OnChanges {

  onClick : boolean = false;
  disabled : boolean = true;

  @Input() selectedRows: any;

  @Output() clickOpenNew: EventEmitter<any> = new EventEmitter();
  @Output() clickDeletededSelected: EventEmitter<any> = new EventEmitter();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedRows'] && changes['selectedRows'].currentValue) {
      this.selectedRows.length == 0 ? this.disabled = true : this.disabled = false;
    }
  }

  openNew(){
    this.clickOpenNew.emit();
  }

  deleteSelected(){
    this.clickDeletededSelected.emit(this.selectedRows)
    
  }



}
