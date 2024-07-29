import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { CommonUtils } from '../common.utils';

describe('CommonUtils (UTILS)', () => {
  let service: CommonUtils;

  const array = [
    { id: 1, name: 'marco', age: 30 },
    { id: 2, name: 'polo', age: 30 },
    { id: 3, name: 'aegis', age: 10 },
  ];

  const arrayFilter = [
    { id: 1, name: 'marco', age: 30 },
    { id: 2, name: 'polo', age: 30 },
    { id: 3, name: 'aegis', age: 10 },
    { id: 4, name: 'luna', age: 25 },
    { id: 5, name: 'sol', age: 28 },
    { id: 6, name: 'Marcó', age: 20 },
    { id: 7, name: 'galaxia', age: 35 },
    { id: 8, name: 'planeta', age: 40 },
    { id: 9, name: 'nebulosa', age: 15 },
    { id: 10, name: 'cometa', age: 18 },
  ];

  const same1 = [1, 2, 3];
  const same2 = [3, 2, 1];
  const same3 = [4, 5, 2];
  const same4 = [4, 5, 2, 1, 3];

  const source: any = { a: { b: { c: 'hola' } }, d: 'chao' };

  const imageUrl_exists = 'https://admintui.uv.cl/data/fotos2/user_uv.jpg';
  const imageUrl_bad = 'https://admintui.uv.cl/data/fotos2/noexiste.jpg';

  const imageMock_exists = {
    onload: null as null | (() => void),
    onerror: null as null | (() => void),
    set src(url: string) {
      if (url === imageUrl_exists) {
        setTimeout(() => this.onload && this.onload(), 100);
      }
    },
  };

  const imageMock_bad = {
    onload: null as null | (() => void),
    onerror: null as null | (() => void),
    set src(url: string) {
      if (url === imageUrl_bad) {
        setTimeout(() => this.onerror && this.onerror(), 100);
      }
    },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CommonUtils],
    });
    service = TestBed.inject(CommonUtils);
  });

  it('[1] Es creado', () => {
    expect(service).toBeTruthy();
  });

  it('[2] Obtener un objeto de un arreglo: getObjectArray()', () => {
    expect(service.getObjectArray(array, 'id', 1)).toEqual({
      id: 1,
      name: 'marco',
      age: 30,
    });
  });

  it('[3] Obtener varios objetos de un arreglo: getObjectsFromArray()', () => {
    expect(service.getObjectsFromArray(array, 'age', 30)).toEqual([
      { id: 1, name: 'marco', age: 30 },
      { id: 2, name: 'polo', age: 30 },
    ]);
  });

  it('[4] Obtener indice de un objeto en un arreglo: findIndex()', () => {
    expect(service.findIndex(array, 'age', 10)).toEqual(2);
  });

  it('[5] Remover objetos de un arreglo: removeObjectsFromArray() ', () => {
    expect(service.removeObjectsFromArray(array, 'age', 30)).toEqual([
      { id: 3, name: 'aegis', age: 10 },
    ]);
  });

  it('[6] Crear una copia (profunda) y con distinto punteros: mergeDeep()', () => {
    expect(service.mergeDeep(source)).toEqual(source);
  });

  it('[7] Destacar texto con marcador: highlight() :: con texto', () => {
    const data = 'Hola Chao';
    expect(service.highlight(data, 'Chao')).toEqual('Hola <mark>Chao</mark>');
  });

  it('[8] Destacar texto con marcador: highlight() :: sin texto', () => {
    const data = null;
    expect(service.highlight(data, 'Chao')).toBeNull();
  });

  it('[9] Descargar blob (archivo), crea y remueve link de descarga: downloadBlob()', () => {
    const report = new Blob(['contenido del archivo'], { type: 'text/plain' });
    const filename = 'archivo.txt';

    const anchor = document.createElement('a');
    const setAttributeSpy = spyOn(anchor, 'setAttribute');

    spyOn(document, 'createElement').and.returnValue(anchor);
    spyOn(document.body, 'appendChild').and.callThrough();
    spyOn(document.body, 'removeChild').and.callThrough();

    service.downloadBlob(report, filename);

    expect(setAttributeSpy).toHaveBeenCalledWith('href', jasmine.any(String));
    expect(setAttributeSpy).toHaveBeenCalledWith('download', filename);
    expect(document.body.appendChild).toHaveBeenCalledWith(anchor);
    expect(document.body.removeChild).toHaveBeenCalled();
  });

  it('[10] Scroll hacia un cierto elemento del DOM: scrollTo() :: existe anchor', fakeAsync(() => {
    const mockElement = document.createElement('div');
    spyOn(document, 'getElementById').and.returnValue(mockElement);
    spyOn(mockElement, 'scrollIntoView');

    service.scrollTo('testId');
    tick(100);

    expect(document.getElementById).toHaveBeenCalledWith('testId');
    expect(mockElement.scrollIntoView).toHaveBeenCalledWith({
      behavior: 'smooth',
      block: 'start',
      inline: 'nearest',
    });
  }));

  it('[11] Scroll hacia un cierto elemento del DOM: scrollTo() :: no existe anchor', fakeAsync(() => {
    spyOn(document, 'getElementById').and.returnValue(null);
    service.scrollTo('nonexistentId');
    tick(100);
    expect(document.getElementById).toHaveBeenCalledWith('nonexistentId');
  }));

  it('[12] Buscar elementos en un arreglo segun un termino (no sensitivo): filtering()', () => {
    expect(service.filtering(arrayFilter, 'marco', 'name')).toEqual([
      { id: 1, name: 'marco', age: 30 },
      { id: 6, name: 'Marcó', age: 20 },
    ]);
  });

  it('[13] Visualizar un PDF: visorPDF()', () => {
    const src = new Blob(['PDF content'], { type: 'application/pdf' });
    const id = 'testContainer';
    const height = '100px';
    const width = '200px';
    const toolbar = false;
    const container = document.createElement('div');
    container.id = id;

    spyOn(document, 'createElement').and.callThrough();
    spyOn(document, 'getElementById').and.returnValue(container);
    spyOn(container, 'appendChild').and.callThrough();

    service.visorPDF(src, id, height, width, toolbar);

    expect(document.createElement).toHaveBeenCalledWith('iframe');
    expect(document.getElementById).toHaveBeenCalledWith(id);
    expect(container.innerHTML).not.toBe('');
    expect(container.appendChild).toHaveBeenCalled();

    const iframe: HTMLIFrameElement | null = container.querySelector(
      `#pdfvisor_${id}`,
    );
    expect(iframe).toBeTruthy();
    if (iframe) {
      expect(iframe.src).toContain('blob:');
      if (!toolbar) {
        expect(iframe.src).toContain('#toolbar=0&navpanes=0&frameborder=0');
      }
      expect(iframe.height).toBe(height);
      expect(iframe.width).toBe(width);
    }
  });

  it('[14] Ver si un arreglo tiene los mismos elementos que otro: arraysHaveSameElements() :: true', () => {
    expect(service.arraysHaveSameElements(same1, same2)).toBeTrue();
  });

  it('[15] Ver si un arreglo tiene los mismos elementos que otro: arraysHaveSameElements() :: false :: arreglos distintos', () => {
    expect(service.arraysHaveSameElements(same1, same3)).toBeFalse();
  });

  it('[16] Ver si un arreglo tiene los mismos elementos que otro: arraysHaveSameElements() :: false :: arreglos distintos largos', () => {
    expect(service.arraysHaveSameElements(same1, same4)).toBeFalse();
  });

  it('[17] Ver si un objeto any es un json: esJSON() :: true', () => {
    expect(service.esJSON(source)).toBeTrue();
  });

  it('[18] Ver si un objeto any es un json: esJSON() :: false', () => {
    expect(service.esJSON('hola')).toBeFalse();
  });

  it('[19] Ver si un objeto any es un json: esJSON() :: false :: error parsing', () => {
    source.d = source; // error circular
    expect(service.esJSON(source)).toBeFalse();
  });

  it('[20] Verificar una imagen: checkImageExists() :: success :: existe imagen', async () => {
    spyOn(window, 'Image').and.returnValue(
      imageMock_exists as unknown as HTMLImageElement,
    );
    const result = await service.checkImageExists(imageUrl_exists);
    expect(result).toBeTrue();
  });

  it('[21] Verificar una imagen: checkImageExists() :: success :: no existe imagen', async () => {
    spyOn(window, 'Image').and.returnValue(
      imageMock_bad as unknown as HTMLImageElement,
    );
    const result = await service.checkImageExists(imageUrl_bad);
    expect(result).toBeFalse();
  });

  it('[22] Verificar una imagen: checkImageExists() :: error', async () => {
    spyOn(window, 'Image').and.throwError('Error');
    const result = await service.checkImageExists(imageUrl_exists);
    expect(result).toBeFalse();
  });
});
