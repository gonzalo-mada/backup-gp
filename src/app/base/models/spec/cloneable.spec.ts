import { Cloneable } from '../cloneable';

describe('Cloneable (CLASS)', () => {
  it('[1] Copia de un array', () => {
    const originalArray = [{ name: 'John' }, { name: 'Jane' }];
    const copiedArray = Cloneable.deepCopy(originalArray);

    expect(copiedArray).toEqual(originalArray);
    expect(copiedArray).not.toBe(originalArray);
  });

  it('[2] Copia de un Date object', () => {
    const originalDate = new Date('2022-12-31');
    const copiedDate = Cloneable.deepCopy(originalDate);

    expect(copiedDate).toEqual(originalDate);
    expect(copiedDate).not.toBe(originalDate);
  });

  it('[3] Copia de un object', () => {
    const originalObject = { name: 'John', age: 30 };
    const copiedObject = Cloneable.deepCopy(originalObject);

    expect(copiedObject).toEqual(originalObject);
    expect(copiedObject).not.toBe(originalObject);
  });

  it('[4] Copia de objetos anidados', () => {
    const originalObject = {
      name: 'John',
      address: { city: 'New York', country: 'USA' },
    };
    const copiedObject = Cloneable.deepCopy(originalObject);

    expect(copiedObject).toEqual(originalObject);
    expect(copiedObject).not.toBe(originalObject);
    expect(copiedObject.address).not.toBe(originalObject.address);
  });

  it('[5] Control de copias de entradas nulas', () => {
    expect(Cloneable.deepCopy(null)).toBeNull();
    expect(Cloneable.deepCopy(undefined)).toBeUndefined();
  });
});
