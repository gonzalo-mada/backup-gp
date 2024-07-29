import { Injectable } from '@angular/core';
import { base_config } from '../configs/main';
import { project_config } from '../../project/configs/main';
import { CommonUtils } from '../tools/utils/common.utils';

declare var $: any;

@Injectable({
  providedIn: 'root',
})
export class InitService {
  private config: any = {};
  private commonUtils: CommonUtils = new CommonUtils();

  load(): Promise<Object> {
    return new Promise((success) => {
      var pJson = this.commonUtils.esJSON(project_config);
      this.config = Object.assign({}, base_config);
      if (pJson) $.extend(true, this.config, base_config, project_config);
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
