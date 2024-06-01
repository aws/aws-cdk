import { Logging } from '../../lib/aws-custom-resource/logging';

describe('render logging', () => {
  test('all', () => {
    // GIVEN
    const logging = Logging.all();

    // WHEN/THEN
    expect(logging._render()).toEqual({});
  });

  test('with data hidden', () => {
    // GIVEN
    const logging = Logging.withDataHidden();

    // WHEN/THEN
    expect(logging._render()).toEqual({
      logApiResponseData: false,
    });
  });
});