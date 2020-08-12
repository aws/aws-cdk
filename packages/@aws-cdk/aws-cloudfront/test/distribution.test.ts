import { ABSENT } from '@aws-cdk/assert';
import '@aws-cdk/assert/jest';
import * as acm from '@aws-cdk/aws-certificatemanager';
import * as lambda from '@aws-cdk/aws-lambda';
import * as s3 from '@aws-cdk/aws-s3';
import { App, Duration, Stack } from '@aws-cdk/core';
import { Distribution, GeoRestriction, HttpVersion, IOrigin, LambdaEdgeEventType, PriceClass } from '../lib';
import { defaultOrigin } from './test-origin';

let app: App;
let stack: Stack;

beforeEach(() => {
  app = new App();
  stack = new Stack(app, 'Stack', {
    env: { account: '1234', region: 'testregion' },
  });
});

test('minimal example renders correctly', () => {
  const origin = defaultOrigin();
  new Distribution(stack, 'MyDist', { defaultBehavior: { origin } });

  expect(stack).toHaveResource('AWS::CloudFront::Distribution', {
    DistributionConfig: {
      DefaultCacheBehavior: {
        ForwardedValues: { QueryString: false },
        TargetOriginId: 'StackMyDistOrigin1D6D5E535',
        ViewerProtocolPolicy: 'allow-all',
      },
      Enabled: true,
      HttpVersion: 'http2',
      IPV6Enabled: true,
      Origins: [{
        DomainName: 'www.example.com',
        Id: 'StackMyDistOrigin1D6D5E535',
        CustomOriginConfig: {
          OriginProtocolPolicy: 'https-only',
        },
      }],
    },
  });
});

test('exhaustive example of props renders correctly', () => {
  const origin = defaultOrigin();
  const certificate = acm.Certificate.fromCertificateArn(stack, 'Cert', 'arn:aws:acm:us-east-1:123456789012:certificate/12345678-1234-1234-1234-123456789012');

  new Distribution(stack, 'MyDist', {
    defaultBehavior: { origin },
    certificate,
    comment: 'a test',
    defaultRootObject: 'index.html',
    enabled: false,
    enableIpv6: false,
    enableLogging: true,
    geoRestriction: GeoRestriction.blacklist('US', 'GB'),
    httpVersion: HttpVersion.HTTP1_1,
    logFilePrefix: 'logs/',
    logIncludesCookies: true,
    priceClass: PriceClass.PRICE_CLASS_100,
    webAclId: '473e64fd-f30b-4765-81a0-62ad96dd167a',
  });

  expect(stack).toHaveResource('AWS::CloudFront::Distribution', {
    DistributionConfig: {
      DefaultCacheBehavior: {
        ForwardedValues: { QueryString: false },
        TargetOriginId: 'StackMyDistOrigin1D6D5E535',
        ViewerProtocolPolicy: 'allow-all',
      },
      Comment: 'a test',
      DefaultRootObject: 'index.html',
      Enabled: false,
      HttpVersion: 'http1.1',
      IPV6Enabled: false,
      Logging: {
        Bucket: {'Fn::GetAtt': ['MyDistLoggingBucket9B8976BC', 'RegionalDomainName']},
        IncludeCookies: true,
        Prefix: 'logs/',
      },
      Origins: [{
        DomainName: 'www.example.com',
        Id: 'StackMyDistOrigin1D6D5E535',
        CustomOriginConfig: {
          OriginProtocolPolicy: 'https-only',
        },
      }],
      PriceClass: 'PriceClass_100',
      Restrictions: {
        GeoRestriction: {
          Locations: ['US', 'GB'],
          RestrictionType: 'blacklist',
        },
      },
      ViewerCertificate: {
        AcmCertificateArn: 'arn:aws:acm:us-east-1:123456789012:certificate/12345678-1234-1234-1234-123456789012',
        SslSupportMethod: 'sni-only',
        MinimumProtocolVersion: 'TLSv1.2_2018',
      },
    },
  });
});

