import { CommonUtils } from '../../tools/utils/common.utils';

export class DateUtilsMock {
  private commonUtils: CommonUtils = new CommonUtils();
  private jsonattr_full = ['date', 'month', 'year', 'hour', 'minute', 'second'];
  private jsonattr = ['date', 'month', 'year'];

  dateToJson(fecha: Date): Object | undefined {
    return { date: '01', month: '01', year: '2022' };
  }

  dateToJson_Full(fecha: Date): Object | undefined {
    return {
      date: '01',
      month: '01',
      year: '2022',
      hour: '00',
      minute: '00',
      second: '00',
    };
  }

  dateToNumber(fecha: Date): Number | undefined {
    return 20220101;
  }

  dateToString(fecha: Date): String | undefined {
    return '2022-01-01';
  }

  dateToString_Full(fecha: Date): string | undefined {
    return '2022-01-01 00:00:00';
  }

  jsonToDate(json: any): Date | undefined {
    return new Date('2022-01-01T00:00:00Z');
  }

  jsonToDate_Full(json: any): Date | undefined {
    return new Date('2022-01-01T00:00:00Z');
  }

  jsonToNumber(json: any): Number | undefined {
    return 20220101;
  }

  jsonToString(json: any): String | undefined {
    return '2022-01-01';
  }

  jsonToString_Full(json: any): String | undefined {
    return '2022-01-01 00:00:00';
  }

  numberToDate(num: number): Date | undefined {
    return new Date('2022-01-01T00:00:00Z');
  }

  numberToString(num: number): String | undefined {
    return '2022-01-01';
  }

  numberToJson(num: number): Object | undefined {
    return { year: '2022', month: '01', date: '01' };
  }

  private checkJsonAllDataIsNumber(json: any): boolean {
    return true;
  }
}
