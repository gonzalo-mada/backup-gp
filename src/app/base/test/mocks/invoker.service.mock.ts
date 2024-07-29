import { Observable, of } from 'rxjs';

export class InvokerServiceMock {
  httpInvoke(serviceData: any, params?: any): Promise<any> {
    return Promise.resolve({ message: 'Success' });
  }

  httpInvoke_subscribe(serviceData: any, params?: any): Observable<any> {
    return of({ message: 'Success' });
  }

  httpInvokeReport(
    serviceData: any,
    format: string,
    params?: any,
  ): Promise<any> {
    return Promise.resolve({ message: 'Success' });
  }

  httpInvokeReport_subscribe(
    serviceData: any,
    format: string,
    params?: any,
  ): Observable<any> {
    return of({ message: 'Success' });
  }
}