describe('multiple behaviors', () => {

  test('a second behavior can\'t be specified with the catch-all path pattern', () => {
    const origin = defaultOrigin();

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
    const origin = defaultOrigin();
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
        HttpVersion: 'http2',
        IPV6Enabled: true,
        Origins: [{
          DomainName: 'www.example.com',
          Id: 'StackMyDistOrigin1D6D5E535',
          CustomOriginConfig: {
            OriginProtocolPolicy: 'https-only',
          },
        }],
      },
    });
  });

  test('a second behavior can be added to a secondary origin', () => {
    const origin = defaultOrigin();
    const origin2 = defaultOrigin('origin2.example.com');
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
        HttpVersion: 'http2',
        IPV6Enabled: true,
        Origins: [{
          DomainName: 'www.example.com',
          Id: 'StackMyDistOrigin1D6D5E535',
          CustomOriginConfig: {
            OriginProtocolPolicy: 'https-only',
          },
        },
        {
          DomainName: 'origin2.example.com',
          Id: 'StackMyDistOrigin20B96F3AD',
          CustomOriginConfig: {
            OriginProtocolPolicy: 'https-only',
          },
        }],
      },
    });
  });

  test('behavior creation order is preserved', () => {
    const origin = defaultOrigin();
    const origin2 = defaultOrigin('origin2.example.com');
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
        HttpVersion: 'http2',
        IPV6Enabled: true,
        Origins: [{
          DomainName: 'www.example.com',
          Id: 'StackMyDistOrigin1D6D5E535',
          CustomOriginConfig: {
            OriginProtocolPolicy: 'https-only',
          },
        },
        {
          DomainName: 'origin2.example.com',
          Id: 'StackMyDistOrigin20B96F3AD',
          CustomOriginConfig: {
            OriginProtocolPolicy: 'https-only',
          },
        }],
      },
    });
  });
});

describe('certificates', () => {

  test('should fail if using an imported certificate from outside of us-east-1', () => {
    const origin = defaultOrigin();
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
      defaultBehavior: { origin: defaultOrigin() },
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
    const origin = defaultOrigin();

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
    const origin = defaultOrigin();

    expect(() => {
      new Distribution(stack, 'Dist', {
        defaultBehavior: { origin },
        errorResponses: [{ httpStatus: 404 }],
      });
    }).toThrow(/A custom error response without either a \'responseCode\' or \'errorCachingMinTtl\' is not valid./);
  });

  test('should render the array of error configs if provided', () => {
    const origin = defaultOrigin();
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

describe('logging', () => {
  test('does not include logging if disabled and no bucket provided', () => {
    const origin = defaultOrigin();
    new Distribution(stack, 'MyDist', { defaultBehavior: { origin } });

    expect(stack).toHaveResourceLike('AWS::CloudFront::Distribution', {
      DistributionConfig: {
        Logging: ABSENT,
      },
    });
  });

  test('throws error if logging disabled but bucket provided', () => {
    const origin = defaultOrigin();

    expect(() => {
      new Distribution(stack, 'MyDist', {
        defaultBehavior: { origin },
        enableLogging: false,
        logBucket: new s3.Bucket(stack, 'Bucket'),
      });
    }).toThrow(/Explicitly disabled logging but provided a logging bucket./);
  });

  test('creates bucket if none is provided', () => {
    const origin = defaultOrigin();
    new Distribution(stack, 'MyDist', {
      defaultBehavior: { origin },
      enableLogging: true,
    });

    expect(stack).toHaveResourceLike('AWS::CloudFront::Distribution', {
      DistributionConfig: {
        Logging: {
          Bucket: {'Fn::GetAtt': ['MyDistLoggingBucket9B8976BC', 'RegionalDomainName']},
        },
      },
    });
  });

  test('uses existing bucket if provided', () => {
    const origin = defaultOrigin();
    const loggingBucket = new s3.Bucket(stack, 'MyLoggingBucket');
    new Distribution(stack, 'MyDist', {
      defaultBehavior: { origin },
      logBucket: loggingBucket,
    });

    expect(stack).toHaveResourceLike('AWS::CloudFront::Distribution', {
      DistributionConfig: {
        Logging: {
          Bucket: {'Fn::GetAtt': ['MyLoggingBucket4382CD04', 'RegionalDomainName']},
        },
      },
    });
  });

  test('can set prefix and cookies', () => {
    const origin = defaultOrigin();
    new Distribution(stack, 'MyDist', {
      defaultBehavior: { origin },
      enableLogging: true,
      logFilePrefix: 'logs/',
      logIncludesCookies: true,
    });

    expect(stack).toHaveResourceLike('AWS::CloudFront::Distribution', {
      DistributionConfig: {
        Logging: {
          Bucket: {'Fn::GetAtt': ['MyDistLoggingBucket9B8976BC', 'RegionalDomainName']},
          IncludeCookies: true,
          Prefix: 'logs/',
        },
      },
    });
  });
});

describe('with Lambda@Edge functions', () => {
  let lambdaFunction: lambda.Function;
  let origin: IOrigin;

  beforeEach(() => {
    lambdaFunction = new lambda.Function(stack, 'Function', {
      runtime: lambda.Runtime.NODEJS,
      code: lambda.Code.fromInline('whatever'),
      handler: 'index.handler',
    });

    origin = defaultOrigin();
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
                Ref: 'FunctionCurrentVersion4E2B2261477a5ae8059bbaa7813f752292c0f65e',
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
                  Ref: 'FunctionCurrentVersion4E2B2261477a5ae8059bbaa7813f752292c0f65e',
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
  const origin = defaultOrigin();
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
