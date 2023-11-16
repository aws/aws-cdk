import { Runtime } from '../../../aws-lambda';
import { CdkCode } from '../../lib/handler-framework/cdk-code';

describe('code from asset', () => {
  test('correctly sets compatibleRuntimes property', () => {
    // GIVEN
    const compatibleRuntimes = [Runtime.NODEJS_16_X, Runtime.NODEJS_18_X];

    // WHEN
    const code = CdkCode.fromAsset('./test-handler', { compatibleRuntimes });

    // THEN
    expect(code.compatibleRuntimes).toEqual(compatibleRuntimes);
  });
});