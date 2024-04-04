import { Logging } from '../../lib/aws-custom-resource/logging';

describe('render logging', () => {
  test('on', () => {
    // GIVEN
    const logging = Logging.on();

    // WHEN/THEN
    expect(logging._render()).toEqual({
      logHandlerEvent: true,
      logApiResponse: true,
      logResponseObject: true,
      logSdkVersion: true,
      logErrors: true,
    });
  });

  test('selective with logHandlerEvent', () => {
    // GIVEN
    const logging = Logging.selective({
      logHandlerEvent: true,
    });

    // WHEN / THEN
    expect(logging._render()).toEqual({
      logHandlerEvent: true,
      logApiResponse: false,
      logResponseObject: false,
      logSdkVersion: false,
      logErrors: false,
    });
  });

  test('selective with logApiResponse', () => {
    // GIVEN
    const logging = Logging.selective({
      logApiResponse: true,
    });

    // WHEN / THEN
    expect(logging._render()).toEqual({
      logHandlerEvent: false,
      logApiResponse: true,
      logResponseObject: false,
      logSdkVersion: false,
      logErrors: false,
    });
  });

  test('selective with logResponseObject', () => {
    // GIVEN
    const logging = Logging.selective({
      logResponseObject: true,
    });

    // WHEN / THEN
    expect(logging._render()).toEqual({
      logHandlerEvent: false,
      logApiResponse: false,
      logResponseObject: true,
      logSdkVersion: false,
      logErrors: false,
    });
  });

  test('selective with logSdkVersion', () => {
    // GIVEN
    const logging = Logging.selective({
      logSdkVersion: true,
    });

    // WHEN / THEN
    expect(logging._render()).toEqual({
      logHandlerEvent: false,
      logApiResponse: false,
      logResponseObject: false,
      logSdkVersion: true,
      logErrors: false,
    });
  });

  test('selective with logErrors', () => {
    // GIVEN
    const logging = Logging.selective({
      logErrors: true,
    });

    // WHEN / THEN
    expect(logging._render()).toEqual({
      logHandlerEvent: false,
      logApiResponse: false,
      logResponseObject: false,
      logSdkVersion: false,
      logErrors: true,
    });
  });

  test('off', () => {
    // GIVEN
    const logging = Logging.off();

    // WHEN / THEN
    expect(logging._render()).toEqual({
      logHandlerEvent: false,
      logApiResponse: false,
      logResponseObject: false,
      logSdkVersion: false,
      logErrors: false,
    });
  });
});