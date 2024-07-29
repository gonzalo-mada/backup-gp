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

  // getCampus(): Observable<any> {
  //   return this.http.get<any>('assets/data/campus.json')
  //   .pipe(
  //     tap( response => console.log("response",response)),
  //     map( response => response.data),
  //     tap( response => console.log("response2",response)),
  //   )
  // }
}
