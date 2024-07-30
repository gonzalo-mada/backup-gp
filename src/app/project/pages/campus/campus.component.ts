import { Component, OnInit } from '@angular/core';
import { CampusService } from '../../services/campus.service';
import { FileUpload } from 'primeng/fileupload';
import { Table } from 'primeng/table';
import { ErrorTemplateHandler } from 'src/app/base/tools/error/error.handler';
import { SystemService } from 'src/app/base/services/system.service';
import { Campus } from '../../models/Campus';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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
  commentsFile: string[] = [];



  fbForm: FormGroup = new FormBuilder().group({
    nombre: new FormControl<string>('', [Validators.required]),
    commentsFile: new FormControl<string>(''),
    // files: [[], this.filesValidator]
  })

  files: any[] = [];

  constructor(private campusService: CampusService,
              private confirmationService: ConfirmationService,
              private errorTemplateHandler: ErrorTemplateHandler,
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

  filesValidator(control: FormControl): { [key: string]: any } | null {
    console.log("entre");
    
    const files = control.value;
    return files && files.length > 0 ? null : { required: true };
  }

  async getCampuses(){
    try {
      this.systemService.loading(true);
      this.campuses = <Campus[]> await this.campusService.getCampus();
      console.log("campuses",this.campuses);
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
    console.log("holaaaa");
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
    console.log("entre a uploadhandler");
    
    this.confirmationService.confirm({
        message: `¿Desea cargar los documentos seleccionados?`,
        acceptLabel: 'Cargar',
        acceptIcon: 'pi pi-upload',
        rejectLabel: 'Cancelar',
        acceptButtonStyleClass: 'p-button-success p-button-sm',
        rejectButtonStyleClass:
            'p-button-secondary p-button-text p-button-sm',
        accept: () => {
            this.saveDocs(uploader);
        },
    });
  }

  async saveDocs(uploader: FileUpload){
    this.systemService.loading(true);

    for (let i = 0; i < this.files.length; i++) {
      let file: any = await this.fileUtils.onSelectFile(this.files[i]);
      let documento: any = {
        nombre: `${file.filename}.${file.format}`,
        archivo: file.binary,
        tipo: file.format,
        extras: {
            idCampus: this.campus.id,
            nombre: this.campus.nombre
        },
      };


    }

    this.systemService.loading(false);
  }

  onSelect(event: any) {
    this.commentsFile.push('');
    this.files = event.currentFiles;
  }

  

  removeFileUploader(file: File, uploader: FileUpload, index: number) {
    uploader.files = uploader.files.filter((f) => f != file);
    this.commentsFile.splice(index, 1);
    this.files.splice(index, 1);
  }

  
  

}
