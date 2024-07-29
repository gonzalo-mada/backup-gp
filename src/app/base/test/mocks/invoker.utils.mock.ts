import { Router } from '@angular/router';
import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ErrorTemplate } from '../../models/error-template';

@Injectable()
export class InvokerUtilsMock {
  private timeoutDF: number = 5000;
  private retryDF: number = 3;

  processResponse(
    request: any,
    response: any,
    router: Router,
  ): any | ErrorTemplate {
    if (response.status === 'OK') {
      return response.data;
    } else {
      return this.processError(response.error, request, router);
    }
  }

  async processReport(
    request: any,
    response: any,
    router: Router,
    format?: string,
  ): Promise<Blob | ErrorTemplate> {
    try {
      var res = await response.text();
      var object = JSON.parse(res);
      var isJson: any = this.esJSON(object);
      if (!isJson) {
        return new Blob([response], {
          type: `application/pdf`,
        });
      } else {
        return this.processError(object.error, request, router);
      }
    } catch (e) {
      return new Blob([response], {
        type: `application/pdf`,
      });
    }
  }

  processError(error: any, request: any, router: Router): ErrorTemplate {
    return error instanceof ErrorTemplate
      ? error
      : new ErrorTemplate(error, null, { url: '/' } as Router);
  }

  prepareInvokerData(
    backend: string,
    serviceData: string | { service: string; timeout?: number; retry?: number },
    router: Router,
    params?: object | undefined,
  ): any {
    const service = this.setService(serviceData);
    const headers = this.getHeaders();
    const url = `${backend}/${service.service}`;
    const param = this.setParams(params);
    const request = this.getRequest(headers, url, params);

    return {
      service: service,
      router: router,
      headers: headers,
      request: request,
      url: url,
      params: param,
    };
  }

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
    return {
      service:
        typeof serviceData === 'string' ? serviceData : serviceData.service,
      timeout: (typeof serviceData === 'string'
        ? this.timeoutDF
        : serviceData.hasOwnProperty('timeout')
          ? serviceData.timeout
          : this.timeoutDF) as number,
      retry: (typeof serviceData === 'string'
        ? this.retryDF
        : serviceData.hasOwnProperty('retry')
          ? serviceData.retry
          : this.retryDF) as number,
      loading: (typeof serviceData === 'string'
        ? true
        : serviceData.hasOwnProperty('loading')
          ? serviceData.loading
          : true) as boolean,
    };
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
      .set(
        'Authorization',
        `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoibk1aWWJ3TGd1ZGZ0elNlclp6WEY5dz09X05oeEVDa20xdGpONFMxRGxwOE92TlRNUWpac2Yrb0dKWHFMSTl6UjJaQkd6YVh6S045bmxKUkxqalczTjc2dVJ4TWh1WWlWbERiaDYrVHh0VnBnUjlHeHV2bkpMMHI5YnRLRGVKSlgvSEFVSlJGZFVuaVQ0TnBURlphdlRHb0VnalI5d25BUElZNkN0byt1WHdhUm5pV2U1T3JmTkxOS3JibWpFRVhWQzI0UWQ5Z3RrSjV6ZXZ5dVQyMHVqTHFra1kyWUhpYlRYaUNtWXVUdlVMcGtUcjJlNE5zZWpNb09YS1d5cHNISmw2US8wblhhbTRuQVd5N1dYZDUxV0d2bEZHaTIwYm9LdG9seU0rcy9oc3YwaFZxd1N5UFR2REtKaXBpaDFlWnRsMFpXU2ZlY2s3R1I5bkVhREczNnBHZzYrL2J6dXNqUEthRk82SVgxczZLQStnUnIvSkhiazJ4aVluVHJqbnRMUkRNQ0FPRTlJV1JpN3hiWFo4Qm56N0E0NUNDZmJOQitmSFBJK2lvSlpSR1loVkdXSlROcWYzbTJEMlhEa0lXRmdFc25BU2RhV1JrSHJ4Sm9LbjZFakxxUEFvMWRqTFUwc1JwRWJJUHZjR0ZORlZPMHN4M0U0WE5pMzhTa3R4K0Y5a3Boc1Nady9CZGp4cDVMOVFYN1VNQWlzZmVlZU9LK09sMnErVUpZVjJNclVWRisyVVlhSmdOcWFTK2s2RlZGQXBPbG1CZjlocktBcVdvS0xsUFZXUXl0amNuSU9YZk02YnNScVdGRU5ESVVrMEFnV0ZUb1QreE5pdkV4RnNFQXh4cXQ4OEZUYnJobVRJSWJDTDNBd0F2SkQ3bUJYcEpNQlo1YkdmRW9kaUl5WmF5R1JNQmNRVGd1RmxxdzNIWGNQUG9ldEs0ZzJLcGM1d3N1Ykd3SG5Vd3Z1YUhsVDVjYW0yOCtUUTV2K2tQVEc3SGNQQzliYXVObG5YU0VaMmx3dWlmK1RqZUdqdlA0Mit0S1dDWnhPM0dmVzJsTXBKTWJsemNTWGk0UFlIR3ljalNZSXIwRTdwM1RQUzYyQ1FQcnpPdXE0ZEFUUmJDWHYvallVSmNjWkJKM2hZUWFsN0M5UHdDd0I0b1VHK3BGSSswWU5iN0RVRTRaLzMxWjZJV2g2QlZydHB0a2Fxa0x5MkxLZWtrZlFlQlhtaTJId1lMREpFWkFMZ1dscDJLN0FFTnFreEdudC9xdHkzaFQzbDN5dVFsRUxnU0RKRjIzMld3R21WWjR0UmFWUHE4eGIwUC81ZFJ1dFEzNk1wZkJHUERvYVRZVlhGcjRSOVVNS3RLaFJHcmZhM04rdTZ3a2VDUmFkTjZ1dm1xSUhIaWhZdjRtOWFQanNBVzl3SlhTQ0t1K3RNN0p5d0hMV2Jpa1djcVRTNVBmRGdQaUJPODkxKzVjWFRFV0IyZjFMVEFUTGdoMmVCaitxazh0UU9oMVNhdlNrY1A0bGdQY3QvNW5RSGttT3FwSU9UVXdyMjgwVlpxZzdvSFkxZ2ZHVVpLR09zMTRmNjArT0txVkt1cCsxdzc0czl5TUdKTTl5TjN3eTNnNkZZSExvSnhkMGdMY1BpSHQvNDhNdXBBZ1ZCUVQ3L015MysxZUZQcWw2bUxzMm1lOWozQThwd3ZPbUJseWJLa2dnY1BGUWZOYXRqMy9oY2syVmlTVFROTEtYbVNsWkUwTjNJeEszRTk2YkltZ2xUM1k5c3B0T0JaMm9CSzBVbWdnWUxjWnlJVDJ4enZ0c0J6OTJxUnhYdkQrZzBOc2pJTmxueW04WEtCQkliRFR3MndsVUE3ZFB3Z2wwbUhzclVjdHRlWG5TbG5qMHhkK1dTTkNxL3ljNTBuVGg1eUJpYzI3L1JKdXlnNzBjek9CWFFhTGY1em9MM1ZEZnUwYzJXN1p2R3BEcXRmRm4zODVOTTRnMm0wTEVtNEFPcXRDVDd1aUtuUzVRSW1Kd05Id0tXMmZrUEpHSE5EUnY4ZnVXa2EyZmZBZlNJbHduSFJMNHR1aHEwazFCY2dnNE54K2RkVEVRSi9KU0cwNWNMNzg5MmtOSXE5amMxNmN3dFB3VUpzNnptNmZZZmQ1RzE5TW1PY0IvZDV2VGprUkxmTmtCVFhPZXVlMnNhVllQcFhjM1hFRWNUNzRPVk1CQXA4b2xTSFQwb1c4VVpHdXVHOEVoUUJmMDJLVUxQRXlLTnZiTCtqWXgwdFZYcEtHRDd0RHV1a3MvRGVET29CZFJQdE5FM3NHL2tDOFU3cHdLbVpkZ1FrZVBmOUdYY3orTE8vY3V1UFNhMVJUb1ZveEloTmRobmE0NVUra0FVRXJiRDg1VVFnRWhXeVVxdktsK0ZmOFQ3Q0RWZGJlL0hFYWNHWG0rejJRdHZZZmIxMitrMytWem5zMjhKN3dYQ21obVN6VjdnKy8rVUtTUExWRkRtNHh6NU5RPSIsImlhdCI6MTcxMjU5MTk1M30.BflOjJxb2xHtriuFW2IHey8gRbFk--gm6spQ2c80nVU`,
      );
  }

  esJSON(objeto: any): boolean {
    if (typeof objeto === 'object') {
      try {
        JSON.stringify(objeto);
        return true;
      } catch (error) {
        return false;
      }
    } else {
      return false;
    }
  }
}
