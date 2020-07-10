import '@aws-cdk/assert/jest';
import * as acm from '@aws-cdk/aws-certificatemanager';
import * as s3 from '@aws-cdk/aws-s3';
import { App, Stack } from '@aws-cdk/core';
import { Distribution, Origin, PriceClass } from '../lib';

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
  new Distribution(stack, 'MyDist', { defaultBehavior: { origin } });

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
            [ 'origin-access-identity/cloudfront/', { Ref: 'MyOriginS3OriginIdentityBEF16CC0' } ],
          ]},
        },
      }],
    },
  });
});

describe('multiple behaviors', () => {

  test('a second behavior can\'t be specified with the catch-all path pattern', () => {
    const origin = Origin.fromBucket(stack, 'MyOrigin', new s3.Bucket(stack, 'Bucket'));

    expect(() => {
      new Distribution(stack, 'MyDist', {
        defaultBehavior: { origin },
        additionalBehaviors: {
          '*': { origin },
        },
      });
    }).toThrow(/Only the default behavior can have a path pattern of \'*\'/);
  });

  test('a second behavior can be added to the original origin', () => {
    const origin = Origin.fromBucket(stack, 'MyOrigin', new s3.Bucket(stack, 'Bucket'));
    new Distribution(stack, 'MyDist', {
      defaultBehavior: { origin },
      additionalBehaviors: {
        'api/*': { origin },
      },
    });

    expect(stack).toHaveResource('AWS::CloudFront::Distribution', {
      DistributionConfig: {
        DefaultCacheBehavior: {
          ForwardedValues: { QueryString: false },
          TargetOriginId: 'MyOrigin',
          ViewerProtocolPolicy: 'allow-all',
        },
        CacheBehaviors: [{
          PathPattern: 'api/*',
          ForwardedValues: { QueryString: false },
          TargetOriginId: 'MyOrigin',
          ViewerProtocolPolicy: 'allow-all',
        }],
        Enabled: true,
        Origins: [{
          DomainName: { 'Fn::GetAtt': [ 'Bucket83908E77', 'RegionalDomainName' ] },
          Id: 'MyOrigin',
          S3OriginConfig: {
            OriginAccessIdentity: { 'Fn::Join': [ '',
              [ 'origin-access-identity/cloudfront/', { Ref: 'MyOriginS3OriginIdentityBEF16CC0' } ],
            ]},
          },
        }],
      },
    });
  });

  test('a second behavior can be added to a secondary origin', () => {
    const origin = Origin.fromBucket(stack, 'MyOrigin', new s3.Bucket(stack, 'Bucket'));
    const origin2 = Origin.fromBucket(stack, 'MyOrigin2', new s3.Bucket(stack, 'Bucket2'));
    new Distribution(stack, 'MyDist', {
      defaultBehavior: { origin },
      additionalBehaviors: {
        'api/*': { origin: origin2 },
      },
    });

    expect(stack).toHaveResource('AWS::CloudFront::Distribution', {
      DistributionConfig: {
        DefaultCacheBehavior: {
          ForwardedValues: { QueryString: false },
          TargetOriginId: 'MyOrigin',
          ViewerProtocolPolicy: 'allow-all',
        },
        CacheBehaviors: [{
          PathPattern: 'api/*',
          ForwardedValues: { QueryString: false },
          TargetOriginId: 'MyOrigin2',
          ViewerProtocolPolicy: 'allow-all',
        }],
        Enabled: true,
        Origins: [{
          DomainName: { 'Fn::GetAtt': [ 'Bucket83908E77', 'RegionalDomainName' ] },
          Id: 'MyOrigin',
          S3OriginConfig: {
            OriginAccessIdentity: { 'Fn::Join': [ '',
              [ 'origin-access-identity/cloudfront/', { Ref: 'MyOriginS3OriginIdentityBEF16CC0' } ],
            ]},
          },
        },
        {
          DomainName: { 'Fn::GetAtt': [ 'Bucket25524B414', 'RegionalDomainName' ] },
          Id: 'MyOrigin2',
          S3OriginConfig: {
            OriginAccessIdentity: { 'Fn::Join': [ '',
              [ 'origin-access-identity/cloudfront/', { Ref: 'MyOrigin2S3OriginIdentityB67B10D6' } ],
            ]},
          },
        }],
      },
    });
  });

  test('behavior creation order is preserved', () => {
    const origin = Origin.fromBucket(stack, 'MyOrigin', new s3.Bucket(stack, 'Bucket'));
    const origin2 = Origin.fromBucket(stack, 'MyOrigin2', new s3.Bucket(stack, 'Bucket2'));
    const dist = new Distribution(stack, 'MyDist', {
      defaultBehavior: { origin },
      additionalBehaviors: {
        'api/1*': { origin: origin2 },
      },
    });
    dist.addBehavior('api/2*', { origin });

    expect(stack).toHaveResource('AWS::CloudFront::Distribution', {
      DistributionConfig: {
        DefaultCacheBehavior: {
          ForwardedValues: { QueryString: false },
          TargetOriginId: 'MyOrigin',
          ViewerProtocolPolicy: 'allow-all',
        },
        CacheBehaviors: [{
          PathPattern: 'api/1*',
          ForwardedValues: { QueryString: false },
          TargetOriginId: 'MyOrigin2',
          ViewerProtocolPolicy: 'allow-all',
        },
        {
          PathPattern: 'api/2*',
          ForwardedValues: { QueryString: false },
          TargetOriginId: 'MyOrigin',
          ViewerProtocolPolicy: 'allow-all',
        }],
        Enabled: true,
        Origins: [{
          DomainName: { 'Fn::GetAtt': [ 'Bucket83908E77', 'RegionalDomainName' ] },
          Id: 'MyOrigin',
          S3OriginConfig: {
            OriginAccessIdentity: { 'Fn::Join': [ '',
              [ 'origin-access-identity/cloudfront/', { Ref: 'MyOriginS3OriginIdentityBEF16CC0' } ],
            ]},
          },
        },
        {
          DomainName: { 'Fn::GetAtt': [ 'Bucket25524B414', 'RegionalDomainName' ] },
          Id: 'MyOrigin2',
          S3OriginConfig: {
            OriginAccessIdentity: { 'Fn::Join': [ '',
              [ 'origin-access-identity/cloudfront/', { Ref: 'MyOrigin2S3OriginIdentityB67B10D6' } ],
            ]},
          },
        }],
      },
    });
  });

});

describe('certificates', () => {

  test('should fail if using an imported certificate from outside of us-east-1', () => {
    const origin = Origin.fromBucket(stack, 'Origin', new s3.Bucket(stack, 'Bucket'));
    const certificate = acm.Certificate.fromCertificateArn(stack, 'Cert', 'arn:aws:acm:eu-west-1:123456789012:certificate/12345678-1234-1234-1234-123456789012');

    expect(() => {
      new Distribution(stack, 'Dist', {
        defaultBehavior: { origin },
        certificate,
      });
    }).toThrow(/Distribution certificates must be in the us-east-1 region/);
  });

  test('adding a certificate renders the correct ViewerCertificate property', () => {
    const certificate = acm.Certificate.fromCertificateArn(stack, 'Cert', 'arn:aws:acm:us-east-1:123456789012:certificate/12345678-1234-1234-1234-123456789012');

    new Distribution(stack, 'Dist', {
      defaultBehavior: { origin: Origin.fromBucket(stack, 'Origin', new s3.Bucket(stack, 'Bucket')) },
      certificate,
    });

    expect(stack).toHaveResourceLike('AWS::CloudFront::Distribution', {
      DistributionConfig: {
        ViewerCertificate: {
          AcmCertificateArn: 'arn:aws:acm:us-east-1:123456789012:certificate/12345678-1234-1234-1234-123456789012',
        },
      },
    });
  });
});

describe('custom error responses', () => {

  test('should fail if responsePagePath is defined but responseCode is not', () => {
    const origin = Origin.fromBucket(stack, 'Origin', new s3.Bucket(stack, 'Bucket'));

    expect(() => {
      new Distribution(stack, 'Dist', {
        defaultBehavior: { origin },
        errorConfigurations: [{
          errorCode: 404,
          responsePagePath: '/errors/404.html',
        }],
      });
    }).toThrow(/\'responseCode\' must be provided if \'responsePagePath\' is defined/);
  });

  test('should fail if only the error code is provided', () => {
    const origin = Origin.fromBucket(stack, 'Origin', new s3.Bucket(stack, 'Bucket'));

    expect(() => {
      new Distribution(stack, 'Dist', {
        defaultBehavior: { origin },
        errorConfigurations: [{ errorCode: 404 }],
      });
    }).toThrow(/A custom error response without either a \'responseCode\' or \'errorCachingMinTtl\' is not valid./);
  });

  test('should render the array of error configs if provided', () => {
    const origin = Origin.fromBucket(stack, 'Origin', new s3.Bucket(stack, 'Bucket'));
    new Distribution(stack, 'Dist', {
      defaultBehavior: { origin },
      errorConfigurations: [{
        errorCode: 404,
        responseCode: 404,
        responsePagePath: '/errors/404.html',
      },
      {
        errorCode: 500,
        errorCachingMinTtl: 2,
      }],
    });

    expect(stack).toHaveResourceLike('AWS::CloudFront::Distribution', {
      DistributionConfig: {
        CustomErrorResponses: [
          {
            ErrorCode: 404,
            ResponseCode: 404,
            ResponsePagePath: '/errors/404.html',
          },
          {
            ErrorCachingMinTTL: 2,
            ErrorCode: 500,
          },
        ],
      },
    });
  });

});

test('price class is included if provided', () => {
  const origin = Origin.fromBucket(stack, 'Origin', new s3.Bucket(stack, 'Bucket'));
  new Distribution(stack, 'Dist', {
    defaultBehavior: { origin },
    priceClass: PriceClass.PRICE_CLASS_200,
  });

  expect(stack).toHaveResourceLike('AWS::CloudFront::Distribution', {
    DistributionConfig: {
      PriceClass: 'PriceClass_200',
    },
  });

});