import { Injectable } from '@angular/core';
import { ErrorTemplate } from '../../models/error-template';
import { HttpHeaders } from '@angular/common/http';
import { SentryService } from '../../services/sentry.service';
import { Router } from '@angular/router';
import { InitService } from '../../services/init.service';
import { WindowService } from '../../services/window.service';

@Injectable({
  providedIn: 'root',
})
export class InvokerUtils {
  constructor(
    private sentryService: SentryService,
    private config: InitService,
    private windowService: WindowService,
  ) {}

  private timeoutDF: number = this.config.get('system.backend.timeout');
  private retryDF: number = this.config.get('system.backend.retry');

  processResponse(
    request: any,
    response: any,
    router: Router,
  ): any | ErrorTemplate {
    var output;
    if (response.status === 'OK') {
      output = response.data;
    } else {
      output = this.processError(response.error, request, router);
    }
    return output;
  }

  async processReport(
    request: any,
    response: any,
    router: Router,
    format: string,
  ): Promise<Blob | ErrorTemplate> {
    var output;
    try {
      var err: any = JSON.parse(await response.text());
      output = this.processError(err.error, request, router);
    } catch (e) {
      var blobType = this.config.get(`reports.types.${format?.toLowerCase()}`);
      if (blobType) {
        output = new Blob([response], {
          type: `${this.config.get(`reports.types.${format?.toLowerCase()}`)}`,
        });
      } else {
        output = this.processError(
          new Error('no file type found'),
          request,
          router,
        );
      }
    }

    return output;
  }

  processError(error: any, request: any, router: Router): ErrorTemplate {
    if (!(error instanceof ErrorTemplate)) {
      error = new ErrorTemplate(error, request, router);
      error = this.sentryService.captureException(error, error.getError());
    }
    return error;
  }

  prepareInvokerData(
    backend: string,
    serviceData: string | { service: string; timeout?: number; retry?: number },
    router: Router,
    params?: object | undefined,
  ): {
    headers: HttpHeaders;
    service: object;
    router: Router;
    request: object;
    url: string;
    params: string;
  } {
    var service = this.setService(serviceData);
    var headers = this.getHeaders();
    var url = `${backend}/${service.service}`;
    var param = this.setParams(params);
    var request = this.getRequest(headers, url, params);

    return {
      service: service,
      router: router,
      headers: headers,
      request: request,
      url: url,
      params: param,
    };
  }

  // PRIVATE METHODS

  private setService(
    serviceData:
      | string
      | {
          service: string;
          timeout?: number;
          retry?: number;
          loading?: boolean;
        },
  ): { service: string; timeout: number; retry: number; loading: boolean } {
    var data: any = {
      service: null,
      timeout: this.timeoutDF,
      retry: this.retryDF,
      loading: true,
    };
    if (typeof serviceData === 'string') {
      data.service = serviceData;
    } else {
      data.service = serviceData.service;
      if (
        serviceData.hasOwnProperty('timeout') &&
        typeof serviceData.timeout === 'number'
      ) {
        data.timeout = serviceData.timeout;
      }
      if (
        serviceData.hasOwnProperty('retry') &&
        typeof serviceData.retry === 'number'
      ) {
        data.retry = serviceData.retry;
      }
      if (
        serviceData.hasOwnProperty('loading') &&
        typeof serviceData.loading === 'boolean'
      ) {
        data.loading = serviceData.loading;
      }
    }
    return data;
  }

  private setParams(params?: object | undefined): string {
    return `arg=${encodeURIComponent(JSON.stringify(params || {}))}`;
  }

  private getRequest(
    headers: HttpHeaders,
    url: string,
    params: object | undefined,
  ): {
    method: string;
    headers: { 'content-type'?: string | null; authorization?: string | null };
    params: object | undefined;
    service: string;
  } {
    return {
      method: 'POST',
      headers: {
        'content-type': headers.get('content-type'),
        authorization: headers.get('authorization'),
      },
      params: params,
      service: url,
    };
  }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders()
      .set('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8')
      .set('Authorization', this.windowService.getItemSessionStorage('token'));
  }
}
