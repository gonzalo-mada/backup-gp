import { TestBed } from '@angular/core/testing';
import { DateUtils } from '../date.utils';

describe('DateUtils (UTILS)', () => {
  let service: DateUtils;

  var _number = 20240402;
  var _badNumber = 2024040212332423;
  var _string_1 = '2024-04-02';
  var _string_2 = '2024-11-15';
  var _json = { date: '02', month: '04', year: '2024' };
  var _json_2 = { date: '15', month: '11', year: '2024' };
  var _badJson = { dia: '02', month: '04', year: '2024' };
  var _json_full = {
    date: '02',
    month: '04',
    year: '2024',
    hour: '10',
    minute: '11',
    second: '12',
  };
  var _json_full_2 = {
    date: '15',
    month: '11',
    year: '2024',
    hour: '08',
    minute: '07',
    second: '06',
  };
  var _badJson_full = {
    dia: '02',
    month: '04',
    year: '2024',
    hour: '10',
    minute: '11',
    second: '12',
  };
  var _badJson2 = {
    date: 2,
    month: '04',
    year: 'asdasdas',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DateUtils);
  });

  it('[1] Es creado', () => {
    expect(service).toBeTruthy();
  });

  it('[2] Date to JSON: dateToJson() :: con fecha (yyyy-mm-dd) :: mes/dia < 10', () => {
    const fecha = new Date(_string_1);
    const json = service.dateToJson(fecha);
    expect(json?.hasOwnProperty('date')).toBeTrue();
    expect(json?.hasOwnProperty('month')).toBeTrue();
    expect(json?.hasOwnProperty('year')).toBeTrue();
    expect(json).toEqual({
      date: '02',
      month: '04',
      year: '2024',
    });
  });

  it('[3] Date to JSON: dateToJson() :: con fecha (yyyy-mm-dd) :: mes/dia >= 10', () => {
    const fecha = new Date(_string_2);
    const json = service.dateToJson(fecha);
    expect(json?.hasOwnProperty('date')).toBeTrue();
    expect(json?.hasOwnProperty('month')).toBeTrue();
    expect(json?.hasOwnProperty('year')).toBeTrue();
    expect(json).toEqual({
      date: '15',
      month: '11',
      year: '2024',
    });
  });

  it('[4] Date to JSON (FULL): dateToJson_Full() :: con fecha (yyyy-mm-dd) :: mes/dia < 10', () => {
    const fecha = new Date(2024, 3, 2, 0, 0, 0, 0);
    const json = service.dateToJson_Full(fecha);
    expect(json?.hasOwnProperty('date')).toBeTrue();
    expect(json?.hasOwnProperty('month')).toBeTrue();
    expect(json?.hasOwnProperty('year')).toBeTrue();
    expect(json?.hasOwnProperty('hour')).toBeTrue();
    expect(json?.hasOwnProperty('minute')).toBeTrue();
    expect(json?.hasOwnProperty('second')).toBeTrue();
    expect(json).toEqual({
      date: '02',
      month: '04',
      year: '2024',
      hour: '00',
      minute: '00',
      second: '00',
    });
  });

  it('[5] Date to JSON (FULL): dateToJson_Full() :: con fecha (yyyy-mm-dd) :: mes/dia >= 10', () => {
    const fecha = new Date(2024, 10, 15, 0, 0, 0, 0);
    const json = service.dateToJson_Full(fecha);
    expect(json?.hasOwnProperty('date')).toBeTrue();
    expect(json?.hasOwnProperty('month')).toBeTrue();
    expect(json?.hasOwnProperty('year')).toBeTrue();
    expect(json?.hasOwnProperty('hour')).toBeTrue();
    expect(json?.hasOwnProperty('minute')).toBeTrue();
    expect(json?.hasOwnProperty('second')).toBeTrue();
    expect(json).toEqual({
      date: '15',
      month: '11',
      year: '2024',
      hour: '00',
      minute: '00',
      second: '00',
    });
  });

  it('[6] Date to JSON (FULL): dateToJson_Full() :: con fecha full (yyyy-mm-dd hh:mm:ss)', () => {
    const fecha = new Date(2024, 3, 2, 10, 11, 12, 0);
    const json = service.dateToJson_Full(fecha);
    expect(json?.hasOwnProperty('date')).toBeTrue();
    expect(json?.hasOwnProperty('month')).toBeTrue();
    expect(json?.hasOwnProperty('year')).toBeTrue();
    expect(json?.hasOwnProperty('hour')).toBeTrue();
    expect(json?.hasOwnProperty('minute')).toBeTrue();
    expect(json?.hasOwnProperty('second')).toBeTrue();
    expect(json).toEqual({
      date: '02',
      month: '04',
      year: '2024',
      hour: '10',
      minute: '11',
      second: '12',
    });
  });

  it('[7] Date to Number (yyyymmdd): dateToNumber() :: con fecha (yyyy-mm-dd) :: mes/dia < 10', () => {
    const fecha = new Date(_string_1);
    const number = service.dateToNumber(fecha);
    expect(number).not.toBeNaN();
    expect(number).toEqual(20240402);
  });

  it('[8] Date to Number (yyyymmdd): dateToNumber() :: con fecha (yyyy-mm-dd) :: mes/dia >= 10', () => {
    const fecha = new Date(_string_2);
    const number = service.dateToNumber(fecha);
    expect(number).not.toBeNaN();
    expect(number).toEqual(20241115);
  });

  it('[9] Date to String (yyyy-mm-dd): dateToString() :: con fecha (yyyy-mm-dd) :: mes/dia < 10', () => {
    const fecha = new Date(_string_1);
    const string = service.dateToString(fecha);
    expect(string).toEqual('2024-04-02');
  });

  it('[10] Date to String (yyyy-mm-dd): dateToString() :: con fecha (yyyy-mm-dd) :: mes/dia >= 10', () => {
    const fecha = new Date(_string_2);
    const string = service.dateToString(fecha);
    expect(string).toEqual('2024-11-15');
  });

  it('[11] Date to String (yyyy-mm-dd): dateToString() :: con fecha full (yyyy-mm-dd hh:mm:ss)', () => {
    const fecha = new Date(2024, 10, 15, 0, 0, 0, 0);
    const string = service.dateToString(fecha);
    expect(string).toEqual('2024-11-15');
  });

  it('[12] Date to String Full (yyyy-mm-dd hh:mm:ss): dateToString() :: con fecha full (yyyy-mm-dd hh:mm:ss) :: mes/dia < 10', () => {
    const fecha = new Date(2024, 3, 2, 10, 11, 12, 0);
    const string = service.dateToString_Full(fecha);
    expect(string).toEqual('2024-04-02 10:11:12');
  });

  it('[13] Date to String Full (yyyy-mm-dd hh:mm:ss): dateToString() :: con fecha full (yyyy-mm-dd hh:mm:ss) :: mes/dia >= 10', () => {
    const fecha = new Date(2024, 10, 15, 10, 11, 12, 0);
    const string = service.dateToString_Full(fecha);
    expect(string).toEqual('2024-11-15 10:11:12');
  });

  it('[14] Date to String Full (yyyy-mm-dd hh:mm:ss): dateToString() :: con fecha full (yyyy-mm-dd hh:mm:ss) :: mes/dia >= 10 :: hora/minuto/segundo < 10', () => {
    const fecha = new Date(2024, 10, 15, 7, 6, 5, 0);
    const string = service.dateToString_Full(fecha);
    expect(string).toEqual('2024-11-15 07:06:05');
  });

  it('[15] Date to String Full (yyyy-mm-dd hh:mm:ss): dateToString() :: con fecha (yyyy-mm-dd) ', () => {
    const fecha = new Date(2024, 3, 2, 0, 0, 0, 0);
    const string = service.dateToString_Full(fecha);
    expect(string).toEqual('2024-04-02 00:00:00');
  });

  it('[16] JSON to Date: jsonToDate() :: OK', () => {
    const date: Date | undefined = service.jsonToDate(_json);
    expect(date instanceof Date).toBeTrue();
    if (date) {
      expect(date?.getFullYear()).toEqual(parseInt(_json.year));
      expect(date?.getUTCMonth() + 1).toEqual(parseInt(_json.month));
      expect(date?.getUTCDate()).toEqual(parseInt(_json.date));
    }
  });

  it('[17] JSON to Date: jsonToDate() :: BAD JSON', () => {
    const date: Date | undefined = service.jsonToDate(_badJson);
    expect(typeof date).toBe('undefined');
  });

  it('[18] JSON Full to Date: jsonToDate_Full() :: OK', () => {
    const date: Date | undefined = service.jsonToDate_Full(_json_full);
    expect(date instanceof Date).toBeTrue();
    if (date) {
      expect(date?.getFullYear()).toEqual(parseInt(_json_full.year));
      expect(date?.getUTCMonth() + 1).toEqual(parseInt(_json_full.month));
      expect(date?.getUTCDate()).toEqual(parseInt(_json_full.date));
      expect(date?.getHours()).toEqual(parseInt(_json_full.hour));
      expect(date?.getMinutes()).toEqual(parseInt(_json_full.minute));
      expect(date?.getSeconds()).toEqual(parseInt(_json_full.second));
    }
  });

  it('[19] JSON Full to Date: jsonToDate_Full() :: BAD JSON', () => {
    const date = service.jsonToDate_Full(_badJson_full);
    expect(typeof date).toBe('undefined');
  });

  it('[20] JSON to Number: jsonToNumber() :: OK :: mes/dia < 10', () => {
    const number = service.jsonToNumber(_json);
    expect(number).not.toBeNaN();
    expect(number).toEqual(20240402);
  });

  it('[21] JSON to Number: jsonToNumber() :: OK :: mes/dia >= 10', () => {
    const number = service.jsonToNumber(_json_2);
    expect(number).not.toBeNaN();
    expect(number).toEqual(20241115);
  });

  it('[22] JSON to Number: jsonToNumber() :: BAD JSON', () => {
    const number = service.jsonToNumber(_badJson);
    expect(typeof number).toBe('undefined');
  });

  it('[23] JSON to String (yyyy-mm-dd): jsonToString() :: OK :: mes/dia < 10', () => {
    const string = service.jsonToString(_json);
    expect(string).toEqual('2024-04-02');
  });

  it('[24] JSON to String (yyyy-mm-dd): jsonToString() :: OK :: mes/dia >= 10', () => {
    const string = service.jsonToString(_json_2);
    expect(string).toEqual('2024-11-15');
  });

  it('[25] JSON to String (yyyy-mm-dd): jsonToString() :: BAD JSON', () => {
    const string = service.jsonToString(_badJson);
    expect(typeof string).toBe('undefined');
  });

  it('[26] JSON to String Full (yyyy-mm-dd hh:mm:ss): jsonToString_Full() :: OK :: mes/dia < 10', () => {
    const string = service.jsonToString_Full(_json_full);
    expect(string).toEqual('2024-04-02 10:11:12');
  });

  it('[27] JSON to String Full (yyyy-mm-dd hh:mm:ss): jsonToString_Full() :: OK :: mes/dia >= 10 :: hora/minuto/segundo < 10 ', () => {
    const string = service.jsonToString_Full(_json_full_2);
    expect(string).toEqual('2024-11-15 08:07:06');
  });

  it('[28] JSON to String Full (yyyy-mm-dd hh:mm:ss)): jsonToString_Full() :: BAD JSON', () => {
    const string = service.jsonToString_Full(_badJson);
    expect(typeof string).toBe('undefined');
  });

  it('[29] Number to Date: numberToDate() :: OK', () => {
    const date = service.numberToDate(_number);
    expect(date instanceof Date).toBeTrue();
    if (date) {
      expect(date?.getFullYear()).toEqual(parseInt(_json.year));
      expect(date?.getUTCMonth() + 1).toEqual(parseInt(_json.month));
      expect(date?.getUTCDate()).toEqual(parseInt(_json.date));
    }
  });

  it('[30] Number to Date: numberToDate() :: BAD NUMBER', () => {
    const date = service.numberToDate(_badNumber);
    expect(typeof date).toBe('undefined');
  });

  it('[31] Number to Json: numberToJson() :: OK', () => {
    const json = service.numberToJson(_number);
    expect(json?.hasOwnProperty('date')).toBeTrue();
    expect(json?.hasOwnProperty('month')).toBeTrue();
    expect(json?.hasOwnProperty('year')).toBeTrue();
    expect(json).toEqual({
      date: '02',
      month: '04',
      year: '2024',
    });
  });

  it('[32] Number to Json: numberToJson() :: BAD NUMBER', () => {
    const json = service.numberToJson(_badNumber);
    expect(typeof json).toBe('undefined');
  });

  it('[33] Number to String: numberToString() :: OK', () => {
    const string = service.numberToString(_number);
    expect(string).toEqual('2024-04-02');
  });

  it('[34] Number to tring: numberToString() :: BAD NUMBER', () => {
    const string = service.numberToString(_badNumber);
    expect(typeof string).toBe('undefined');
  });

  it('[35] Verifica que todos los datos de un json sean numeros: checkJsonAllDataIsNumber() :: true', () => {
    const boolean = service['checkJsonAllDataIsNumber'](_json);
    expect(boolean).toBeTrue();
  });

  it('[36] Verifica que todos los datos de un json sean numeros: checkJsonAllDataIsNumber() :: false :: no json', () => {
    const boolean = service['checkJsonAllDataIsNumber'](_string_1);
    expect(boolean).toBeFalse();
  });

  it('[37] Verifica que todos los datos de un json sean numeros: checkJsonAllDataIsNumber() :: false :: data no number', () => {
    const boolean = service['checkJsonAllDataIsNumber'](_badJson2);
    expect(boolean).toBeFalse();
  });
});
