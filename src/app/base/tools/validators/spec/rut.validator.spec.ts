import { RutValidator } from '../rut.validator';
import { FormControl } from '@angular/forms';

describe('RutValidator (VALIDATOR)', () => {
  it('[1] Rut valido: dv numerico', () => {
    const control = new FormControl('16484897-3');
    const result = RutValidator.rut(control);
    expect(result).toBeNull();
  });

  it('[2] Rut valido: dv letra', () => {
    const control = new FormControl('13623093-k');
    const result = RutValidator.rut(control);
    expect(result).toBeNull();
  });

  it('[3] Rut invalido: numerico', () => {
    const control = new FormControl('12345678-9');
    const result = RutValidator.rut(control);
    expect(result).toEqual({ rut: true });
  });

  it('[4] Rut invalido: alfanumerico', () => {
    const control = new FormControl('1234xxxx-9');
    const result = RutValidator.rut(control);
    expect(result).toEqual({ rut: true });
  });

  it('[5] Rut vacio', () => {
    const control = new FormControl('');
    const result = RutValidator.rut(control);
    expect(result).toBeNull();
  });

  it('[6] Rut nulo', () => {
    const control = new FormControl(null);
    const result = RutValidator.rut(control);
    expect(result).toBeNull();
  });

  it('[7] Rut indefinido', () => {
    const control = new FormControl(undefined);
    const result = RutValidator.rut(control);
    expect(result).toBeNull();
  });
});
