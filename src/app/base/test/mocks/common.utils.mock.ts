import { Injectable } from '@angular/core';
import { Cloneable } from '../../models/cloneable';

@Injectable()
export class CommonUtilsMock {
  getObjectArray(array: any[], attrArray: string | number, value: any): any {
    return array.find((e: { [x: string]: any }) => e[attrArray] === value);
  }

  getObjectsFromArray(
    array: any[],
    attrArray: string | number,
    value: any,
  ): any[] {
    return array.filter((e: { [x: string]: any }) => e[attrArray] === value);
  }

  findIndex(array: any[], attrArray: string | number, value: any): number {
    return array.findIndex((e: { [x: string]: any }) => e[attrArray] === value);
  }

  removeObjectsFromArray(
    array: any[],
    attrArray: string | number,
    value: any,
  ): any[] {
    return array.filter((e: { [x: string]: any }) => e[attrArray] !== value);
  }

  mergeDeep(source: any): any {
    return Cloneable.deepCopy(source);
  }

  highlight(data: string | null, param: string | RegExp): string | null {
    return data != null
      ? data.replace(
          new RegExp(param, 'gi'),
          (match: any) => `<mark>${match}</mark>`,
        )
      : null;
  }

  downloadBlob(report: Blob, filename: string): void {
    console.log(`Descargando blob: ${filename}`);
  }

  visorPDF(
    src: any,
    id: string,
    height: string,
    width: string,
    toolbar: boolean,
  ): void {
    console.log(`Mostrando visor de PDF para ${src}`);
  }

  filtering(array: any[], paramFilter: string, paramCompare: string): any[] {
    return array.filter((e) => e[paramCompare].includes(paramFilter));
  }

  scrollTo(id: string): void {
    console.log(`Haciendo scroll al elemento con id: ${id}`);
  }

  arraysHaveSameElements(arr1: any[], arr2: any[]): boolean {
    return JSON.stringify(arr1.sort()) === JSON.stringify(arr2.sort());
  }

  esJSON(objeto: any): boolean {
    try {
      JSON.stringify(objeto);
      return true;
    } catch (error) {
      return false;
    }
  }

  checkImageExists(url: string): Promise<boolean> {
    return Promise.resolve(true);
  }
}
