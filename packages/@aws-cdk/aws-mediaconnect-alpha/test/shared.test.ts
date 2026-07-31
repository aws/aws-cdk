import { Token } from 'aws-cdk-lib';
import { Framerate, PixelAspectRatio, validateMaintenanceTime } from '../lib/shared';

// A resolved-at-deploy token value, e.g. from a CfnParameter. Synth-time validation
// must not run against the unresolved token marker.
const tokenNumber = Token.asNumber({ Ref: 'SomeNumberParameter' });
const tokenString = Token.asString({ Ref: 'SomeStringParameter' });

describe('Framerate.of', () => {
  test('accepts a valid literal rate', () => {
    expect(() => Framerate.of(30, 1)).not.toThrow();
  });

  test.each([0, -1, 1.5])('fails for invalid literal numerator %p', (numerator) => {
    expect(() => Framerate.of(numerator, 1)).toThrow(/numerator must be a positive integer/);
  });

  test.each([0, -1, 1.5])('fails for invalid literal denominator %p', (denominator) => {
    expect(() => Framerate.of(30, denominator)).toThrow(/denominator must be a positive integer/);
  });

  test('does not validate a tokenized numerator', () => {
    expect(() => Framerate.of(tokenNumber, 1)).not.toThrow();
  });

  test('does not validate a tokenized denominator', () => {
    expect(() => Framerate.of(30, tokenNumber)).not.toThrow();
  });
});

describe('PixelAspectRatio.of', () => {
  test('accepts a valid literal ratio', () => {
    expect(() => PixelAspectRatio.of(1, 1)).not.toThrow();
  });

  test.each([0, -1, 1.5])('fails for invalid literal numerator %p', (numerator) => {
    expect(() => PixelAspectRatio.of(numerator, 1)).toThrow(/numerator must be a positive integer/);
  });

  test.each([0, -1, 1.5])('fails for invalid literal denominator %p', (denominator) => {
    expect(() => PixelAspectRatio.of(1, denominator)).toThrow(/denominator must be a positive integer/);
  });

  test('does not validate a tokenized numerator', () => {
    expect(() => PixelAspectRatio.of(tokenNumber, 1)).not.toThrow();
  });

  test('does not validate a tokenized denominator', () => {
    expect(() => PixelAspectRatio.of(1, tokenNumber)).not.toThrow();
  });
});

describe('validateMaintenanceTime', () => {
  test.each(['00:00', '02:00', '23:00'])('accepts valid time %s', (time) => {
    expect(() => validateMaintenanceTime(time)).not.toThrow();
  });

  test.each(['02:30', '24:00', '2:00', 'noon'])('fails for invalid time %s', (time) => {
    expect(() => validateMaintenanceTime(time)).toThrow(/maintenance time must be in HH:00 format/i);
  });

  test('does not validate a tokenized time', () => {
    expect(() => validateMaintenanceTime(tokenString)).not.toThrow();
  });
});
