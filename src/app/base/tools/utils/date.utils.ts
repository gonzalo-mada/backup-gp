import { Injectable } from '@angular/core';
import { CommonUtils } from './common.utils';

@Injectable({
  providedIn: 'root',
})
export class DateUtils {
  constructor() {}

  private commonUtils: CommonUtils = new CommonUtils();
  private jsonattr_full = ['date', 'month', 'year', 'hour', 'minute', 'second'];
  private jsonattr = ['date', 'month', 'year'];

  dateToJson(fecha: Date): Object | undefined {
    var output = undefined;
    if (fecha instanceof Date) {
      var date = fecha.getUTCDate();
      var month = fecha.getUTCMonth() + 1;
      var year = fecha.getFullYear();

      output = {
        date: (date < 10 ? `0${date}` : date).toString(),
        month: (month < 10 ? `0${month}` : month).toString(),
        year: year.toString(),
      };
    }
    return output;
  }

  dateToJson_Full(fecha: Date): Object | undefined {
    var output = undefined;
    if (fecha instanceof Date) {
      var date = fecha.getUTCDate();
      var month = fecha.getUTCMonth() + 1;
      var year = fecha.getFullYear();
      var hour = fecha.getHours();
      var minute = fecha.getMinutes();
      var second = fecha.getSeconds();

      output = {
        date: (date < 10 ? `0${date}` : date).toString(),
        month: (month < 10 ? `0${month}` : month).toString(),
        year: year.toString(),
        hour: (hour < 10 ? `0${hour}` : hour).toString(),
        minute: (minute < 10 ? `0${minute}` : minute).toString(),
        second: (second < 10 ? `0${second}` : second).toString(),
      };
    }
    return output;
  }

  dateToNumber(fecha: Date): Number | undefined {
    var output = undefined;
    if (fecha instanceof Date) {
      var date = fecha.getUTCDate();
      var month = fecha.getUTCMonth() + 1;
      var year = fecha.getFullYear();

      output = parseInt(
        `${year}${month < 10 ? '0' + month : month}${
          date < 10 ? '0' + date : date
        }`,
      );
    }
    return output;
  }

  dateToString(fecha: Date): String | undefined {
    var output = undefined;
    if (fecha instanceof Date) {
      var date = fecha.getUTCDate();
      var month = fecha.getUTCMonth() + 1;
      var year = fecha.getFullYear();

      output = `${year}-${month < 10 ? '0' + month : month}-${
        date < 10 ? '0' + date : date
      }`;
    }
    return output;
  }

  dateToString_Full(fecha: Date): string | undefined {
    var output = undefined;
    if (fecha instanceof Date) {
      var date = fecha.getUTCDate();
      var month = fecha.getUTCMonth() + 1;
      var year = fecha.getFullYear();
      var hour = fecha.getHours();
      var minute = fecha.getMinutes();
      var second = fecha.getSeconds();

      output = `${year}-${month < 10 ? '0' + month : month}-${
        date < 10 ? '0' + date : date
      } ${hour < 10 ? '0' + hour : hour}:${
        minute < 10 ? '0' + minute : minute
      }:${second < 10 ? '0' + second : second}`;
    }
    return output;
  }

  jsonToDate(json: any): Date | undefined {
    var output = undefined;
    if (json && typeof json === 'object') {
      if (
        this.commonUtils.arraysHaveSameElements(
          Object.getOwnPropertyNames(json),
          this.jsonattr,
        ) &&
        this.checkJsonAllDataIsNumber(json)
      ) {
        output = new Date(
          parseInt(json.year),
          parseInt(json.month) - 1,
          parseInt(json.date),
          0,
          0,
          0,
          0,
        );
      }
    }
    return output;
  }

  jsonToDate_Full(json: any): Date | undefined {
    var output = undefined;
    if (json && typeof json === 'object') {
      if (
        this.commonUtils.arraysHaveSameElements(
          Object.getOwnPropertyNames(json),
          this.jsonattr_full,
        ) &&
        this.checkJsonAllDataIsNumber(json)
      ) {
        output = new Date(
          parseInt(json.year),
          parseInt(json.month) - 1,
          parseInt(json.date),
          parseInt(json.hour),
          parseInt(json.minute),
          parseInt(json.second),
          0,
        );
      }
    }
    return output;
  }

  jsonToNumber(json: any): Number | undefined {
    var output = undefined;
    if (json && typeof json === 'object') {
      if (
        this.commonUtils.arraysHaveSameElements(
          Object.getOwnPropertyNames(json),
          this.jsonattr,
        ) &&
        this.checkJsonAllDataIsNumber(json)
      ) {
        var date = parseInt(json.date);
        var month = parseInt(json.month);
        output = parseInt(
          `${json.year}${month < 10 ? '0' + month : month}${
            date < 10 ? '0' + date : date
          }`,
        );
      }
    }
    return output;
  }

  jsonToString(json: any): String | undefined {
    var output = undefined;
    if (json && typeof json === 'object') {
      if (
        this.commonUtils.arraysHaveSameElements(
          Object.getOwnPropertyNames(json),
          this.jsonattr,
        ) &&
        this.checkJsonAllDataIsNumber(json)
      ) {
        var date = parseInt(json.date);
        var month = parseInt(json.month);
        output = `${json.year}-${month < 10 ? '0' + month : month}-${date < 10 ? '0' + date : date}`;
      }
    }
    return output;
  }

  jsonToString_Full(json: any): String | undefined {
    var output = undefined;
    if (json && typeof json === 'object') {
      if (
        this.commonUtils.arraysHaveSameElements(
          Object.getOwnPropertyNames(json),
          this.jsonattr_full,
        ) &&
        this.checkJsonAllDataIsNumber(json)
      ) {
        var date = parseInt(json.date);
        var month = parseInt(json.month);
        var hour = parseInt(json.hour);
        var minute = parseInt(json.minute);
        var second = parseInt(json.second);
        output = `${json.year}-${month < 10 ? '0' + month : month}-${date < 10 ? '0' + date : date} ${hour < 10 ? '0' + hour : hour}:${minute < 10 ? '0' + minute : minute}:${second < 10 ? '0' + second : second}`;
      }
    }
    return output;
  }

  numberToDate(num: number): Date | undefined {
    var output = undefined;
    if (typeof num === 'number') {
      var s = num.toString();
      if (s.length === 8) {
        output = new Date(
          `${s.substring(0, 4)}-${s.substring(4, 6)}-${s.substring(6, 8)}`,
        );
      }
    }
    return output;
  }

  numberToString(num: number): String | undefined {
    var output = undefined;
    if (typeof num === 'number') {
      var s = num.toString();
      if (s.length === 8) {
        output = `${s.substring(0, 4)}-${s.substring(4, 6)}-${s.substring(6, 8)}`;
      }
    }
    return output;
  }

  numberToJson(num: number): Object | undefined {
    var output = undefined;
    if (typeof num === 'number') {
      var s = num.toString();
      if (s.length === 8) {
        output = {
          year: s.substring(0, 4),
          month: s.substring(4, 6),
          date: s.substring(6, 8),
        };
      }
    }
    return output;
  }

  private checkJsonAllDataIsNumber(json: any): boolean {
    if (typeof json !== 'object' || json === null) {
      return false;
    }
    for (const key in json) {
      if (isNaN(parseInt(json[key]))) {
        return false;
      }
    }
    return true;
  }
}
