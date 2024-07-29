import { Injectable } from '@angular/core';
import { Cloneable } from '../../models/cloneable';

@Injectable({
  providedIn: 'root',
})
export class CommonUtils {
  constructor() {}

  getObjectArray(array: any[], attrArray: string | number, value: any): any {
    let obt = array.find((e: { [x: string]: any }) => e[attrArray] === value);
    return obt;
  }

  getObjectsFromArray(
    array: any[],
    attrArray: string | number,
    value: any,
  ): any[] {
    let obt = array.filter((e: { [x: string]: any }) => e[attrArray] === value);
    return obt;
  }

  findIndex(array: any[], attrArray: string | number, value: any): number {
    let i = array.findIndex(
      (e: { [x: string]: any }) => e[attrArray] === value,
    );
    return i;
  }

  removeObjectsFromArray(
    array: any[],
    attrArray: string | number,
    value: any,
  ): any[] {
    array = array.filter((e: { [x: string]: any }) => e[attrArray] !== value);
    return array;
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
    let dwldLink = document.createElement('a');
    let url = URL.createObjectURL(report);

    dwldLink.setAttribute('target', '_blank');
    dwldLink.setAttribute('href', url);
    dwldLink.setAttribute('download', filename);
    dwldLink.style.visibility = 'hidden';
    document.body.appendChild(dwldLink);
    dwldLink.click();
    document.body.removeChild(dwldLink);
    window.URL.revokeObjectURL(url);
  }

  visorPDF(
    src: any,
    id: string,
    height: string,
    width: string,
    toolbar: boolean,
  ): void {
    var s = document.createElement('iframe');
    s.src = URL.createObjectURL(src);
    if (!toolbar) s.src += `#toolbar=0&navpanes=0&frameborder=0`;
    s.height = height;
    s.width = width;
    s.id = `pdfvisor_${id}`;

    var container: any = document.getElementById(id);
    container.innerHTML = null;
    container.appendChild(s);
  }

  filtering(array: any[], paramFilter: string, paramCompare: string): any[] {
    let tmp = array;
    if (paramFilter != '') {
      tmp = array.filter((e) => {
        let a = e[paramCompare]
          .trim()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .toUpperCase();
        let b = paramFilter
          .trim()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .toUpperCase();
        if (a.includes(b)) return e;
      });
    }
    return tmp;
  }

  scrollTo(id: string): void {
    setTimeout(() => {
      try {
        document.getElementById(id)!.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
          inline: 'nearest',
        });
      } catch (error) {}
    }, 100);
  }

  arraysHaveSameElements(arr1: any[], arr2: any[]): boolean {
    if (arr1.length !== arr2.length) {
      return false;
    }
    const sortedArr1 = arr1.slice().sort();
    const sortedArr2 = arr2.slice().sort();
    for (let i = 0; i < sortedArr1.length; i++) {
      if (sortedArr1[i] !== sortedArr2[i]) {
        return false;
      }
    }
    return true;
  }

  esJSON(objeto: any): boolean {
    if (typeof objeto === 'object') {
      try {
        JSON.stringify(objeto);
        return true;
      } catch (error) {
        return false;
      }
    } else {
      return false;
    }
  }

  async checkImageExists(url: string): Promise<boolean> {
    return await new Promise<boolean>((resolve) => {
      try {
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = url;
      } catch (e) {
        resolve(false);
      }
    });
  }
}
