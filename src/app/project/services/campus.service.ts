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

  async saveDocs(docs: any){
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
        idCampus: docs.extras.idCampus,
        nombreCampus: docs.extras.nombreCampus,
        pesoDocumento: docs.extras.pesoDocumento,
        comentarios: docs.extras.comentarios,
      }
    );
  }

  async insertCampus(campus: Campus){
    return await this.invoker.httpInvoke('campus/insertCampus',campus);
  }

  async getDocumentosCampus(Cod_campus: string) {
    return await this.invoker.httpInvoke(
        'campus/getDocumentosCampus',
        {
          idCampus: Cod_campus,
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

  // getCampus(): Observable<any> {
  //   return this.http.get<any>('assets/data/campus.json')
  //   .pipe(
  //     tap( response => console.log("response",response)),
  //     map( response => response.data),
  //     tap( response => console.log("response2",response)),
  //   )
  // }
}
