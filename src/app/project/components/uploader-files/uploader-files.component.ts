import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FileUpload } from 'primeng/fileupload';
import { FileUtils } from '../../tools/utils/file.utils';
import { MessageService } from 'primeng/api';


export interface file{
  id?: string;
  nombre: string;
  tipo: string;
  fechaCreacion?: string;
  fechaModificacion?: string;
}

export interface extras{
  Cod_campus?: string;
    nombreCampus?: string;
    pesoDocumento: number;
    comentarios: string;
}

export interface docMongoCampus{
  id?: string;
  nombre: string;
  tipo: string;
  fechaCreacion?: string;
  fechaModificacion?: string;
  dataBase64?: string;
  extras: extras
  origFile: File
}


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

  

  // @Input() files: { file: File; comment: string; uploaded: boolean }[] = [];
  @Input() files: docMongoCampus[] = [];
  @Input() data: any ;
  @Input() extrasDocs: any ;
  @Input() triggerUpload : boolean = false;

  // @Output() filesChange = new EventEmitter<{ files: any[], uploadedFiles: any[] }>();
  @Output() filesChange = new EventEmitter<any>();
  @Output() saveOrUpdateDoc = new EventEmitter<any>();
  @Output() deleteDoc = new EventEmitter<any>();

  uploadedFiles: any[] = [];
  filesOriginal: any[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['triggerUpload'] && this.triggerUpload) {
      console.log("cambio trigger",this.triggerUpload);
      
      this.uploadHandler();
    }
    if (changes['files'] && this.files) {
      // console.log("¿¿¿¿¿¿¿FILES",this.files);
      
    }
  }

  onSelect(event: any){

    // Lista temporal para almacenar archivos sin duplicados
    const uniqueFiles = event.currentFiles.filter((newFile: any) => {
      return !this.files.some(fileWithComment => fileWithComment.nombre === newFile.name);
    });

    // Agregar nuevos archivos con un comentario vacío
    // uniqueFiles.forEach((newFile: any) => {
    //   this.files.push({ file: newFile, extras.comentarios: '', uploaded: false });
    // });

    uniqueFiles.forEach((newFile: File) => {
      // console.log(newFile.);
      
      this.files.push({nombre: newFile.name , tipo: newFile.type, extras:{pesoDocumento: newFile.size ,comentarios:''} , origFile: newFile});
    });

    // console.log("this.files", this.files);
    
    this.filesChange.emit(this.files)

  }

  async uploadHandler(){


    
    for (let i = 0; i < this.files.length; i++) {
      const doc = this.files[i];
      if (!doc.id) {
        //modo subir nuevo archivo
        

        let file: any = await this.fileUtils.onSelectFile(doc.origFile);

        const extras = {
          pesoDocumento: doc.extras.pesoDocumento,
          comentarios: doc.extras.comentarios
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

        this.saveOrUpdateDoc.emit(documento);
      }else{
        //modo actualizar archivo
        const extras = {
          pesoDocumento: doc.extras.pesoDocumento,
          comentarios: doc.extras.comentarios
        };
        const combinedExtras = {
          ...this.extrasDocs,
          ...extras
        }
        
        let documento: any = {
          id: doc.id,
          nombre: `${doc.nombre}`,
          dataBase64: doc.dataBase64,
          tipo: doc.tipo,
          extras: combinedExtras,
        };
        this.saveOrUpdateDoc.emit(documento);
      }
      
      //Para archivos completados
      // this.uploadedFiles.push(documento);

      // esto permitia borrar de la lista de pendientes el archivo subido
      // uploader.files = uploader.files.filter((f) => f.name !== this.files[i].file.name);

    }


    // this.files = [];
    this.filesChange.emit(this.files)


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
    this.filesChange.emit(this.files)
  }

  onCommentChange(index: number, comment: string) {
    this.files[index].extras.comentarios = comment;
  }

  onRemoveTemplatingFile(file: any, uploader: FileUpload, index: number) {
    if (file.id) {
      //eliminar de mongo
      this.deleteDoc.emit(file)

      //TODO: ELIMINAR ARCHIVO DE MEMORIA CUANDO SE ELIMINE EFECTIVAMENTE DE MONGODB
      // this.files.splice(index, 1);

    }else{
      //eliminar de memoria navegador
      uploader.files = uploader.files.filter((f) => f != file.origFile);
      this.files.splice(index, 1);
    }
    // console.log("file from onremove",file);
    // console.log("num archivos uploader from onremove",uploader._files.length);
    // console.log("index from onremove",index);
    // console.log("this.files from onremove",this.files);
    
    // uploader.files = uploader.files.filter((f) => f != file);
    // this.files.splice(index, 1);
    this.filesChange.emit(this.files)

  }

}
