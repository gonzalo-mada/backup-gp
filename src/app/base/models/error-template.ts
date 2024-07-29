import { Router } from '@angular/router';
import sessionIgnore from '../tools/error/session-ignore.json';

import { TimeoutError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

export class ErrorTemplate {
  private detail!: any;
  private captureSentry: boolean = false;
  private error!: Error | TimeoutError;
  private isToken: boolean = false;
  private notifyMethod: string = 'page';

  constructor(data: any, request: any, router: Router) {
    if (data instanceof TimeoutError) {
      this.setTimeoutError(data, request, router);
    } else if (data instanceof HttpErrorResponse) {
      this.setServerError(data, request, router);
    } else if (!(data instanceof Error)) {
      this.setBackendError(data, request, router);
    } else {
      this.setError(data, router);
    }
    this.isToken = this.isTokenError(this.error);
    if (this.isToken) this.captureSentry = false;
  }

  getError(): Error {
    return this.detail.error;
  }

  getDetail(): any {
    return this.detail;
  }

  getCaptureSentry(): boolean {
    return this.captureSentry;
  }

  getIsToken(): boolean {
    return this.isToken;
  }

  getNotifyMethod(): string {
    return this.notifyMethod;
  }

  setMessage(msgs: string): void {
    this.detail.error.message = msgs;
  }

  setCaptureSentry(captured: boolean): void {
    this.captureSentry = captured;
  }

  setNotifyMethod(notifyMethod: string): void {
    this.notifyMethod = notifyMethod;
  }

  setSummary(summary: string): void {
    this.detail.summary = summary;
  }

  // PRIVATE METHODS

  private setServerError(
    error: HttpErrorResponse,
    request: any,
    router: Router,
  ): void {
    this.error = new Error(error.message);
    this.detail = {
      router: router.url,
      request: request,
      error: error,
      timeout: false,
      summary: null,
    };
  }

  private setBackendError(error: any, request: any, router: Router): void {
    this.error = new Error(error.message);
    this.detail = {
      router: router.url,
      request: request,
      error: {
        name: 'DticErrorResponse',
        type: error.type,
        message: error.message,
        level: error.level,
        trace: error.trace,
      },
      timeout: false,
      summary: null,
    };
  }

  private setTimeoutError(
    error: TimeoutError,
    request: any,
    router: Router,
  ): void {
    this.error = error;
    this.detail = {
      router: router.url,
      request: request,
      error: error,
      timeout: true,
      summary: null,
    };
  }

  private setError(error: any, router: Router): void {
    this.error = new Error(error.message);
    this.detail = {
      router: router.url,
      error: error,
      timeout: false,
      summary: null,
    };
  }

  private isTokenError(error: any): boolean {
    var message = '';
    var stack = '';
    var name = '';

    if (error.message) message = error.message;
    if (error.stack) stack = error.stack;
    if (error.name) name = error.name;

    return sessionIgnore.some(
      (e: any) =>
        message.toString().includes(e.toString()) ||
        stack.toString().includes(e.toString()) ||
        name.toString().includes(e.toString()),
    );
  }
}
