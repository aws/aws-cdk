import '@aws-cdk/assert/jest';
import * as acm from '@aws-cdk/aws-certificatemanager';
import * as lambda from '@aws-cdk/aws-lambda';
import * as s3 from '@aws-cdk/aws-s3';
import { App, Duration, Stack } from '@aws-cdk/core';
import { Distribution, LambdaEdgeEventType, Origin, PriceClass, S3Origin } from '../lib';

let app: App;
let stack: Stack;

beforeEach(() => {
  app = new App();
  stack = new Stack(app, 'Stack', {
    env: { account: '1234', region: 'testregion' },
  });
});

test('minimal example renders correctly', () => {
  const origin = defaultS3Origin();
  new Distribution(stack, 'MyDist', { defaultBehavior: { origin } });

  expect(stack).toHaveResource('AWS::CloudFront::Distribution', {
    DistributionConfig: {
      DefaultCacheBehavior: {
        ForwardedValues: { QueryString: false },
        TargetOriginId: 'StackMyDistOrigin1D6D5E535',
        ViewerProtocolPolicy: 'allow-all',
      },
      Enabled: true,
      Origins: [{
        DomainName: { 'Fn::GetAtt': [ 'Bucket83908E77', 'RegionalDomainName' ] },
        Id: 'StackMyDistOrigin1D6D5E535',
        S3OriginConfig: {
          OriginAccessIdentity: { 'Fn::Join': [ '',
            [ 'origin-access-identity/cloudfront/', { Ref: 'MyDistS3Origin1ED86A27E' } ],
          ]},
        },
      }],
    },
  });
});

