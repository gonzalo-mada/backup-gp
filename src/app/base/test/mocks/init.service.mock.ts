import { Injectable } from '@angular/core';

@Injectable()
export class InitServiceMock {
  private config: any = {};

  constructor(config: any) {
    this.config = config;
  }

  load(): Promise<Object> {
    return new Promise((success) => {
      success(this.config);
    });
  }

  get(propPath?: string): any {
    if (propPath) {
      let props = propPath.split('.');
      let obj = JSON.parse(JSON.stringify(this.config));
      for (var i = 0; i < props.length; i++) {
        if (typeof obj[props[i]] == 'undefined') return undefined;
        obj = obj[props[i]];
      }
      return obj;
    } else return this.config;
  }
}
