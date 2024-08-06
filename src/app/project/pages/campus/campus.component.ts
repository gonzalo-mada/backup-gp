import { Component, EventEmitter, OnInit, Output } from '@angular/core';
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

  @Output() actionDelete = new EventEmitter<any>();
  
  campuses: Campus[] = [];
  campus: Campus = {};

  cols: any[] = [];
  selectedCampus: Campus[] = [];
  globalFiltros : any[] = [];
  dataKeyTable : string = '';

  triggerUpload: boolean = false; 
  triggerSelected: boolean = false; 
  dialog: boolean = false;
  mode: string = '';
  extrasDocs : any = {};
  _files: any[] = [];

  public fbForm : FormGroup = this.fb.group({
    Estado_campus: [true, Validators.required],
    Descripcion_campus: ['', Validators.required],
    files: [[], this.filesValidator.bind(this)]
  })

  constructor(private campusService: CampusService,
              private confirmationService: ConfirmationService,
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

    const formGroup = control.parent as FormGroup;
    
    if (!formGroup) {
      return null;
    }

    const estadoCampus = formGroup.get('Estado_campus')?.value;
    const files = formGroup.get('files')?.value;   
    
    if ( this.mode == 'create' ){
      if (files.length === 0 && estadoCampus === true) {
        return { required: true };
      }
    }else if ( this.mode == 'edit'){
      if (files.length === 0 && estadoCampus === true) {
        return { required: true };
      }
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


  openCreate(){
    this.mode = 'create';
    this.triggerUpload = false ;
    this.reset();
    this.campus = {};
    this.dialog = true; 
  }

  async openShow(campus: any) {

    this.mode = 'show'
    this.campus = {...campus}
    await this.cargarDocumentos(this.campus.Cod_campus)
    this.dialog = true;
  }

  async openEdit(campus: any){

    this.mode = 'edit';
    this.triggerUpload = false ;
    
    this.campus = {...campus}

    this.fbForm.patchValue({
      Estado_campus: this.campus.Estado_campus,
      Descripcion_campus: this.campus.Descripcion_campus
    })

    await this.loadDocsWithBinary(campus);
    this.dialog = true;
  }

  async openDelete(campus: any){
    this.mode = 'delete'
    this.campus = {...campus}
    this.dialog = true;
    // this.loadFiles(this.campus)
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

  async updateForm(campus: Campus ){
    try {

      campus.Estado_campus = this.fbForm.get('Estado_campus')!.value;
      campus.Descripcion_campus = this.fbForm.get('Descripcion_campus')!.value;

      const campusUpdated = await this.campusService.updateCampus( campus )
      this.getCampuses();

      return campus;

    } catch (error) {
      this.errorTemplateHandler.processError(error, {
        notifyMethod: 'alert',
        message: 'Hubo un error al actualizar el registro. Intente nuevamente.',
      });
      return;
    }
  }

  async insertDocs(campusInserted: Campus){
    
    try {
      this.extrasDocs = {
        Cod_campus: campusInserted.Cod_campus,
        Descripcion_campus: campusInserted.Descripcion_campus,
      }
      //activo la subida de archivos en componente uploaderfiles
      this.triggerUpload = true ;

    } catch (error) {
      this.errorTemplateHandler.processError(error, {
        notifyMethod: 'alert',
        message: 'Hubo un error al insertar el documento. Intente nuevamente.',
      });

    }
  }

  async updateDocs(campusUpdated: Campus){
    this.triggerUpload = false ;
    
    try {
      this.extrasDocs = {
        Cod_campus: campusUpdated.Cod_campus,
        Descripcion_campus: campusUpdated.Descripcion_campus,
      }
      //activo la subida de archivos en componente uploaderfiles
      this.triggerUpload = true ;

    } catch (error) {
      this.errorTemplateHandler.processError(error, {
        notifyMethod: 'alert',
        message: 'Hubo un error al insertar el documento. Intente nuevamente.',
      });

    }
  }

  async deleteDoc(doc : any){
    this.confirmationService.confirm({
      message: `Es necesario confirmar la acción para eliminar el documento <b>${doc.nombre}</b>. ¿Desea continuar?`,
      acceptLabel: 'Eliminar',
      acceptIcon: 'pi pi-trash mr-1',
      rejectLabel: 'Cancelar',
      key: 'campus',
      acceptButtonStyleClass: 'p-button-danger p-button-sm',
      rejectButtonStyleClass: 'p-button-secondary p-button-text p-button-sm',
      accept: async () => {
        try {
          this.systemService.loading(true);
          await this.campusService.deleteDocCampus(doc.id);
          
        } catch (error) {
          this.errorTemplateHandler.processError(error, {
            notifyMethod: 'alert',
            message: 'Hubo un error al eliminar el documento. Intente nuevamente.',
          });
        } finally {
          this.systemService.loading(false);
          this.messageService.add({
            key: 'campus',
            severity: 'success',
            detail: 'Documento eliminado exitosamente',
          });
        }
      }
    })
  }

  async submit() {
    this.systemService.loading(true);
    try {

      if ( this.mode == 'create' ) {
        //modo creacion
        const campusInserted = await this.insertForm()
        await this.insertDocs(campusInserted)

        this.messageService.add({
          key: 'campus',
          severity: 'success',
          detail: 'Campus creado exitosamente',
        });

      }else{
        //modo edit
        const campusUpdated = await this.updateForm(this.campus);
  
        if (campusUpdated) {
          await this.updateDocs(campusUpdated)
          this.messageService.add({
            key: 'campus',
            severity: 'success',
            detail: 'Campus actualizado exitosamente',
          });
        }
      }
      
    } catch (error) {

      const action = this.mode === 'create' ? 'insertar' : 'actualizar';
      const errorMessage = `Hubo un error al ${action} el registro. Intente nuevamente.`;

      this.errorTemplateHandler.processError(error, {
        notifyMethod: 'alert',
        message: errorMessage,
      });
    } finally {
      this.systemService.loading(false);
      this.dialog = false;
    }

    

  }

  reset() {
    this.fbForm.reset({
      Estado_campus: true,                // Valor inicial de Estado_campus
      Descripcion_campus: '',             // Valor inicial de Descripcion_campus
      files: []                           // Valor inicial de files
    });
    //TODO: DESDE LIMPIAR MEMORIA DE UPLOADER
    this.fbForm.controls['files'].updateValueAndValidity();
  }


  filesChanged(files: any){
    this.fbForm.patchValue({ files });
    this.fbForm.controls['files'].updateValueAndValidity();
  }

  changeEstadoCampus(event : any){
    this.fbForm.controls['files'].updateValueAndValidity();
  }

  async saveOrUpdateDoc(documento: any){

    try {
      if (this.mode == 'create') {

        let newDocument = await this.campusService.saveDocs(documento);
        console.log("nuevo documento subido",newDocument);
        if (newDocument) {
          this.messageService.add({
            key: 'campus',
            severity: 'success',
            detail: 'Documento(s) subido(s) exitosamente',
          });
        }
      }else{
        //modo edicion
        if (!documento.id) {
          //modo edicion de campus sin documentos previos
          let newDocument = await this.campusService.saveDocs(documento);
          console.log("campus actualizado con nuevo documento subido",newDocument);
          if (newDocument) {
            this.messageService.add({
              key: 'campus',
              severity: 'success',
              detail: 'Documento(s) subido(s) exitosamente',
            });
          }
        }else{
          //modo edicion de campus con documentos previos
          let documentUpdated = await this.campusService.updateDocs(documento);
          console.log("documento actualizado",documentUpdated);
          if (documentUpdated) {
            this.messageService.add({
              key: 'campus',
              severity: 'success',
              detail: 'Documento(s) actualizado(s) exitosamente',
            });
          }
        }
        
      }
      
    } catch (e:any) {
      this.errorTemplateHandler.processError(e, {
        notifyMethod: 'alert',
        message: e.message,
      });
    }
  }



  

  async loadDocsWithBinary(campus: Campus){
    try {
      this.systemService.loading(true);
      
      const files = await this.campusService.getDocumentosWithBinaryCampus(campus.Cod_campus!)
      this.fbForm.patchValue({ files });
      this.filesChanged(files);

      this.systemService.loading(false);
      
    } catch (e:any) {
      this.errorTemplateHandler.processError(e, {
        notifyMethod: 'alert',
        message: e.message,
      });
    }
  }



  //show


  async cargarDocumentos(Cod_campus: any) {
    try {
        this.systemService.loading(true); 
        this._files = await this.campusService.getDocumentosCampus(Cod_campus);        
        this.systemService.loading(false);
 
    } catch (e:any) {
        this.errorTemplateHandler.processError(
          e, {
            notifyMethod: 'alert',
            message: e.message,
          });
    }
  }

  async downloadArchivo(documento: any) {
    try {
      this.systemService.loading(true);
      let blob: Blob = await this.campusService.getArchivoDocumento(documento.id);
      this.commonUtils.downloadBlob(blob, documento.nombre);      
      this.systemService.loading(false);      
    } catch (e) {
      this.errorTemplateHandler.processError(e, {
        notifyMethod: 'alert',
        message: 'Hubo un error al descargar el archivo. Intente nuevamente.',
      });
    }
  }

  //ELIMINAR
  async deleteSelected(campus: any){
    //Servicio para eliminar campus y archivos de mongo
    try{
      this.systemService.loading(true);
      await this.campusService.deleteCampus(campus.Cod_campus);
      this.dialog = false;
      this.messageService.add({
        key: 'campus',
        severity: 'success',
        detail: 'Campus eliminado exitosamente',
      });
      this.getCampuses()
 
    }
    catch(e){
      this.errorTemplateHandler.processError(e, {
        notifyMethod: 'alert',
        message: 'No se puede eliminar un campus en uso. Intente deshabilitar actualizando estado de campus.',
      });
    }
  }

  openDeleteSelectedCampus(event: any){
    console.log("event",event);
    
    if ( event === false && this.triggerSelected == false ) {
      console.log("caso 1");
      
      this.triggerSelected = true
    }else if( event === false && this.triggerSelected == true){
      console.log("caso 2");
      this.triggerSelected = false
    }else{
      console.log("caso 3");
      this.triggerSelected = true
    }

  }
 

  actionMode(event: any){
    console.log("event",event);

    switch (event.mode) {
      case 'create':
        this.openCreate()
      break;
      case 'show':
        this.openShow(event.data)
      break;
      case 'edit':
        this.openEdit(event.data)
      break;
      case 'delete':
        this.openDelete(event.data)
      break;

    }
    
  }

}
