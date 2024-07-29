import { AbstractControl, ValidationErrors } from '@angular/forms';

export class EmptyValidator {
  static empty(control: AbstractControl): ValidationErrors | null {
    var word = (control.value || '') as string;
    if (word != '') {
      if (word.trim() === '') {
        return { empty: true };
      }
    }
    return null;
  }
}
