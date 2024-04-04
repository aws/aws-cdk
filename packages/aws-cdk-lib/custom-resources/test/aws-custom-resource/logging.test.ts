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

  test('selective with logHandlerEvent as false', () => {
    // GIVEN
    const logging = Logging.selective({
      logHandlerEvent: false,
    });

    // WHEN / THEN
    expect(logging._render()).toEqual({
      logHandlerEvent: false,
      logApiResponse: true,
      logResponseObject: true,
      logSdkVersion: true,
      logErrors: true,
    });
  });

  test('selective with logApiResponse as false', () => {
    // GIVEN
    const logging = Logging.selective({
      logApiResponse: false,
    });

    // WHEN / THEN
    expect(logging._render()).toEqual({
      logHandlerEvent: true,
      logApiResponse: false,
      logResponseObject: true,
      logSdkVersion: true,
      logErrors: true,
    });
  });

  test('selective with logResponseObject as false', () => {
    // GIVEN
    const logging = Logging.selective({
      logResponseObject: false,
    });

    // WHEN / THEN
    expect(logging._render()).toEqual({
      logHandlerEvent: true,
      logApiResponse: true,
      logResponseObject: false,
      logSdkVersion: true,
      logErrors: true,
    });
  });

  test('selective with logSdkVersion as false', () => {
    // GIVEN
    const logging = Logging.selective({
      logResponseObject: false,
    });

    // WHEN / THEN
    expect(logging._render()).toEqual({
      logHandlerEvent: true,
      logApiResponse: true,
      logResponseObject: true,
      logSdkVersion: false,
      logErrors: true,
    });
  });

  test('selective with logErrors as false', () => {
    // GIVEN
    const logging = Logging.selective({
      logErrors: false,
    });

    // WHEN / THEN
    expect(logging._render()).toEqual({
      logHandlerEvent: true,
      logApiResponse: true,
      logResponseObject: true,
      logSdkVersion: true,
      logErrors: false,
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
      logSdkVersion: true,
      logErrors: false,
    });
  });
});