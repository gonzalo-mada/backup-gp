import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { PrimengModule } from '../../modules/primeng.module';

@Component({
  standalone: true,
  selector: 'app-form-isvalid',
  templateUrl: './form-isvalid.component.html',
  styleUrls: ['./form-isvalid.component.css'],
  imports: [CommonModule, TranslateModule, PrimengModule],
})
export class FormIsvalidComponent {
  constructor() {}

  @Input() valid: boolean | null | undefined = false;
}
