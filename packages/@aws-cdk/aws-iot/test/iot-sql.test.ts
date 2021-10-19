import * as cdk from '@aws-cdk/core';
import * as iot from '../lib';

describe('sql version 2015-10-08', () => {
  test('Can set iot sql', () => {
    const stack = new cdk.Stack();
    const iotSql = iot.IotSql.fromStringAsVer20151008("SELECT topic(2) as device_id FROM 'device/+/data'");
    expect(iotSql.bind(stack)).toEqual({
      sql: "SELECT topic(2) as device_id FROM 'device/+/data'",
      awsIotSqlVersion: '2015-10-08',
    });
  });

  test("Can't set empty sql", () => {
    expect(() => {
      iot.IotSql.fromStringAsVer20151008('');
    }).toThrow('sql cannot be empty.');
  });
});

describe('sql version 2016-03-23', () => {
  test('Can set iot sql', () => {
    const stack = new cdk.Stack();
    const iotSql = iot.IotSql.fromStringAsVer20160323("SELECT topic(2) as device_id FROM 'device/+/data'");
    expect(iotSql.bind(stack)).toEqual({
      sql: "SELECT topic(2) as device_id FROM 'device/+/data'",
      awsIotSqlVersion: '2016-03-23',
    });
  });

  test('Can\'t set empty sql', () => {
    expect(() => {
      iot.IotSql.fromStringAsVer20160323('');
    }).toThrow('sql cannot be empty.');
  });
});

describe('sql version newest unstable', () => {
  test('Can set iot sql', () => {
    const stack = new cdk.Stack();
    const iotSql = iot.IotSql.fromStringAsVerNewestUnstable("SELECT topic(2) as device_id FROM 'device/+/data'");
    expect(iotSql.bind(stack)).toEqual({
      sql: "SELECT topic(2) as device_id FROM 'device/+/data'",
      awsIotSqlVersion: 'beta',
    });
  });

  test('Can\'t set empty sql', () => {
    expect(() => {
      iot.IotSql.fromStringAsVerNewestUnstable('');
    }).toThrow('sql cannot be empty.');
  });
});
