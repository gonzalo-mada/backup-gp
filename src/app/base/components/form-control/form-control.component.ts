import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { PrimengModule } from '../../modules/primeng.module';
import { SystemService } from '../../services/system.service';
import { project_form_validator } from '../../../project/configs/form';
import { FormControl } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-form-control',
  templateUrl: './form-control.component.html',
  styleUrls: ['./form-control.component.css'],
  imports: [CommonModule, TranslateModule, PrimengModule],
})
export class FormControlComponent {
  constructor(private systemService: SystemService) {}

  @Input() control!: FormControl | any | undefined | null;
  @Input() validators: Array<string> = [];
  msgs!: any;
  show: boolean = true;
  project_form_validator: any[] = [...project_form_validator];

  ngOnInit() {
    if (this.control instanceof FormControl) {
      this.systemService.translate$.subscribe((e: any) => {
        this.setValues();
      });
      this.setValues();
    } else this.show = false;
  }

  async setValues() {
    var t: any = await this.systemService.translate(['form']);
    this.msgs = {
      required: t.form.required,
      pattern: t.form.pattern,
      email: t.form.email,
      maxlength: t.form.maxlength,
      minlength: t.form.minlength,
      min: t.form.min,
      max: t.form.max,
      empty: t.form.empty,
      rut: t.form.rut,
    };

    for (let i = 0; i < this.project_form_validator.length; i++) {
      var e = this.project_form_validator[i];
      this.msgs[e] = t.form[e];
    }
  }
}
