import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FileUpload } from 'primeng/fileupload';
import { FileUtils } from '../../tools/utils/file.utils';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-uploader-files',
  templateUrl: './uploader-files.component.html',
  styles: [
  ]
})
export class UploaderFilesComponent implements OnChanges {

  constructor(
              private fileUtils: FileUtils, 
              private messageService: MessageService,
            ){}

  

  @Input() files: { file: File; comment: string; uploaded: boolean }[] = [];
  @Input() data: any ;
  @Input() extrasDocs: any ;
  @Input() triggerUpload : boolean = false;

  @Output() filesChange = new EventEmitter<{ files: any[], uploadedFiles: any[] }>();
  @Output() saveDoc = new EventEmitter<any>();

  uploadedFiles: any[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['triggerUpload'] && this.triggerUpload) {
      this.uploadHandler();
    }
  }

  onSelect(event: any){

    // Lista temporal para almacenar archivos sin duplicados
    const uniqueFiles = event.currentFiles.filter((newFile: any) => {
      return !this.files.some(fileWithComment => fileWithComment.file.name === newFile.name);
    });

    // Agregar nuevos archivos con un comentario vacío
    uniqueFiles.forEach((newFile: any) => {
      this.files.push({ file: newFile, comment: '', uploaded: false });
    });

    this.filesChange.emit({ files: this.files, uploadedFiles: this.uploadedFiles })

  }

  async uploadHandler(){
    
    for (let i = 0; i < this.files.length; i++) {
      let file: any = await this.fileUtils.onSelectFile(this.files[i].file);

      const extras = {
        pesoDocumento: this.files[i].file.size,
        comentarios: this.files[i].comment
      };

      const combinedExtras = {
        ...this.extrasDocs,
        ...extras
      }

      let documento: any = {
        nombre: `${file.filename}.${file.format}`,
        archivo: file.binary,
        tipo: file.format,
        extras: combinedExtras,
      };
      
      this.saveDoc.emit(documento);
      //Para archivos completados
      // this.uploadedFiles.push(documento);

      // esto permitia borrar de la lista de pendientes el archivo subido
      // uploader.files = uploader.files.filter((f) => f.name !== this.files[i].file.name);

    }


    // this.files = [];
    this.filesChange.emit({ files: this.files, uploadedFiles: this.uploadedFiles })


  }

  choose(event: any, callback: any){
    callback();
  }

  // uploadEvent(callback: any) {
  //   callback();
  // }

  clearAllFiles(clearCallback: any){
    this.files = [];
    clearCallback();
    this.filesChange.emit({ files: this.files, uploadedFiles: this.uploadedFiles })
  }

  onCommentChange(index: number, comment: string) {
    this.files[index].comment = comment;
  }

  onRemoveTemplatingFile(file: File, uploader: FileUpload, index: number) {
    uploader.files = uploader.files.filter((f) => f != file);
    this.files.splice(index, 1);
    this.filesChange.emit({ files: this.files, uploadedFiles: this.uploadedFiles })

  }

}
