import { strictEqual } from 'assert';
import { DailyAutomaticBackupStartTime } from '../lib';

test.each([
  [0, 0, '00:00'],
  [23, 59, '23:59'],
])('valid maintenance time %s:%d:%d returns %s', (hour: number, minute: number, expected: string) => {
  strictEqual(
    new DailyAutomaticBackupStartTime({ hour, minute }).toTimestamp(),
    expected,
  );
});

test.each([
  [-1, 0],
  [24, 0],
  [1.2, 0],
])('invalid dailyAutomaticBackupStartTime hour %d:%d', ( hour: number, minute: number) => {
  expect(() => {
    new DailyAutomaticBackupStartTime({ hour, minute });
  }).toThrow(`dailyAutomaticBackupStartTime hour must be an integer between 0 and 24. received: ${hour}`);
});

test.each([
  [0, -1],
  [0, 60],
  [0, 1.2],
])('invalid dailyAutomaticBackupStartTime minute %d:%d', (hour: number, minute: number) => {
  expect(() => {
    new DailyAutomaticBackupStartTime({ hour, minute });
  }).toThrow(`dailyAutomaticBackupStartTime minute must be an integer between 0 and 59. received: ${minute}`);
});
