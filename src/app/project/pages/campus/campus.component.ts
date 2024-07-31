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
import { TableCampusComponent } from '../../components/table-campus/table-campus.component';



@Component({
  selector: 'app-campus',
  templateUrl: './campus.component.html',
  styles: [
  ]
})
export class CampusComponent implements OnInit {

  
  campuses: Campus[] = [];
  campus: Campus = {};

  //cols: any[] = [];
  selectedCampus: Campus[] = [];

  submitted: boolean = false;
  dialog: boolean = false;

  mode: string = '';

  validateFiles: { file: any; comment: string; uploaded: boolean }[] = [];
  validateUploadedFiles: any[] = [];

  extrasDocs : any = {};
  documento: any = {};


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

    // this.cols = [
    //   { field: 'nombre', header: 'Nombre' },
    //   { field: 'estado', header: 'Estado' },
    //   { field: 'accion', header: 'Acciones' }
    // ];

    this.campus = {
      id: "131",
      nombre: "Probando Campus",
    }

    this.extrasDocs = {
      idCampus: this.campus.id,
      nombreCampus: this.campus.nombre,
    }
    
  }

  filesValidator(control: any): { [key: string]: boolean } | null {   
    const notUploaded = this.validateFiles.some(element => !element.uploaded);

    if (notUploaded) {
      return { required: true };
    }

    if (this.validateUploadedFiles.length === 0) {
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
        message: 'Hubo un error al obtener los registros. Intente nuevamente.',
      });
      this.systemService.loading(false);
    }
  }

  refreshTable(){
    this.getCampuses();
  }

  // onGlobalFilter(table: Table, event: Event) {
  //   table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  // }

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


  filesChanged(allFiles: any){
    this.validateFiles = allFiles.files;
    this.validateUploadedFiles = allFiles.uploadedFiles
    this.fbForm.controls['files'].updateValueAndValidity();
  }

  async saveDoc(documento: any){
    
    try {
      this.systemService.loading(true);

      let uploadDoc = await this.campusService.saveDocs(documento);
      console.log("uploadDoc",uploadDoc);

      this.systemService.loading(false);

    } catch (e:any) {
      this.systemService.loading(false);
      this.errorTemplateHandler.processError(e, {
        notifyMethod: 'alert',
        message: e.message,
      });
      return;
    }
  }


}