describe('multiple behaviors', () => {

  test('a second behavior can\'t be specified with the catch-all path pattern', () => {
    const origin = defaultS3Origin();

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
    const origin = defaultS3Origin();
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
          TargetOriginId: 'StackMyDistOrigin1D6D5E535',
          ViewerProtocolPolicy: 'allow-all',
        },
        CacheBehaviors: [{
          PathPattern: 'api/*',
          ForwardedValues: { QueryString: false },
          TargetOriginId: 'StackMyDistOrigin1D6D5E535',
          ViewerProtocolPolicy: 'allow-all',
        }],
        Enabled: true,
        Origins: [{
          DomainName: { 'Fn::GetAtt': [ 'Bucket83908E77', 'RegionalDomainName' ] },
          Id: 'StackMyDistOrigin1D6D5E535',
          S3OriginConfig: {
            OriginAccessIdentity: { 'Fn::Join': [ '',
              [ 'origin-access-identity/cloudfront/', { Ref: 'MyDistS3Origin1ED86A27E' } ],
            ]},
          },
        }],
      },
    });
  });

  test('a second behavior can be added to a secondary origin', () => {
    const origin = defaultS3Origin();
    const bucket2 = new s3.Bucket(stack, 'Bucket2');
    const origin2 = new S3Origin({ bucket: bucket2 });
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
          TargetOriginId: 'StackMyDistOrigin1D6D5E535',
          ViewerProtocolPolicy: 'allow-all',
        },
        CacheBehaviors: [{
          PathPattern: 'api/*',
          ForwardedValues: { QueryString: false },
          TargetOriginId: 'StackMyDistOrigin20B96F3AD',
          ViewerProtocolPolicy: 'allow-all',
        }],
        Enabled: true,
        Origins: [{
          DomainName: { 'Fn::GetAtt': [ 'Bucket83908E77', 'RegionalDomainName' ] },
          Id: 'StackMyDistOrigin1D6D5E535',
          S3OriginConfig: {
            OriginAccessIdentity: { 'Fn::Join': [ '',
              [ 'origin-access-identity/cloudfront/', { Ref: 'MyDistS3Origin1ED86A27E' } ],
            ]},
          },
        },
        {
          DomainName: { 'Fn::GetAtt': [ 'Bucket25524B414', 'RegionalDomainName' ] },
          Id: 'StackMyDistOrigin20B96F3AD',
          S3OriginConfig: {
            OriginAccessIdentity: { 'Fn::Join': [ '',
              [ 'origin-access-identity/cloudfront/', { Ref: 'MyDistS3Origin2E88F08BB' } ],
            ]},
          },
        }],
      },
    });
  });

  test('behavior creation order is preserved', () => {
    const origin = defaultS3Origin();
    const bucket2 = new s3.Bucket(stack, 'Bucket2');
    const origin2 = new S3Origin({ bucket: bucket2 });
    const dist = new Distribution(stack, 'MyDist', {
      defaultBehavior: { origin },
      additionalBehaviors: {
        'api/1*': { origin: origin2 },
      },
    });
    dist.addBehavior('api/2*', origin);

    expect(stack).toHaveResource('AWS::CloudFront::Distribution', {
      DistributionConfig: {
        DefaultCacheBehavior: {
          ForwardedValues: { QueryString: false },
          TargetOriginId: 'StackMyDistOrigin1D6D5E535',
          ViewerProtocolPolicy: 'allow-all',
        },
        CacheBehaviors: [{
          PathPattern: 'api/1*',
          ForwardedValues: { QueryString: false },
          TargetOriginId: 'StackMyDistOrigin20B96F3AD',
          ViewerProtocolPolicy: 'allow-all',
        },
        {
          PathPattern: 'api/2*',
          ForwardedValues: { QueryString: false },
          TargetOriginId: 'StackMyDistOrigin1D6D5E535',
          ViewerProtocolPolicy: 'allow-all',
        }],
        Enabled: true,
        Origins: [{
          DomainName: { 'Fn::GetAtt': [ 'Bucket83908E77', 'RegionalDomainName' ] },
          Id: 'StackMyDistOrigin1D6D5E535',
          S3OriginConfig: {
            OriginAccessIdentity: { 'Fn::Join': [ '',
              [ 'origin-access-identity/cloudfront/', { Ref: 'MyDistS3Origin1ED86A27E' } ],
            ]},
          },
        },
        {
          DomainName: { 'Fn::GetAtt': [ 'Bucket25524B414', 'RegionalDomainName' ] },
          Id: 'StackMyDistOrigin20B96F3AD',
          S3OriginConfig: {
            OriginAccessIdentity: { 'Fn::Join': [ '',
              [ 'origin-access-identity/cloudfront/', { Ref: 'MyDistS3Origin2E88F08BB' } ],
            ]},
          },
        }],
      },
    });
  });

});

describe('certificates', () => {

  test('should fail if using an imported certificate from outside of us-east-1', () => {
    const origin = defaultS3Origin();
    const certificate = acm.Certificate.fromCertificateArn(stack, 'Cert', 'arn:aws:acm:eu-west-1:123456789012:certificate/12345678-1234-1234-1234-123456789012');

    expect(() => {
      new Distribution(stack, 'Dist', {
        defaultBehavior: { origin },
        certificate,
      });
    }).toThrow(/Distribution certificates must be in the us-east-1 region and the certificate you provided is in eu-west-1./);
  });

  test('adding a certificate renders the correct ViewerCertificate property', () => {
    const certificate = acm.Certificate.fromCertificateArn(stack, 'Cert', 'arn:aws:acm:us-east-1:123456789012:certificate/12345678-1234-1234-1234-123456789012');

    new Distribution(stack, 'Dist', {
      defaultBehavior: { origin: defaultS3Origin() },
      certificate,
    });

    expect(stack).toHaveResourceLike('AWS::CloudFront::Distribution', {
      DistributionConfig: {
        ViewerCertificate: {
          AcmCertificateArn: 'arn:aws:acm:us-east-1:123456789012:certificate/12345678-1234-1234-1234-123456789012',
          SslSupportMethod: 'sni-only',
          MinimumProtocolVersion: 'TLSv1.2_2018',
        },
      },
    });
  });
});

