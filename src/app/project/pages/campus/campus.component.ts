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
import { TableCampusComponent } from '../../components/tables/table-campus.component';
import { ActiveStepChangeEvent } from 'primeng/stepper'
import { CommonUtils } from 'src/app/base/tools/utils/common.utils';


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
  globalFiltros : any[] = [];
  dataKeyTable : string = '';


  triggerUpload: boolean = false; 

  dialog: boolean = false;

  mode: string = '';

  validateFiles: { file: any; comment: string; uploaded: boolean }[] = [];
  // validateUploadedFiles: any[] = [];

  extrasDocs : any = {};
  documento: any = {};


  _campusSeleccionado: Campus[] = [];
  _files: any[] = [];
  _documento: any;


  public fbForm : FormGroup = this.fb.group({
    Descripcion_campus: ['', Validators.required],
    files: ['', this.filesValidator.bind(this)]
  })

  constructor(private campusService: CampusService,
              private errorTemplateHandler: ErrorTemplateHandler,
              private fb: FormBuilder,
              private messageService: MessageService,
              private systemService: SystemService,
              private commonUtils: CommonUtils
  ){}

  async ngOnInit() {

    this.cols = [
      { field: 'nombre', header: 'Nombre' },
      { field: 'estado', header: 'Estado' },
      { field: 'accion', header: 'Acciones' }
    ];

    this.globalFiltros = [ 'nombre' ]

    this.dataKeyTable = 'Cod_campus';
    
    await this.getCampuses();
        
  }

  filesValidator(control: any): { [key: string]: boolean } | null {   

    //validador desechado dado que funcion de archivos pendientes/completados ya no es necesaria
    // const notUploaded = this.validateFiles.some(element => !element.uploaded);
    // if (notUploaded) {
    //   return { required: true };
    // }

    if (this.validateFiles.length === 0) {
      return { required: true };
    }

    return null;
  }

  async getCampuses(){
    try {
      this.campuses = <Campus[]> await this.campusService.getCampus();
    } catch (error) {
      this.errorTemplateHandler.processError(error, {
        notifyMethod: 'alert',
        message: 'Hubo un error al obtener los registros. Intente nuevamente.',
      });
    }
  }


  openNew(){
    this.mode = 'create';
    this.campus = {};
    this.dialog = true; 
  }


  async insertForm(){
    try {
      const campusInserted = await this.campusService.insertCampus( this.fbForm.value )
      this.campuses.push(campusInserted);
      this.getCampuses();
      return campusInserted;
    } catch (error) {
      this.errorTemplateHandler.processError(error, {
        notifyMethod: 'alert',
        message: 'Hubo un error al ingresar el registro. Intente nuevamente.',
      });

    }
  }

  async insertDocs(campusInserted: Campus){
 
    try {
      this.extrasDocs = {
        idCampus: campusInserted.Cod_campus,
        nombreCampus: campusInserted.Descripcion_campus,
      }
      //activo la subida de archivos en componente uploaderfiles
      this.triggerUpload = true ;

      // const uploadDoc = await this.saveDoc(documento)
    } catch (error) {
      this.errorTemplateHandler.processError(error, {
        notifyMethod: 'alert',
        message: 'Hubo un error al insertar el documento. Intente nuevamente.',
      });

    }
  }

  async submit() {

    this.systemService.loading(true);
    const campusInserted = await this.insertForm()
    await this.insertDocs(campusInserted)
    this.systemService.loading(false);

    this.dialog = false;
    
    this.messageService.add({
      key: 'campus',
      severity: 'success',
      detail: 'Campus creado exitosamente',
    });

  }

  reset() {
    this.fbForm.reset();
  }


  filesChanged(allFiles: any){
    this.validateFiles = allFiles.files;
    // variable para controlar archivos completados (funcion desechada)
    // this.validateUploadedFiles = allFiles.uploadedFiles
    this.fbForm.controls['files'].updateValueAndValidity();
  }

  async saveDoc(documento: any){
    
    try {
      await this.campusService.saveDocs(documento);
    } catch (e:any) {
      this.errorTemplateHandler.processError(e, {
        notifyMethod: 'alert',
        message: e.message,
      });
    }
  }

  test(){
    this.systemService.loading(true);
  }


  //editar
  openEdit(campus: any){
    this.mode = 'edit';
    this.campus = {...campus}

    this.fbForm.patchValue({
      Descripcion_campus: this.campus.Descripcion_campus
    })

    this.dialog = true;
  }





  //show
  campusSeleccionado(campus: Campus) {
    this._campusSeleccionado.pop()
    this._campusSeleccionado.push(campus)
    this.dialog = true;
    this.mode = 'show'
    this.cargarDocumentos(this._campusSeleccionado[0])
  }

  async cargarDocumentos(campus: Campus) {
    try {
        this._campusSeleccionado.pop()
        this._campusSeleccionado.push(campus)
        this.systemService.loading(true);
 
        if (!this._campusSeleccionado[0].Cod_campus) {
          throw new Error('El ID del campus no está definido');
      }
        this._files = await this.campusService.getDocumentosCampus(
          this._campusSeleccionado[0].Cod_campus
        );
        this.systemService.loading(false);
 
    } catch (e:any) {
        this.errorTemplateHandler.processError(
          e, {
            notifyMethod: 'alert',
            message: e.message,
          });
          return
    }
  }

  async downloadArchivo(documento: any) {
    try {
      this._documento = documento
      this.systemService.loading(true);
 
      let blob: Blob = await this.campusService.getArchivoDocumento(
        this._documento.id
      );
      this.commonUtils.downloadBlob(blob, this._documento.nombre);      
      this.systemService.loading(false);      
    } catch (e) {
      this.errorTemplateHandler.processError(e, {
        notifyMethod: 'alert',
        message: 'Hubo un error al descargar el archivo. Intente nuevamente.',
      });
    }
  }

}
