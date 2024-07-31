import { Injectable } from '@angular/core';
import { InvokerService } from 'src/app/base/services/invoker.service';


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
          idCampus: docs.extras.idCampus,
          nombre: docs.nombre,
          archivo: docs.archivo,
          tipo: docs.tipo,
          nombreCampus: docs.extras.nombreCampus,
          pesoDocumento: docs.extras.pesoDocumento,
          comentarios: docs.extras.comentarios,
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
