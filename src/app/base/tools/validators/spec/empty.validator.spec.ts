import { EmptyValidator } from '../empty.validator';
import { FormControl } from '@angular/forms';

describe('EmptyValidator (VALIDATOR)', () => {
  it('[1] Campo con dato', () => {
    const control = new FormControl('hola');
    const result = EmptyValidator.empty(control);
    expect(result).toBeNull();
  });

  it('[2] Campo vacio', () => {
    const control = new FormControl(' ');
    const result = EmptyValidator.empty(control);
    expect(result).toEqual({ empty: true });
  });

  it('[3] Campo nulo', () => {
    const control = new FormControl(null);
    const result = EmptyValidator.empty(control);
    expect(result).toBeNull();
  });

  it('[4] Campo indefinido', () => {
    const control = new FormControl(undefined);
    const result = EmptyValidator.empty(control);
    expect(result).toBeNull();
  });
});