describe('custom error responses', () => {

  test('should fail if responsePagePath is defined but responseCode is not', () => {
    const origin = defaultS3Origin();

    expect(() => {
      new Distribution(stack, 'Dist', {
        defaultBehavior: { origin },
        errorResponses: [{
          httpStatus: 404,
          responsePagePath: '/errors/404.html',
        }],
      });
    }).toThrow(/\'responseCode\' must be provided if \'responsePagePath\' is defined/);
  });

  test('should fail if only the error code is provided', () => {
    const origin = defaultS3Origin();

    expect(() => {
      new Distribution(stack, 'Dist', {
        defaultBehavior: { origin },
        errorResponses: [{ httpStatus: 404 }],
      });
    }).toThrow(/A custom error response without either a \'responseCode\' or \'errorCachingMinTtl\' is not valid./);
  });

  test('should render the array of error configs if provided', () => {
    const origin = defaultS3Origin();
    new Distribution(stack, 'Dist', {
      defaultBehavior: { origin },
      errorResponses: [{
        httpStatus: 404,
        responseHttpStatus: 404,
        responsePagePath: '/errors/404.html',
      },
      {
        httpStatus: 500,
        ttl: Duration.seconds(2),
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

describe('with Lambda@Edge functions', () => {
  let lambdaFunction: lambda.Function;
  let origin: Origin;

  beforeEach(() => {
    lambdaFunction = new lambda.Function(stack, 'Function', {
      runtime: lambda.Runtime.NODEJS,
      code: lambda.Code.fromInline('whatever'),
      handler: 'index.handler',
    });

    origin = defaultS3Origin();
  });

  test('can add an edge lambdas to the default behavior', () => {
    new Distribution(stack, 'MyDist', {
      defaultBehavior: {
        origin,
        edgeLambdas: [
          {
            functionVersion: lambdaFunction.currentVersion,
            eventType: LambdaEdgeEventType.ORIGIN_REQUEST,
          },
        ],
      },
    });

    expect(stack).toHaveResourceLike('AWS::CloudFront::Distribution', {
      DistributionConfig: {
        DefaultCacheBehavior: {
          LambdaFunctionAssociations: [
            {
              EventType: 'origin-request',
              LambdaFunctionARN: {
                Ref: 'FunctionCurrentVersion4E2B22619c0305f954e58f25575548280c0a3629',
              },
            },
          ],
        },
      },
    });
  });

  test('can add an edge lambdas to additional behaviors', () => {
    new Distribution(stack, 'MyDist', {
      defaultBehavior: { origin },
      additionalBehaviors: {
        'images/*': {
          origin,
          edgeLambdas: [
            {
              functionVersion: lambdaFunction.currentVersion,
              eventType: LambdaEdgeEventType.VIEWER_REQUEST,
            },
          ],
        },
      },
    });

    expect(stack).toHaveResourceLike('AWS::CloudFront::Distribution', {
      DistributionConfig: {
        CacheBehaviors: [
          {
            PathPattern: 'images/*',
            LambdaFunctionAssociations: [
              {
                EventType: 'viewer-request',
                LambdaFunctionARN: {
                  Ref: 'FunctionCurrentVersion4E2B22619c0305f954e58f25575548280c0a3629',
                },
              },
            ],
          },
        ],
      },
    });
  });

  test('fails creation when attempting to add the $LATEST function version as an edge Lambda to the default behavior', () => {
    expect(() => {
      new Distribution(stack, 'MyDist', {
        defaultBehavior: {
          origin,
          edgeLambdas: [
            {
              functionVersion: lambdaFunction.latestVersion,
              eventType: LambdaEdgeEventType.ORIGIN_RESPONSE,
            },
          ],
        },
      });
    }).toThrow(/\$LATEST function version cannot be used for Lambda@Edge/);
  });
});

test('price class is included if provided', () => {
  const origin = defaultS3Origin();
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

function defaultS3Origin(): Origin {
  return new S3Origin({ bucket: new s3.Bucket(stack, 'Bucket') });
}
