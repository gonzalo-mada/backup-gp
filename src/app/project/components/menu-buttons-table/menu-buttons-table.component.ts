import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-menu-buttons-table',
  templateUrl: './menu-buttons-table.component.html',
  styles: [
  ]
})
export class MenuButtonsTableComponent {

  @Output() clickOpenNew: EventEmitter<any> = new EventEmitter();

  onClickOpenNew(){
    this.clickOpenNew.emit();
  }

}
