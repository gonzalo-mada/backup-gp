import { ErrorHandler } from '@angular/core';
import { Subject } from 'rxjs';
import { ErrorTemplate } from '../../models/error-template';
import { Router } from '@angular/router';

export class ErrorTemplateHandlerMock implements ErrorHandler {
  constructor() {}

  private errorSubject = new Subject<object>();
  error$ = this.errorSubject.asObservable();

  handleError(error: any | ErrorTemplate): void {
    this.errorSubject.next(error);
  }

  processError(
    error: any | ErrorTemplate,
    options?: { notifyMethod?: string; summary?: string; message?: string },
  ): void {
    this.handleError(error);
  }

  verifyError(error: any | ErrorTemplate): ErrorTemplate {
    return error instanceof ErrorTemplate
      ? error
      : new ErrorTemplate(error, null, { url: '/' } as Router);
  }

  proccessOptions(
    error: ErrorTemplate,
    options?: { notifyMethod?: string; summary?: string; message?: string },
  ): { notifyMethod?: string; summary?: string; message?: string } {
    return {
      notifyMethod: options?.notifyMethod,
      summary: options?.summary,
      message: error.getDetail().timeout
        ? 'Tiempo de espera excedido (timeout)'
        : options?.message,
    };
  }
}
