import * as path from 'path';
import { Runtime } from '../../../aws-lambda';
import { CdkHandler } from '../../lib/handler-framework/cdk-handler';

describe('code from asset', () => {
  test('correctly sets compatibleRuntimes property', () => {
    // GIVEN
    const compatibleRuntimes = [Runtime.NODEJS_16_X, Runtime.NODEJS_18_X];

    // WHEN
    const code = CdkHandler.fromAsset(path.join(__dirname, 'test-handler'), {
      handler: 'index.handler',
      compatibleRuntimes,
    });

    // THEN
    expect(code.compatibleRuntimes).toEqual(compatibleRuntimes);
  });
});
