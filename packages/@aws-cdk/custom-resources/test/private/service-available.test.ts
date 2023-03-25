import { Runtime } from '@aws-cdk/aws-lambda';
import { lambdaLatestRuntime } from '../../lib/private/service-available';

describe('lambdaLatestRuntime', () => {
  it('should return true if region is undefined', () => {
    expect(lambdaLatestRuntime(undefined)).toStrictEqual(Runtime.NODEJS_18_X);
  });

  it('should return the lambdaLatestRuntime value from RegionInfo if region is specified and resolved', () => {
    expect(lambdaLatestRuntime('us-east-1')).toStrictEqual(Runtime.NODEJS_18_X);
  });

  it('should return false for regions with non default runtime', () => {
    [
      'me-central-1',
      'eu-central-2',
      'eu-south-2',
      'us-gov-east-1',
      'us-gov-west-1',
      'cn-north-1',
      'cn-northwest-1',
    ].forEach(region => {
      expect(lambdaLatestRuntime(region)).toStrictEqual(Runtime.NODEJS_16_X);
    });
  });
});