import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styles: [
  ]
})
export class DialogComponent {

  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();

  onChange(){
    this.visible == false ? true : false;
    this.visibleChange.emit(this.visible);
  }

}
