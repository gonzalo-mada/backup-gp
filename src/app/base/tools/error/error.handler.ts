import { ErrorHandler, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { ErrorTemplate } from '../../models/error-template';
import { SystemService } from '../../services/system.service';
import { SentryService } from 'src/app/base/services/sentry.service';
import { environment } from 'src/environments/environment';

const notifyMethods = ['page', 'alert', 'none'];
const notifyMethodDefault = 'page';
declare var jasmine: any;

@Injectable({
  providedIn: `root`,
})
export class ErrorTemplateHandler implements ErrorHandler {
  constructor(
    private systemService: SystemService,
    private sentryService: SentryService,
    private router: Router,
  ) {}

  private production: boolean = environment.production;
  private  isTestEnvironment = typeof jasmine !== 'undefined';
  private errorSubject = new Subject<object>();
  error$ = this.errorSubject.asObservable();

  handleError(error: any | ErrorTemplate): void {
    this.systemService.loading(false);
    this.systemService.mainLoading(false);
    var err: ErrorTemplate = this.verifyError(error);
    this.errorSubject.next(err);
    if (!this.production && !this.isTestEnvironment) console.error(err);
  }

  processError(
    error: any | ErrorTemplate,
    options?: { notifyMethod?: string; summary?: string; message?: string },
  ): void {
    var err: ErrorTemplate = this.verifyError(error);
    if (!err.getIsToken()) {
      var opt = this.proccessOptions(err, options);
      if (opt.message) err.setMessage(opt.message);
      if (opt.notifyMethod) err.setNotifyMethod(opt.notifyMethod);
      if (opt.summary) err.setSummary(opt.summary);
    }

    this.handleError(err);
  }

  private verifyError(error: any | ErrorTemplate): ErrorTemplate {
    var err!: ErrorTemplate;
    if (!(error instanceof ErrorTemplate)) {
      err = new ErrorTemplate(error, null, this.router);
      err = this.sentryService.captureException(err, err.getError());
    } else {
      err = error;
    }
    return err;
  }

  private proccessOptions(
    error: ErrorTemplate,
    options?: { notifyMethod?: string; summary?: string; message?: string },
  ): { notifyMethod?: string; summary?: string; message?: string } {
    var output: any = {
      notifyMethod: notifyMethodDefault,
      summary: null,
      message: null,
    };

    if (options) {
      if (
        options.hasOwnProperty('notifyMethod') &&
        options.notifyMethod &&
        options.notifyMethod != '' &&
        notifyMethods.includes(options.notifyMethod)
      ) {
        output.notifyMethod = options.notifyMethod;
      }
      if (
        options.hasOwnProperty('summary') &&
        options.summary &&
        options.summary != ''
      ) {
        output.summary = options.summary;
      }
      if (
        options.hasOwnProperty('message') &&
        options.message &&
        options.message != ''
      ) {
        output.message = options.message;
      }
    }

    if (error.getDetail().timeout) {
      output.message = 'Tiempo de espera excedido (timeout)';
    }

    return output;
  }
}
