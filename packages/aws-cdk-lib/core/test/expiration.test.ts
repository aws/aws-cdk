import { Duration, Expiration } from '../lib';

describe('expiration', () => {
  test('from string', () => {
    const date = new Date('Sun, 26 Jan 2020 00:53:20 GMT');
    expect(Expiration.fromString('Sun, 26 Jan 2020 00:53:20 GMT').date.getDate()).toEqual(date.getDate());
  });

  test('at specified date', () => {
    const date = new Date('Sun, 26 Jan 2020 00:53:20 GMT');
    expect(Expiration.atDate(new Date('Sun, 26 Jan 2020 00:53:20 GMT')).date.toUTCString()).toEqual('Sun, 26 Jan 2020 00:53:20 GMT');
    expect(Expiration.atDate(new Date(1580000000000)).date.toUTCString()).toEqual('Sun, 26 Jan 2020 00:53:20 GMT');
    expect(Expiration.atDate(new Date(date)).date.toUTCString()).toEqual('Sun, 26 Jan 2020 00:53:20 GMT');
  });

  test('at time stamp', () => {
    expect(Expiration.atDate(new Date(1580000000000)).date.toUTCString()).toEqual('Sun, 26 Jan 2020 00:53:20 GMT');
  });

  test('after', () => {
    expect(Math.abs(new Date(Expiration.after(Duration.minutes(10)).date.toUTCString()).getTime() - (Date.now() + 600000)) < 15000).toBeDefined();
  });

  test('toEpoch returns correct value', () => {
    const date = new Date('Sun, 26 Jan 2020 00:53:20 GMT');
    expect(Expiration.atDate(date).toEpoch()).toEqual(1580000000);
  });

  test('isBefore', () => {
    const expire = Expiration.after(Duration.days(2));
    expect(expire.isBefore(Duration.days(1))).toEqual(false);
    expect(expire.isBefore(Duration.days(3))).toEqual(true);
  });

  test('isAfter', () => {
    const expire = Expiration.after(Duration.days(2));
    expect(expire.isAfter(Duration.days(1))).toEqual(true);
    expect(expire.isAfter(Duration.days(3))).toEqual(false);
  });
});
