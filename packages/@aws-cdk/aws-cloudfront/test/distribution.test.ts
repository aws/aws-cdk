import '@aws-cdk/assert/jest';
import * as acm from '@aws-cdk/aws-certificatemanager';
import * as s3 from '@aws-cdk/aws-s3';
import { App, Stack } from '@aws-cdk/core';
import { Distribution, Origin } from '../lib';

let app: App;
let stack: Stack;

beforeEach(() => {
  app = new App();
  stack = new Stack(app, 'Stack', {
    env: { account: '1234', region: 'testregion' },
  });
});

test('minimal example renders correctly', () => {
  const origin = Origin.fromBucket(stack, 'MyOrigin', new s3.Bucket(stack, 'Bucket'));
  new Distribution(stack, 'MyDist', { origin });

  expect(stack).toHaveResource('AWS::CloudFront::Distribution', {
    DistributionConfig: {
      DefaultCacheBehavior: {
        ForwardedValues: { QueryString: false },
        TargetOriginId: 'MyOrigin',
        ViewerProtocolPolicy: 'allow-all',
      },
      Enabled: true,
      Origins: [{
        DomainName: { 'Fn::GetAtt': [ 'Bucket83908E77', 'RegionalDomainName' ] },
        Id: 'MyOrigin',
        S3OriginConfig: {
          OriginAccessIdentity: { 'Fn::Join': [ '',
            [ 'origin-access-identity/cloudfront/', { Ref: 'S3OriginIdentityBB010E4C' } ],
          ]},
        },
      }],
    },
  });
});

describe('certificates', () => {

  test('should fail if using an imported certificate from outside of us-east-1', () => {
    const origin = Origin.fromBucket(stack, 'Origin', new s3.Bucket(stack, 'Bucket'));
    const certificate = acm.Certificate.fromCertificateArn(stack, 'Cert', 'arn:aws:acm:eu-west-1:123456789012:certificate/12345678-1234-1234-1234-123456789012');

    expect(() => {
      new Distribution(stack, 'Dist', {
        origin,
        certificate,
      });
    }).toThrow(/Distribution certificates must be in the us-east-1 region/);
  });

});