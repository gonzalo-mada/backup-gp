import { Injectable } from '@angular/core';
import { FileExtensionPipe } from '../pipes/file-extension.pipe';

@Injectable({
  providedIn: 'root',
})
export class FileUtils {
  constructor() {}

  private fileExtensionPipe = new FileExtensionPipe();

  public async onSelectFile(file: any) {
    var output = await new Promise((onsuccess) => {
      let reader = new FileReader();
      reader.onload = async (e: any) => {
        onsuccess({
          size: file.size,
          binary: e.target.result,
          format: this.fileExtensionPipe.transform(file.name),
          filename:
            file.name.substring(0, file.name.lastIndexOf('.')) || file.name,
        });
      };
      reader.readAsBinaryString(file);
    });
    return output;
  }

  public setFile() {
    return {
      format: null,
      filename: null,
      binary: null,
      size: null,
    };
  }
}
