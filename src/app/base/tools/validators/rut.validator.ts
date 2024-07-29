import { AbstractControl, ValidationErrors } from '@angular/forms';

export class RutValidator {
  static rut(control: AbstractControl): ValidationErrors | null {
    var word = (control.value || '') as string;
    if (word != '') {
      word = word.trim();
      if (/^([0-9]{7,8})+-[0-9kK]{1}$/.test(word)) {
        var rutData = word.split('-');

        var M = 0,
          S = 1,
          T = parseInt(rutData[0]);
        for (; T; T = Math.floor(T / 10))
          S = (S + (T % 10) * (9 - (M++ % 6))) % 11;

        if ((S ? S - 1 : 'k').toString() === rutData[1].toLowerCase())
          return null;
        else return { rut: true };
      } else {
        return { rut: true };
      }
    }
    return null;
  }
}
