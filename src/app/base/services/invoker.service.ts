import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  timeout,
  retry,
  catchError,
  map,
  lastValueFrom,
  Observable,
} from 'rxjs';
import { InvokerUtils } from '../tools/utils/invoker.utils';
import { Router } from '@angular/router';
import { ErrorTemplate } from '../models/error-template';
import { SystemService } from './system.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class InvokerService {
  constructor(
    private http: HttpClient,
    private injector: Injector,
    private invokerUtils: InvokerUtils,
    private systemService: SystemService,
  ) {}

  httpInvoke(
    serviceData:
      | string
      | {
          service: string;
          timeout?: number;
          retry?: number;
          loading?: boolean;
        },
    params?: any,
  ): Promise<any> {
    return lastValueFrom(this.httpInvoke_subscribe(serviceData, params));
  }

  httpInvoke_subscribe(
    serviceData:
      | string
      | {
          service: string;
          timeout?: number;
          retry?: number;
          loading?: boolean;
        },
    params?: any,
  ): Observable<any> {
    var p: any = this.invokerUtils.prepareInvokerData(
      environment.backend,
      serviceData,
      this.injector.get(Router),
      params,
    );
    this.systemService.loading(p.service.loading);
    return this.http
      .post(p.url, p.params, {
        headers: p.headers,
      })
      .pipe(
        timeout(p.service.timeout),
        retry(p.service.retry),
        map((response: any) => {
          this.systemService.loading(false);
          response = this.invokerUtils.processResponse(
            p.request,
            response,
            p.router,
          );
          if (!(response instanceof ErrorTemplate)) return response;
          throw response;
        }),
        catchError((err) => {
          this.systemService.loading(false);
          throw this.invokerUtils.processError(err, p.router, p.request);
        }),
      );
  }

  httpInvokeReport(
    serviceData:
      | string
      | {
          service: string;
          timeout?: number;
          retry?: number;
          loading?: boolean;
        },
    format: string,
    params?: any,
  ): Promise<any> {
    return lastValueFrom(
      this.httpInvokeReport_subscribe(serviceData, format, params),
    );
  }

  httpInvokeReport_subscribe(
    serviceData:
      | string
      | {
          service: string;
          timeout?: number;
          retry?: number;
          loading?: boolean;
        },
    format: string,
    params?: any,
  ): Observable<any> {
    var p: any = this.invokerUtils.prepareInvokerData(
      environment.backend,
      serviceData,
      this.injector.get(Router),
      params,
    );
    this.systemService.loading(p.service.loading);
    return this.http
      .post(p.url, p.params, {
        headers: p.headers,
        responseType: 'blob' as 'blob',
      })
      .pipe(
        timeout(p.service.timeout),
        retry(p.service.retry),
        map(async (response: any) => {
          this.systemService.loading(false);
          response = await this.invokerUtils.processReport(
            p.request,
            response,
            p.router,
            format,
          );
          if (!(response instanceof ErrorTemplate)) return response;
          throw response;
        }),
        catchError((err) => {
          this.systemService.loading(false);
          throw this.invokerUtils.processError(err, p.router, p.request);
        }),
      );
  }
}
