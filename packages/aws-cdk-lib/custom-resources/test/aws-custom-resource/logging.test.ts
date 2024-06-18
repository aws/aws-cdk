import { App, Stack } from '../../../core';
import { LOG_API_RESPONSE_DATA_PROPERTY_TRUE_DEFAULT } from '../../../cx-api';
import { Logging } from '../../lib/aws-custom-resource/logging';

describe('render logging', () => {
  test('all', () => {
    // GIVEN
    const stack = new Stack();
    const logging = Logging.all();

    // WHEN/THEN
    expect(logging._render(stack)).toEqual({});
  });

  test('all and log api response data true default feature flag set', () => {
    // GIVEN
    const app = new App({ postCliContext: { [LOG_API_RESPONSE_DATA_PROPERTY_TRUE_DEFAULT]: true } });
    const stack = new Stack(app, 'Stack');
    const logging = Logging.all();

    // WHEN/THEN
    expect(logging._render(stack)).toEqual({ logApiResponseData: true });
  });

  test('with data hidden', () => {
    // GIVEN
    const stack = new Stack();
    const logging = Logging.withDataHidden();

    // WHEN/THEN
    expect(logging._render(stack)).toEqual({ logApiResponseData: false });
  });

  test('with data hidden and log api response data true default feature flag set', () => {
    // GIVEN
    const app = new App({ postCliContext: { [LOG_API_RESPONSE_DATA_PROPERTY_TRUE_DEFAULT]: true } });
    const stack = new Stack(app, 'Stack');
    const logging = Logging.withDataHidden();

    // WHEN/THEN
    expect(logging._render(stack)).toEqual({ logApiResponseData: false });
  });
});
