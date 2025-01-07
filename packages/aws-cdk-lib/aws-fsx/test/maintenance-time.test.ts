import { strictEqual } from 'assert';
import { LustreMaintenanceTime, Weekday } from '../lib';

test.each([
  [Weekday.SUNDAY, 0, 0, '7:00:00'],
  [Weekday.SATURDAY, 0, 0, '6:00:00'],
  [Weekday.SUNDAY, 23, 0, '7:23:00'],
  [Weekday.SUNDAY, 0, 59, '7:00:59'],
])('valid maintenance time %s:%d:%d returns %s', (day: Weekday, hour: number, minute: number, expected: string) => {
  strictEqual(
    new LustreMaintenanceTime({ day, hour, minute }).toTimestamp(),
    expected,
  );
});

test.each([
  [Weekday.TUESDAY, -1, 0],
  [Weekday.TUESDAY, 24, 0],
  [Weekday.TUESDAY, 1.2, 0],
])('invalid maintenance time hour %s:%d:%d', (day: Weekday, hour: number, minute: number) => {
  expect(() => {
    new LustreMaintenanceTime({ day, hour, minute });
  }).toThrow('Maintenance time hour must be an integer between 0 and 23');
});

test.each([
  [Weekday.TUESDAY, 0, -1],
  [Weekday.TUESDAY, 0, 60],
  [Weekday.TUESDAY, 0, 1.2],
])('invalid maintenance time minute %s:%d:%d', (day: Weekday, hour: number, minute: number) => {
  expect(() => {
    new LustreMaintenanceTime({ day, hour, minute });
  }).toThrow('Maintenance time minute must be an integer between 0 and 59');
});
