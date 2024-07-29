import { Injectable, Injector } from '@angular/core';
import { ErrorTemplate } from '../../models/error-template';

@Injectable()
export class SentryServiceMock {
  constructor() {}

  captureException(error: ErrorTemplate, realError: any): ErrorTemplate {
    error.setCaptureSentry(true);
    return error;
  }
}
