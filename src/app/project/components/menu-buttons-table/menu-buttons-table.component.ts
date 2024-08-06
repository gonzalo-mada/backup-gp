import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-menu-buttons-table',
  templateUrl: './menu-buttons-table.component.html',
  styles: [
  ]
})
export class MenuButtonsTableComponent {

  onClick : boolean = false;

  @Output() clickOpenNew: EventEmitter<any> = new EventEmitter();
  @Output() clickDeletededSelected: EventEmitter<any> = new EventEmitter();

  openNew(){
    this.clickOpenNew.emit();
  }

  deleteSelected(){
    this.clickDeletededSelected.emit(this.onClick)
    
  }



}
