import { Component, OnInit } from '@angular/core';
import { CampusService } from '../../services/campus.service';
import { FileUpload } from 'primeng/fileupload';
import { Table } from 'primeng/table';
import { ErrorTemplateHandler } from 'src/app/base/tools/error/error.handler';
import { SystemService } from 'src/app/base/services/system.service';
import { Campus } from '../../models/Campus';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FileUtils } from '../../tools/utils/file.utils';


@Component({
  selector: 'app-campus',
  templateUrl: './campus.component.html',
  styles: [
  ]
})
export class CampusComponent implements OnInit {

  
  campuses: Campus[] = [];
  campus: Campus = {};

  cols: any[] = [];
  selectedCampus: Campus[] = [];

  submitted: boolean = false;
  dialog: boolean = false;

  mode: string = '';

  files: { file: any; comment: string; uploaded: boolean }[] = [];
  uploadedFiles: any[] = [];

  commentsFile: any[] = [];


  public fbForm : FormGroup = this.fb.group({
    nombre: ['', Validators.required],
    files: ['', this.filesValidator.bind(this)]
  })

  constructor(private campusService: CampusService,
              private errorTemplateHandler: ErrorTemplateHandler,
              private fb: FormBuilder,
              private fileUtils: FileUtils,
              private messageService: MessageService,
              private systemService: SystemService
  ){}

  ngOnInit() {
    
    this.getCampuses();

    this.cols = [
      { field: 'nombre', header: 'Nombre' },
      { field: 'estado', header: 'Estado' },
      { field: 'accion', header: 'Acciones' }
    ];
    
  }

  filesValidator(control: any): { [key: string]: boolean } | null {
    console.log("entre al validador de files");
    
    const notUploaded = this.files.some(element => !element.uploaded);

    if (notUploaded) {
      return { required: true };
    }

    if (this.uploadedFiles.length === 0) {
      return { required: true };
    }

  
    return null;
  }

  async getCampuses(){
    try {
      this.systemService.loading(true);
      this.campuses = <Campus[]> await this.campusService.getCampus();
      this.systemService.loading(false);
      
    } catch (error) {
      this.errorTemplateHandler.processError(error, {
        notifyMethod: 'alert',
        message: 'Hubo un error al obtener la data. Intente nuevamente.',
      });
    }
  }

  refreshTable(){
    this.getCampuses();
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  openNew(){
    this.mode = 'create';
    this.campus = {};
    this.submitted = false;
    this.dialog = true; 
    
  }

  submit() {
    this.reset();
    this.messageService.add({
      severity: 'success',
      detail: 'Submit',
      key: 'formularios',
      summary: 'FormBuilder',
    });
  }

  reset() {
    this.fbForm.reset();
  }

  uploadHandler(uploader: FileUpload) {
    this.saveDocs(uploader)
  }

  async saveDocs(uploader: FileUpload){
    this.systemService.loading(true);

    this.campus = {
      id: "131",
      nombre: "Probando Campus",
    }
    

    for (let i = 0; i < this.files.length; i++) {
      let file: any = await this.fileUtils.onSelectFile(this.files[i].file);
      let documento: any = {
        nombre: `${file.filename}.${file.format}`,
        archivo: file.binary,
        tipo: file.format,
        extras: {
            idCampus: this.campus.id,
            nombreCampus: this.campus.nombre,
            pesoDocumento: this.files[i].file.size,
            comentarios: this.files[i].comment

        },
      };

      try {

        let uploadDoc = await this.campusService.saveDocs(documento);
        this.uploadedFiles.push(uploadDoc)
        console.log("uploadDoc",uploadDoc);
        
      } catch (e:any) {
        this.errorTemplateHandler.processError(e, {
          notifyMethod: 'alert',
          message: e.message,
        });
        return;
      }
      
      
      uploader.files = uploader.files.filter((f) => f.name !== this.files[i].file.name);
    }

    this.messageService.add({
      severity: 'success',
      summary: 'Documentos cargados',
      detail: 'Se han cargado los documentos correctamente.',
    });
    
    this.files = [];
    this.fbForm.controls['files'].updateValueAndValidity();
    // uploader.clear();


    this.systemService.loading(false);
  }

  onSelect(event: any) {

    // Lista temporal para almacenar archivos sin duplicados
    const uniqueFiles = event.currentFiles.filter((newFile: any) => {
      return !this.files.some(fileWithComment => fileWithComment.file.name === newFile.name);
    });

    // Agregar nuevos archivos con un comentario vacío
    uniqueFiles.forEach((newFile: any) => {
      this.files.push({ file: newFile, comment: '', uploaded: false });
    });

    //Actualizar validador de archivos
    this.fbForm.controls['files'].updateValueAndValidity();
  }

  onCommentChange(index: number, comment: string) {
    this.files[index].comment = comment;
  }


  choose(event: any, callback: any){
    callback();
  }

  uploadEvent(callback: any) {
    callback();
  }

  onRemoveTemplatingFile(file: File, uploader: FileUpload, index: number) {
    uploader.files = uploader.files.filter((f) => f != file);
    this.files.splice(index, 1);
    this.fbForm.controls['files'].updateValueAndValidity();

  }


  clearAllFiles(clearCallback: any){
    this.files = [];
    clearCallback();
    this.fbForm.controls['files'].updateValueAndValidity();
  }


}
