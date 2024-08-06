import { Injectable } from '@angular/core';
import { InvokerService } from 'src/app/base/services/invoker.service';
import { Campus } from '../models/Campus';


@Injectable({
  providedIn: 'root'
})
export class CampusService {

  constructor(private invoker: InvokerService) { }

  async getCampus(){
    return await this.invoker.httpInvoke('campus/getCampus');
  }

  async insertCampus(campus: Campus){
    return await this.invoker.httpInvoke('campus/insertCampus',campus);
  }

  async updateCampus(campus: Campus){
    return await this.invoker.httpInvoke('campus/updateCampus',campus);
  }

  async deleteCampus(campusToDelete: Campus[]){   
    return await this.invoker.httpInvoke('campus/deleteCampus',{campusToDelete: campusToDelete});
  }

  async saveDocs(docs: any){
    console.log("docs from service saveDocs",docs);
    
    return await this.invoker.httpInvoke(
      {
        service: 'campus/saveDocs',
        retry: 0,
        timeout: 30000
      },
      {
        nombre: docs.nombre,
        archivo: docs.archivo,
        tipo: docs.tipo,
        Cod_campus: docs.extras.Cod_campus,
        Descripcion_campus: docs.extras.Descripcion_campus,
        pesoDocumento: docs.extras.pesoDocumento,
        comentarios: docs.extras.comentarios,
      }
    );
  }

  async updateDocs(docs: any){   
    console.log("docs from service updateDocs",docs);
    return await this.invoker.httpInvoke(
      {
        service: 'campus/updateDocs',
        retry: 0,
        timeout: 30000
      },
      {
        id: docs.id,
        nombre: docs.nombre,
        dataBase64: docs.dataBase64,
        tipo: docs.tipo,
        Cod_campus: docs.extras.Cod_campus,
        Descripcion_campus: docs.extras.Descripcion_campus,
        pesoDocumento: docs.extras.pesoDocumento,
        comentarios: docs.extras.comentarios,
      }
    );
  }

  async getDocumentosCampus(Cod_campus: string) {
    return await this.invoker.httpInvoke(
        'campus/getDocumentosCampus',
        {
          Cod_campus: Cod_campus,
        }
    );
  }

  async getDocumentosWithBinaryCampus(Cod_campus: string) {
    return await this.invoker.httpInvoke(
        'campus/getDocumentosWithBinaryCampus',
        {
          Cod_campus: Cod_campus,
        }
    );
  }
  
  async deleteDocCampus(Cod_campus: string) {
    return await this.invoker.httpInvoke(
        'campus/deleteDocCampus',
        {
          Cod_campus: Cod_campus,
        }
    );
  }

  async getArchivoDocumento(idDocumento: string) {
    return await this.invoker.httpInvokeReport(
        'campus/getArchivoDocumento',
        'pdf',
        {
            id: idDocumento,
        }
    );
  }


  


}
