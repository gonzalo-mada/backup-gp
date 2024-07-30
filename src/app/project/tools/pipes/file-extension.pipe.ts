import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fileExtension',
})
export class FileExtensionPipe implements PipeTransform {
  transform(value: any): unknown {
    return value.slice(((value.lastIndexOf('.') - 1) >>> 0) + 2);
  }
}
