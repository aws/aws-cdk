import { defaultOrigin, defaultOriginGroup, defaultOriginWithOriginAccessControl } from './test-origin';
import { Match, Template } from '../../assertions';
import * as acm from '../../aws-certificatemanager';
import * as cloudwatch from '../../aws-cloudwatch';
import * as iam from '../../aws-iam';
import * as kinesis from '../../aws-kinesis';
import * as lambda from '../../aws-lambda';
import * as s3 from '../../aws-s3';
import { App, Aws, Duration, Stack, Token } from '../../core';
import {
  AllowedMethods,
  CfnDistribution,
  Endpoint,
  Function,
  FunctionCode,
  FunctionEventType,
  GeoRestriction,
  HttpVersion,
  IOrigin,
  LambdaEdgeEventType,
  MTDistribution,
  RealtimeLogConfig,
  SecurityPolicyProtocol,
  SSLMethod,
} from '../lib';

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
  const dist = new MTDistribution(stack, 'MyDist', { defaultBehavior: { origin } });

  Template.fromStack(stack).hasResourceProperties('AWS::CloudFront::Distribution', {
    DistributionConfig: {
      DefaultCacheBehavior: {
        CachePolicyId: '658327ea-f89d-4fab-a63d-7e88639e58f6',
        Compress: true,
        TargetOriginId: 'StackMyDistOrigin1D6D5E535',
        ViewerProtocolPolicy: 'allow-all',
      },
      Enabled: true,
      HttpVersion: 'http2',
      ConnectionMode: 'tenant-only',
      Origins: [{
        DomainName: 'www.example.com',
        Id: 'StackMyDistOrigin1D6D5E535',
        CustomOriginConfig: {
          OriginProtocolPolicy: 'https-only',
        },
      }],
    },
  });

  expect(dist.distributionArn).toEqual(`arn:${Aws.PARTITION}:cloudfront::1234:distribution/${dist.distributionId}`);
});

test('existing distributions can be imported', () => {
  const dist = MTDistribution.fromMTDistributionAttributes(stack, 'ImportedDist', {
    domainName: 'd111111abcdef8.cloudfront.net',
    distributionId: '012345ABCDEF',
  });

  expect(dist.distributionDomainName).toEqual('d111111abcdef8.cloudfront.net');
  expect(dist.distributionId).toEqual('012345ABCDEF');
  expect(dist.distributionArn).toEqual(`arn:${Aws.PARTITION}:cloudfront::1234:distribution/012345ABCDEF`);
});

test('exhaustive example of props renders correctly and SSL method sni-only', () => {
  const origin = defaultOrigin();
  const certificate = acm.Certificate.fromCertificateArn(stack, 'Cert', 'arn:aws:acm:us-east-1:123456789012:certificate/12345678-1234-1234-1234-123456789012');

  new MTDistribution(stack, 'MyDist', {
    defaultBehavior: { origin },
    certificate,
    comment: 'a test',
    defaultRootObject: 'index.html',
    enabled: false,
    enableLogging: true,
    geoRestriction: GeoRestriction.denylist('US', 'GB'),
    httpVersion: HttpVersion.HTTP1_1,
    logFilePrefix: 'logs/',
    logIncludesCookies: true,
    sslSupportMethod: SSLMethod.SNI,
    minimumProtocolVersion: SecurityPolicyProtocol.TLS_V1_2_2019,
    webAclId: 'arn:aws:wafv2:us-east-1:123456789012:global/webacl/ExampleWebACL/473e64fd-f30b-4765-81a0-62ad96dd167a',
    tenantConfig: {
      parameterDefinitions: [
        {
          definition: {
            stringSchema: {
              required: false,
              comment: 'tenantName',
              defaultValue: 'root',
            },
          },
          name: 'tenantName',
        },
      ],
    },
  });

  Template.fromStack(stack).hasResourceProperties('AWS::CloudFront::Distribution', {
    DistributionConfig: {
      DefaultCacheBehavior: {
        CachePolicyId: '658327ea-f89d-4fab-a63d-7e88639e58f6',
        Compress: true,
        TargetOriginId: 'StackMyDistOrigin1D6D5E535',
        ViewerProtocolPolicy: 'allow-all',
      },
      Comment: 'a test',
      DefaultRootObject: 'index.html',
      Enabled: false,
      HttpVersion: 'http1.1',
      Logging: {
        Bucket: { 'Fn::GetAtt': ['MyDistLoggingBucket9B8976BC', 'RegionalDomainName'] },
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
      Restrictions: {
        GeoRestriction: {
          Locations: ['US', 'GB'],
          RestrictionType: 'blacklist',
        },
      },
      ViewerCertificate: {
        AcmCertificateArn: 'arn:aws:acm:us-east-1:123456789012:certificate/12345678-1234-1234-1234-123456789012',
        SslSupportMethod: 'sni-only',
        MinimumProtocolVersion: 'TLSv1.2_2019',
      },
      WebACLId: 'arn:aws:wafv2:us-east-1:123456789012:global/webacl/ExampleWebACL/473e64fd-f30b-4765-81a0-62ad96dd167a',
      ConnectionMode: 'tenant-only',
      TenantConfig: {
        ParameterDefinitions: [
          {
            Definition: {
              StringSchema: {
                Required: false,
                Comment: 'tenantName',
                DefaultValue: 'root',
              },
            },
            Name: 'tenantName',
          },
        ],
      },
    },
  });
});

test('exhaustive example of props renders correctly and SSL method default', () => {
  const origin = defaultOrigin();
  const certificate = acm.Certificate.fromCertificateArn(stack, 'Cert2', 'arn:aws:acm:us-east-1:123456789012:certificate/12345678-1234-1234-1234-123456789012');

  new MTDistribution(stack, 'MyDist2', {
    defaultBehavior: { origin },
    certificate,
    comment: 'a test',
    defaultRootObject: 'index.html',
    enabled: false,
    enableLogging: true,
    geoRestriction: GeoRestriction.denylist('US', 'GB'),
    httpVersion: HttpVersion.HTTP1_1,
    logFilePrefix: 'logs/',
    logIncludesCookies: true,
    minimumProtocolVersion: SecurityPolicyProtocol.TLS_V1_2_2019,
    webAclId: 'arn:aws:wafv2:us-east-1:123456789012:global/webacl/ExampleWebACL/473e64fd-f30b-4765-81a0-62ad96dd167a',
  });

  Template.fromStack(stack).hasResourceProperties('AWS::CloudFront::Distribution', {
    DistributionConfig: {
      DefaultCacheBehavior: {
        CachePolicyId: '658327ea-f89d-4fab-a63d-7e88639e58f6',
        Compress: true,
        TargetOriginId: 'StackMyDist2Origin1FE7916F4',
        ViewerProtocolPolicy: 'allow-all',
      },
      Comment: 'a test',
      DefaultRootObject: 'index.html',
      Enabled: false,
      HttpVersion: 'http1.1',
      Logging: {
        Bucket: { 'Fn::GetAtt': ['MyDist2LoggingBucket3D89B557', 'RegionalDomainName'] },
        IncludeCookies: true,
        Prefix: 'logs/',
      },
      Origins: [{
        DomainName: 'www.example.com',
        Id: 'StackMyDist2Origin1FE7916F4',
        CustomOriginConfig: {
          OriginProtocolPolicy: 'https-only',
        },
      }],
      Restrictions: {
        GeoRestriction: {
          Locations: ['US', 'GB'],
          RestrictionType: 'blacklist',
        },
      },
      ViewerCertificate: {
        AcmCertificateArn: 'arn:aws:acm:us-east-1:123456789012:certificate/12345678-1234-1234-1234-123456789012',
        SslSupportMethod: 'sni-only',
        MinimumProtocolVersion: 'TLSv1.2_2019',
      },
      WebACLId: 'arn:aws:wafv2:us-east-1:123456789012:global/webacl/ExampleWebACL/473e64fd-f30b-4765-81a0-62ad96dd167a',
      ConnectionMode: 'tenant-only',
    },
  });
});

test('ensure comment prop is not greater than max lenght', () => {
  const origin = defaultOrigin();
  new MTDistribution(stack, 'MyDist', {
    defaultBehavior: { origin },
    comment: `Adding a comment longer than 128 characters should be trimmed and added the\x20
ellipsis so a user would know there was more to read and everything beyond this point should not show up`,
  });

  Template.fromStack(stack).hasResourceProperties('AWS::CloudFront::Distribution', {
    DistributionConfig: {
      Comment: `Adding a comment longer than 128 characters should be trimmed and added the\x20
ellipsis so a user would know there was more to ...`,
    },
  });
});

describe('multiple behaviors', () => {
  test('a second behavior can\'t be specified with the catch-all path pattern', () => {
    const origin = defaultOrigin();

    expect(() => {
      new MTDistribution(stack, 'MyDist', {
        defaultBehavior: { origin },
        additionalBehaviors: {
          '*': { origin },
        },
      });
    }).toThrow(/Only the default behavior can have a path pattern of \'*\'/);
  });

  test('a second behavior can be added to the original origin', () => {
    const origin = defaultOrigin();
    new MTDistribution(stack, 'MyDist', {
      defaultBehavior: { origin },
      additionalBehaviors: {
        'api/*': { origin },
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::CloudFront::Distribution', {
      DistributionConfig: {
        DefaultCacheBehavior: {
          CachePolicyId: '658327ea-f89d-4fab-a63d-7e88639e58f6',
          Compress: true,
          TargetOriginId: 'StackMyDistOrigin1D6D5E535',
          ViewerProtocolPolicy: 'allow-all',
        },
        CacheBehaviors: [{
          CachePolicyId: '658327ea-f89d-4fab-a63d-7e88639e58f6',
          Compress: true,
          PathPattern: 'api/*',
          TargetOriginId: 'StackMyDistOrigin1D6D5E535',
          ViewerProtocolPolicy: 'allow-all',
        }],
        ConnectionMode: 'tenant-only',
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
    new MTDistribution(stack, 'MyDist', {
      defaultBehavior: { origin },
      additionalBehaviors: {
        'api/*': { origin: origin2 },
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::CloudFront::Distribution', {
      DistributionConfig: {
        DefaultCacheBehavior: {
          CachePolicyId: '658327ea-f89d-4fab-a63d-7e88639e58f6',
          Compress: true,
          TargetOriginId: 'StackMyDistOrigin1D6D5E535',
          ViewerProtocolPolicy: 'allow-all',
        },
        CacheBehaviors: [{
          CachePolicyId: '658327ea-f89d-4fab-a63d-7e88639e58f6',
          Compress: true,
          PathPattern: 'api/*',
          TargetOriginId: 'StackMyDistOrigin20B96F3AD',
          ViewerProtocolPolicy: 'allow-all',
        }],
        ConnectionMode: 'tenant-only',
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
    const dist = new MTDistribution(stack, 'MyDist', {
      defaultBehavior: { origin },
      additionalBehaviors: {
        'api/1*': { origin: origin2 },
      },
    });
    dist.addBehavior('api/2*', origin);

    Template.fromStack(stack).hasResourceProperties('AWS::CloudFront::Distribution', {
      DistributionConfig: {
        CacheBehaviors: [{
          PathPattern: 'api/1*',
          TargetOriginId: 'StackMyDistOrigin20B96F3AD',
        },
        {
          PathPattern: 'api/2*',
          TargetOriginId: 'StackMyDistOrigin1D6D5E535',
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
      new MTDistribution(stack, 'Dist', {
        defaultBehavior: { origin },
        certificate,
      });
    }).toThrow(/Distribution certificates must be in the us-east-1 region and the certificate you provided is in eu-west-1./);
  });

  test('use the TLSv1.2_2021 security policy by default', () => {
    const certificate = acm.Certificate.fromCertificateArn(stack, 'Cert', 'arn:aws:acm:us-east-1:123456789012:certificate/12345678-1234-1234-1234-123456789012');

    new MTDistribution(stack, 'Dist', {
      defaultBehavior: { origin: defaultOrigin() },
      certificate,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::CloudFront::Distribution', {
      DistributionConfig: {
        ViewerCertificate: {
          AcmCertificateArn: 'arn:aws:acm:us-east-1:123456789012:certificate/12345678-1234-1234-1234-123456789012',
          SslSupportMethod: 'sni-only',
          MinimumProtocolVersion: 'TLSv1.2_2021',
        },
      },
    });
  });

  test('adding a certificate with non default security policy protocol', () => {
    const certificate = acm.Certificate.fromCertificateArn(stack, 'Cert2', 'arn:aws:acm:us-east-1:123456789012:certificate/12345678-1234-1234-1234-123456789012');
    new MTDistribution(stack, 'Dist2', {
      defaultBehavior: { origin: defaultOrigin() },
      sslSupportMethod: SSLMethod.SNI,
      minimumProtocolVersion: SecurityPolicyProtocol.TLS_V1_2016,
      certificate: certificate,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::CloudFront::Distribution', {
      DistributionConfig: {
        ViewerCertificate: {
          AcmCertificateArn: 'arn:aws:acm:us-east-1:123456789012:certificate/12345678-1234-1234-1234-123456789012',
          SslSupportMethod: 'sni-only',
          MinimumProtocolVersion: 'TLSv1_2016',
        },
      },
    });
  });
});

describe('custom error responses', () => {
  test('should fail if only the error code is provided', () => {
    const origin = defaultOrigin();

    expect(() => {
      new MTDistribution(stack, 'Dist', {
        defaultBehavior: { origin },
        errorResponses: [{ httpStatus: 404 }],
      });
    }).toThrow(/A custom error response without either a \'responseHttpStatus\', \'ttl\' or \'responsePagePath\' is not valid./);
  });

  test('should render the array of error configs if provided', () => {
    const origin = defaultOrigin();
    new MTDistribution(stack, 'Dist', {
      defaultBehavior: { origin },
      errorResponses: [{
        httpStatus: 404,
        responsePagePath: '/errors/404.html',
      },
      {
        httpStatus: 500,
        ttl: Duration.seconds(2),
      }],
    });

    Template.fromStack(stack).hasResourceProperties('AWS::CloudFront::Distribution', {
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
    new MTDistribution(stack, 'MyDist', { defaultBehavior: { origin } });

    Template.fromStack(stack).hasResourceProperties('AWS::CloudFront::Distribution', {
      DistributionConfig: {
        Logging: Match.absent(),
      },
    });
  });

  test('throws error if logging disabled but bucket provided', () => {
    const origin = defaultOrigin();

    expect(() => {
      new MTDistribution(stack, 'MyDist', {
        defaultBehavior: { origin },
        enableLogging: false,
        logBucket: new s3.Bucket(stack, 'Bucket'),
      });
    }).toThrow(/Explicitly disabled logging but provided a logging bucket./);
  });

  test('creates bucket if none is provided', () => {
    const origin = defaultOrigin();
    new MTDistribution(stack, 'MyDist', {
      defaultBehavior: { origin },
      enableLogging: true,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::CloudFront::Distribution', {
      DistributionConfig: {
        Logging: {
          Bucket: { 'Fn::GetAtt': ['MyDistLoggingBucket9B8976BC', 'RegionalDomainName'] },
        },
      },
    });
  });

  test('can set prefix and cookies', () => {
    const origin = defaultOrigin();
    new MTDistribution(stack, 'MyDist', {
      defaultBehavior: { origin },
      enableLogging: true,
      logFilePrefix: 'logs/',
      logIncludesCookies: true,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::CloudFront::Distribution', {
      DistributionConfig: {
        Logging: {
          Bucket: { 'Fn::GetAtt': ['MyDistLoggingBucket9B8976BC', 'RegionalDomainName'] },
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
      runtime: lambda.Runtime.NODEJS_LATEST,
      code: lambda.Code.fromInline('whatever'),
      handler: 'index.handler',
    });

    origin = defaultOrigin();
  });

  test('can add an edge lambdas to the default behavior', () => {
    new MTDistribution(stack, 'MyDist', {
      defaultBehavior: {
        origin,
        edgeLambdas: [
          {
            functionVersion: lambdaFunction.currentVersion,
            eventType: LambdaEdgeEventType.ORIGIN_REQUEST,
            includeBody: true,
          },
        ],
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::CloudFront::Distribution', {
      DistributionConfig: {
        DefaultCacheBehavior: {
          LambdaFunctionAssociations: [
            {
              EventType: 'origin-request',
              IncludeBody: true,
              LambdaFunctionARN: {
                Ref: Match.stringLikeRegexp(stack.getLogicalId(lambdaFunction.currentVersion.node.defaultChild as lambda.CfnVersion)),
              },
            },
          ],
        },
      },
    });
  });

  test('edgelambda.amazonaws.com is added to the trust policy of lambda', () => {
    new MTDistribution(stack, 'MyDist', {
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

    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
      AssumeRolePolicyDocument: {
        Statement: [
          {
            Action: 'sts:AssumeRole',
            Effect: 'Allow',
            Principal: {
              Service: 'lambda.amazonaws.com',
            },
          },
          {
            Action: 'sts:AssumeRole',
            Effect: 'Allow',
            Principal: {
              Service: 'edgelambda.amazonaws.com',
            },
          },
        ],
        Version: '2012-10-17',
      },
    });
  });

  test('fails creation when attempting to add the $LATEST function version', () => {
    expect(() => {
      new MTDistribution(stack, 'MyDist', {
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

  test('with removable env vars', () => {
    const envLambdaFunction = new lambda.Function(stack, 'EnvFunction', {
      runtime: lambda.Runtime.NODEJS_LATEST,
      code: lambda.Code.fromInline('whateverwithenv'),
      handler: 'index.handler',
    });
    envLambdaFunction.addEnvironment('KEY', 'value', { removeInEdge: true });

    new MTDistribution(stack, 'MyDist', {
      defaultBehavior: {
        origin,
        edgeLambdas: [
          {
            functionVersion: envLambdaFunction.currentVersion,
            eventType: LambdaEdgeEventType.ORIGIN_REQUEST,
          },
        ],
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
      Environment: Match.absent(),
      Code: {
        ZipFile: 'whateverwithenv',
      },
    });
  });

  test('with incompatible env vars', () => {
    const envLambdaFunction = new lambda.Function(stack, 'EnvFunction', {
      runtime: lambda.Runtime.NODEJS_LATEST,
      code: lambda.Code.fromInline('whateverwithenv'),
      handler: 'index.handler',
      environment: {
        KEY: 'value',
      },
    });

    new MTDistribution(stack, 'MyDist', {
      defaultBehavior: {
        origin,
        edgeLambdas: [
          {
            functionVersion: envLambdaFunction.currentVersion,
            eventType: LambdaEdgeEventType.ORIGIN_REQUEST,
          },
        ],
      },
    });

    expect(() => app.synth()).toThrow(/KEY/);
  });

  test('with singleton function', () => {
    const singleton = new lambda.SingletonFunction(stack, 'Singleton', {
      uuid: 'singleton-for-cloudfront',
      runtime: lambda.Runtime.NODEJS_LATEST,
      code: lambda.Code.fromInline('code'),
      handler: 'index.handler',
    });

    new MTDistribution(stack, 'MyDist', {
      defaultBehavior: {
        origin,
        edgeLambdas: [
          {
            functionVersion: singleton.currentVersion,
            eventType: LambdaEdgeEventType.ORIGIN_REQUEST,
          },
        ],
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::CloudFront::Distribution', {
      DistributionConfig: {
        DefaultCacheBehavior: {
          LambdaFunctionAssociations: [
            {
              EventType: 'origin-request',
              LambdaFunctionARN: {
                Ref: Match.stringLikeRegexp(stack.getLogicalId(singleton.currentVersion.node.defaultChild as lambda.CfnVersion)),
              },
            },
          ],
        },
      },
    });
  });
});

describe('with CloudFront functions', () => {
  test('can add a CloudFront function to the default behavior', () => {
    new MTDistribution(stack, 'MyDist', {
      defaultBehavior: {
        origin: defaultOrigin(),
        functionAssociations: [
          {
            eventType: FunctionEventType.VIEWER_REQUEST,
            function: new Function(stack, 'TestFunction', {
              code: FunctionCode.fromInline('foo'),
            }),
          },
        ],
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::CloudFront::Distribution', {
      DistributionConfig: {
        DefaultCacheBehavior: {
          FunctionAssociations: [
            {
              EventType: 'viewer-request',
              FunctionARN: {
                'Fn::GetAtt': [
                  'TestFunction22AD90FC',
                  'FunctionARN',
                ],
              },
            },
          ],
        },
      },
    });
  });
});

describe('supported HTTP versions', () => {
  test('setting HTTP/1.1 renders HttpVersion correctly', () => {
    new MTDistribution(stack, 'Http1Distribution', {
      httpVersion: HttpVersion.HTTP1_1,
      defaultBehavior: { origin: defaultOrigin() },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::CloudFront::Distribution', {
      DistributionConfig: {
        HttpVersion: 'http1.1',
      },
    });
  });
  test('setting HTTP/2 renders HttpVersion correctly', () => {
    new MTDistribution(stack, 'Http2Distribution', {
      httpVersion: HttpVersion.HTTP2,
      defaultBehavior: { origin: defaultOrigin() },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::CloudFront::Distribution', {
      DistributionConfig: {
        HttpVersion: 'http2',
      },
    });
  });
  test('setting HTTP/3 renders HttpVersion correctly', () => {
    new MTDistribution(stack, 'Http3Distribution', {
      httpVersion: HttpVersion.HTTP3,
      defaultBehavior: { origin: defaultOrigin() },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::CloudFront::Distribution', {
      DistributionConfig: {
        HttpVersion: 'http3',
      },
    });
  });
  test('setting HTTP/2 and HTTP/3 renders HttpVersion correctly', () => {
    new MTDistribution(stack, 'Http2And3Distribution', {
      httpVersion: HttpVersion.HTTP2_AND_3,
      defaultBehavior: { origin: defaultOrigin() },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::CloudFront::Distribution', {
      DistributionConfig: {
        HttpVersion: 'http2and3',
      },
    });
  });
});

test('grants custom actions', () => {
  const distribution = new MTDistribution(stack, 'Distribution', {
    defaultBehavior: { origin: defaultOrigin() },
  });
  const role = new iam.Role(stack, 'Role', {
    assumedBy: new iam.AccountRootPrincipal(),
  });
  distribution.grant(
    role,
    'cloudfront:ListInvalidations',
    'cloudfront:GetInvalidation',
    'cloudfront:CreateFieldLevelEncryptionConfig',
    'cloudfront:CreateFieldLevelEncryptionProfile',
    'cloudfront:CreateKeyGroup',
    'cloudfront:CreateMonitoringSubscription',
    'cloudfront:CreateOriginAccessControl',
    'cloudfront:CreatePublicKey',
    'cloudfront:CreateSavingsPlan',
    'cloudfront:DeleteKeyGroup',
    'cloudfront:DeleteMonitoringSubscription',
    'cloudfront:DeletePublicKey',
    'cloudfront:GetKeyGroup',
    'cloudfront:GetKeyGroupConfig',
    'cloudfront:GetMonitoringSubscription',
    'cloudfront:GetPublicKey',
    'cloudfront:GetPublicKeyConfig',
    'cloudfront:GetSavingsPlan',
    'cloudfront:ListAnycastIpLists',
    'cloudfront:ListCachePolicies',
    'cloudfront:ListCloudFrontOriginAccessIdentities',
    'cloudfront:ListContinuousDeploymentPolicies',
    'cloudfront:ListDistributions',
    'cloudfront:ListDistributionsByAnycastIpListId',
    'cloudfront:ListDistributionsByCachePolicyId',
    'cloudfront:ListDistributionsByKeyGroup',
    'cloudfront:ListDistributionsByLambdaFunction',
    'cloudfront:ListDistributionsByOriginRequestPolicyId',
    'cloudfront:ListDistributionsByRealtimeLogConfig',
    'cloudfront:ListDistributionsByResponseHeadersPolicyId',
    'cloudfront:ListDistributionsByVpcOriginId',
    'cloudfront:ListDistributionsByWebACLId',
    'cloudfront:ListFieldLevelEncryptionConfigs',
    'cloudfront:ListFieldLevelEncryptionProfiles',
    'cloudfront:ListFunctions',
    'cloudfront:ListKeyGroups',
    'cloudfront:ListKeyValueStores',
    'cloudfront:ListOriginAccessControls',
    'cloudfront:ListOriginRequestPolicies',
    'cloudfront:ListPublicKeys',
    'cloudfront:ListRateCards',
    'cloudfront:ListRealtimeLogConfigs',
    'cloudfront:ListResponseHeadersPolicies',
    'cloudfront:ListSavingsPlans',
    'cloudfront:ListStreamingDistributions',
    'cloudfront:ListUsages',
    'cloudfront:ListVpcOrigins',
    'cloudfront:UpdateFieldLevelEncryptionConfig',
    'cloudfront:UpdateKeyGroup',
    'cloudfront:UpdatePublicKey',
    'cloudfront:UpdateSavingsPlan',
  );

  Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
    PolicyDocument: {
      Statement: [
        {
          Action: [
            'cloudfront:CreateFieldLevelEncryptionConfig',
            'cloudfront:CreateFieldLevelEncryptionProfile',
            'cloudfront:CreateKeyGroup',
            'cloudfront:CreateMonitoringSubscription',
            'cloudfront:CreateOriginAccessControl',
            'cloudfront:CreatePublicKey',
            'cloudfront:CreateSavingsPlan',
            'cloudfront:DeleteKeyGroup',
            'cloudfront:DeleteMonitoringSubscription',
            'cloudfront:DeletePublicKey',
            'cloudfront:GetKeyGroup',
            'cloudfront:GetKeyGroupConfig',
            'cloudfront:GetMonitoringSubscription',
            'cloudfront:GetPublicKey',
            'cloudfront:GetPublicKeyConfig',
            'cloudfront:GetSavingsPlan',
            'cloudfront:ListAnycastIpLists',
            'cloudfront:ListCachePolicies',
            'cloudfront:ListCloudFrontOriginAccessIdentities',
            'cloudfront:ListContinuousDeploymentPolicies',
            'cloudfront:ListDistributions',
            'cloudfront:ListDistributionsByAnycastIpListId',
            'cloudfront:ListDistributionsByCachePolicyId',
            'cloudfront:ListDistributionsByKeyGroup',
            'cloudfront:ListDistributionsByLambdaFunction',
            'cloudfront:ListDistributionsByOriginRequestPolicyId',
            'cloudfront:ListDistributionsByRealtimeLogConfig',
            'cloudfront:ListDistributionsByResponseHeadersPolicyId',
            'cloudfront:ListDistributionsByVpcOriginId',
            'cloudfront:ListDistributionsByWebACLId',
            'cloudfront:ListFieldLevelEncryptionConfigs',
            'cloudfront:ListFieldLevelEncryptionProfiles',
            'cloudfront:ListFunctions',
            'cloudfront:ListKeyGroups',
            'cloudfront:ListKeyValueStores',
            'cloudfront:ListOriginAccessControls',
            'cloudfront:ListOriginRequestPolicies',
            'cloudfront:ListPublicKeys',
            'cloudfront:ListRateCards',
            'cloudfront:ListRealtimeLogConfigs',
            'cloudfront:ListResponseHeadersPolicies',
            'cloudfront:ListSavingsPlans',
            'cloudfront:ListStreamingDistributions',
            'cloudfront:ListUsages',
            'cloudfront:ListVpcOrigins',
            'cloudfront:UpdateFieldLevelEncryptionConfig',
            'cloudfront:UpdateKeyGroup',
            'cloudfront:UpdatePublicKey',
            'cloudfront:UpdateSavingsPlan',
          ],
          Resource: '*',
        },
        {
          Action: [
            'cloudfront:ListInvalidations',
            'cloudfront:GetInvalidation',
          ],
          Resource: {
            'Fn::Join': [
              '', [
                'arn:', { Ref: 'AWS::Partition' }, ':cloudfront::1234:distribution/',
                { Ref: 'Distribution830FAC52' },
              ],
            ],
          },
        },
      ],
    },
  });
});

test('grants createInvalidation', () => {
  const distribution = new MTDistribution(stack, 'Distribution', {
    defaultBehavior: { origin: defaultOrigin() },
  });
  const role = new iam.Role(stack, 'Role', {
    assumedBy: new iam.AccountRootPrincipal(),
  });
  distribution.grantCreateInvalidation(role);

  Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
    PolicyDocument: {
      Statement: [
        {
          Action: 'cloudfront:CreateInvalidation',
          Resource: {
            'Fn::Join': [
              '', [
                'arn:', { Ref: 'AWS::Partition' }, ':cloudfront::1234:distribution/',
                { Ref: 'Distribution830FAC52' },
              ],
            ],
          },
        },
      ],
    },
  });
});

test('render distribution behavior with realtime log config', () => {
  const role = new iam.Role(stack, 'Role', {
    assumedBy: new iam.ServicePrincipal('cloudfront.amazonaws.com'),
  });

  const stream = new kinesis.Stream(stack, 'stream', {
    streamMode: kinesis.StreamMode.ON_DEMAND,
    encryption: kinesis.StreamEncryption.MANAGED,
  });

  const realTimeConfig = new RealtimeLogConfig(stack, 'RealtimeConfig', {
    endPoints: [
      Endpoint.fromKinesisStream(stream, role),
    ],
    fields: ['timestamp'],
    realtimeLogConfigName: 'realtime-config',
    samplingRate: 50,
  });

  new MTDistribution(stack, 'MyDist', {
    defaultBehavior: {
      origin: defaultOrigin(),
      realtimeLogConfig: realTimeConfig,
    },
  });

  Template.fromStack(stack).hasResourceProperties('AWS::CloudFront::Distribution',
    Match.objectLike({
      DistributionConfig: {
        DefaultCacheBehavior: {
          RealtimeLogConfigArn: {
            'Fn::GetAtt': ['RealtimeConfigB6004E8E', 'Arn'],
          },
        },
      },
    }));
});

test('render distribution behavior with realtime log config - multiple behaviors', () => {
  const role = new iam.Role(stack, 'Role', {
    assumedBy: new iam.ServicePrincipal('cloudfront.amazonaws.com'),
  });

  const stream = new kinesis.Stream(stack, 'stream', {
    streamMode: kinesis.StreamMode.ON_DEMAND,
    encryption: kinesis.StreamEncryption.MANAGED,
  });

  const realTimeConfig = new RealtimeLogConfig(stack, 'RealtimeConfig', {
    endPoints: [
      Endpoint.fromKinesisStream(stream, role),
    ],
    fields: ['timestamp'],
    realtimeLogConfigName: 'realtime-config',
    samplingRate: 50,
  });

  const origin2 = defaultOrigin('origin2.example.com');

  new MTDistribution(stack, 'MyDist', {
    defaultBehavior: {
      origin: defaultOrigin(),
      realtimeLogConfig: realTimeConfig,
    },
    additionalBehaviors: {
      '/api/*': {
        origin: origin2,
        realtimeLogConfig: realTimeConfig,
      },
    },
  });

  Template.fromStack(stack).hasResourceProperties('AWS::CloudFront::Distribution',
    Match.objectLike({
      DistributionConfig: {
        DefaultCacheBehavior: {
          RealtimeLogConfigArn: {
            'Fn::GetAtt': ['RealtimeConfigB6004E8E', 'Arn'],
          },
          TargetOriginId: 'StackMyDistOrigin1D6D5E535',
        },
        CacheBehaviors: [{
          PathPattern: '/api/*',
          RealtimeLogConfigArn: {
            'Fn::GetAtt': ['RealtimeConfigB6004E8E', 'Arn'],
          },
          TargetOriginId: 'StackMyDistOrigin20B96F3AD',
        }],
      },
    }));
});

test('with publish additional metrics', () => {
  const origin = defaultOrigin();
  new MTDistribution(stack, 'MyDist', {
    defaultBehavior: { origin },
    publishAdditionalMetrics: true,
  });

  Template.fromStack(stack).hasResourceProperties('AWS::CloudFront::MonitoringSubscription', {
    DistributionId: {
      Ref: 'MyDistDB88FD9A',
    },
    MonitoringSubscription: {
      RealtimeMetricsSubscriptionConfig: {
        RealtimeMetricsSubscriptionStatus: 'Enabled',
      },
    },
  });
});

test('with origin access control id', () => {
  const origin = defaultOriginWithOriginAccessControl();
  new MTDistribution(stack, 'MyDist', {
    defaultBehavior: { origin },
    publishAdditionalMetrics: true,
  });

  Template.fromStack(stack).hasResourceProperties('AWS::CloudFront::Distribution', {
    DistributionConfig: {
      DefaultCacheBehavior: {
        CachePolicyId: '658327ea-f89d-4fab-a63d-7e88639e58f6',
        Compress: true,
        TargetOriginId: 'StackMyDistOrigin1D6D5E535',
        ViewerProtocolPolicy: 'allow-all',
      },
      ConnectionMode: 'tenant-only',
      Origins: [{
        DomainName: 'www.example.com',
        Id: 'StackMyDistOrigin1D6D5E535',
        CustomOriginConfig: {
          OriginProtocolPolicy: 'https-only',
        },
        OriginAccessControlId: 'test-origin-access-control-id',
      }],
    },
  });
});

describe('metrics', () => {
  const additionalMetrics = [
    { name: 'OriginLatency', method: 'metricOriginLatency', statistic: 'Average', additionalMetricsRequired: true, errorMetricName: 'Origin latency' },
    { name: 'CacheHitRate', method: 'metricCacheHitRate', statistic: 'Average', additionalMetricsRequired: true, errorMetricName: 'Cache hit rate' },
    ...['401', '403', '404', '502', '503', '504'].map(errorCode => ({
      name: `${errorCode}ErrorRate`,
      method: `metric${errorCode}ErrorRate`,
      statistic: 'Average',
      additionalMetricsRequired: true,
      errorMetricName: `${errorCode} error rate`,
    })),
  ];

  const defaultMetrics = [
    { name: 'Requests', method: 'metricRequests', statistic: 'Sum', additionalMetricsRequired: false, errorMetricName: '' },
    { name: 'BytesDownloaded', method: 'metricBytesDownloaded', statistic: 'Sum', additionalMetricsRequired: false, errorMetricName: '' },
    { name: 'BytesUploaded', method: 'metricBytesUploaded', statistic: 'Sum', additionalMetricsRequired: false, errorMetricName: '' },
    { name: 'TotalErrorRate', method: 'metricTotalErrorRate', statistic: 'Average', additionalMetricsRequired: false, errorMetricName: '' },
    { name: '4xxErrorRate', method: 'metric4xxErrorRate', statistic: 'Average', additionalMetricsRequired: false, errorMetricName: '' },
    { name: '5xxErrorRate', method: 'metric5xxErrorRate', statistic: 'Average', additionalMetricsRequired: false, errorMetricName: '' },
  ];

  test.each(additionalMetrics.concat(defaultMetrics))('get %s metric', (metric) => {
    const origin = defaultOrigin();
    const dist = new MTDistribution(stack, 'MyDist', {
      defaultBehavior: { origin },
      publishAdditionalMetrics: metric.additionalMetricsRequired,
    });

    const metricObj = dist[metric.method]();

    expect(metricObj).toEqual(new cloudwatch.Metric({
      namespace: 'AWS/CloudFront',
      metricName: metric.name,
      dimensions: { DistributionId: dist.distributionId },
      statistic: metric.statistic,
      period: Duration.minutes(5),
    }));
  });

  test.each(additionalMetrics)('throw error when trying to get %s metric without publishing additional metrics', (metric) => {
    const origin = defaultOrigin();
    const dist = new MTDistribution(stack, 'MyDist', {
      defaultBehavior: { origin },
      publishAdditionalMetrics: false,
    });

    expect(() => {
      dist[metric.method]();
    }).toThrow(new RegExp(`${metric.errorMetricName} metric is only available if 'publishAdditionalMetrics' is set 'true'`));
  });
});

describe('attachWebAclId', () => {
  test('can attach WebAcl to the distribution by the method', () => {
    const origin = defaultOrigin();

    const distribution = new MTDistribution(stack, 'MyDist', {
      defaultBehavior: { origin },
    });

    distribution.attachWebAclId('arn:aws:wafv2:us-east-1:123456789012:global/webacl/ExampleWebACL/473e64fd-f30b-4765-81a0-62ad96dd167a');

    Template.fromStack(stack).hasResourceProperties('AWS::CloudFront::Distribution', {
      DistributionConfig: {
        WebACLId: 'arn:aws:wafv2:us-east-1:123456789012:global/webacl/ExampleWebACL/473e64fd-f30b-4765-81a0-62ad96dd167a',
      },
    });
  });

  test('throws if a WebAcl is already attached to the distribution', () => {
    const origin = defaultOrigin();

    const distribution = new MTDistribution(stack, 'MyDist', {
      defaultBehavior: { origin },
      webAclId: 'arn:aws:wafv2:us-east-1:123456789012:global/webacl/ExampleWebACL/473e64fd-f30b-4765-81a0-62ad96dd167a',
    });

    expect(() => {
      distribution.attachWebAclId('arn:aws:wafv2:us-east-1:123456789012:global/webacl/ExampleWebACL/473e64fd-f30b-4765-81a0-62ad96dd167b');
    }).toThrow(/A WebACL has already been attached to this distribution/);
  });

  test('throws if the WebAcl is not in us-east-1 region', () => {
    const origin = defaultOrigin();

    const distribution = new MTDistribution(stack, 'MyDist', {
      defaultBehavior: { origin },
    });

    expect(() => {
      distribution.attachWebAclId('arn:aws:wafv2:ap-northeast-1:123456789012:global/web-acl/MyWebAcl/473e64fd-f30b-4765-81a0-62ad96dd167a');
    }).toThrow(/WebACL for CloudFront distributions must be created in the us-east-1 region; received ap-northeast-1/);
  });

  test('throws error for invalid ACL ID format', () => {
    const origin = defaultOrigin();

    const distribution = new MTDistribution(stack, 'MyDist', {
      defaultBehavior: { origin },
    });

    expect(() => {
      distribution.attachWebAclId('473e64fd-f30b-4765-81a0-62ad96dd167a');
    }).toThrow(/Invalid ACL ID, please verify your web ACL is supported by multi-tenant distributions/);
  });
});

describe('gRPC', () => {
  test.each([
    true,
    false,
    undefined,
  ])('set gRPC to %s in defaultBehavior', (enableGrpc) => {
    const origin = defaultOrigin();
    new MTDistribution(stack, 'MyDist', {
      httpVersion: HttpVersion.HTTP2,
      defaultBehavior: {
        origin,
        allowedMethods: AllowedMethods.ALLOW_ALL,
        enableGrpc,
      },
    });

    const grpcConfig = enableGrpc !== undefined ? {
      Enabled: enableGrpc,
    } : Match.absent();

    Template.fromStack(stack).hasResourceProperties('AWS::CloudFront::Distribution', {
      DistributionConfig: {
        DefaultCacheBehavior: {
          GrpcConfig: grpcConfig,
        },
      },
    });
  });

  test.each([
    HttpVersion.HTTP1_1,
    HttpVersion.HTTP3,
  ])('throws if httpVersion is %s and enableGrpc in defaultBehavior is true', (httpVersion) => {
    const origin = defaultOrigin();
    const msg = `'httpVersion' must be http2 or http2and3 if 'enableGrpc' in 'defaultBehavior' or 'additionalBehaviors' is true, got ${httpVersion}`;

    expect(() => {
      new MTDistribution(stack, 'MyDist', {
        httpVersion,
        defaultBehavior: {
          origin,
          enableGrpc: true,
          allowedMethods: AllowedMethods.ALLOW_ALL,
        },
      });
    }).toThrow(msg);
  });
});

describe('multi-tenant validations', () => {
  test('throws error when VIP SSL method is used', () => {
    const origin = defaultOrigin();
    const certificate = acm.Certificate.fromCertificateArn(stack, 'Cert', 'arn:aws:acm:us-east-1:123456789012:certificate/12345678-1234-1234-1234-123456789012');

    expect(() => {
      new MTDistribution(stack, 'MyDist', {
        defaultBehavior: { origin },
        certificate,
        sslSupportMethod: SSLMethod.VIP,
      });
    }).toThrow(/invalid SSL Method/);
  });

  test('renders tenant config correctly', () => {
    const origin = defaultOrigin();
    new MTDistribution(stack, 'MyDist', {
      defaultBehavior: { origin },
      tenantConfig: {
        parameterDefinitions: [
          {
            definition: {
              stringSchema: {
                required: true,
                comment: 'tenant identifier',
                defaultValue: 'my-tenant-id',
              },
            },
            name: 'tenantId',
          },
        ],
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::CloudFront::Distribution', {
      DistributionConfig: {
        ConnectionMode: 'tenant-only',
        TenantConfig: {
          ParameterDefinitions: [
            {
              Definition: {
                StringSchema: {
                  Required: true,
                  Comment: 'tenant identifier',
                  DefaultValue: 'my-tenant-id',
                },
              },
              Name: 'tenantId',
            },
          ],
        },
      },
    });
  });

  test('renders without tenant config when not provided', () => {
    const origin = defaultOrigin();
    new MTDistribution(stack, 'MyDist', {
      defaultBehavior: { origin },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::CloudFront::Distribution', {
      DistributionConfig: {
        ConnectionMode: 'tenant-only',
        TenantConfig: Match.absent(),
      },
    });
  });

  test('can use default root object', () => {
    const origin = defaultOrigin();
    new MTDistribution(stack, 'MyDist', {
      defaultBehavior: { origin },
      defaultRootObject: 'index.html',
    });

    Template.fromStack(stack).hasResourceProperties('AWS::CloudFront::Distribution', {
      DistributionConfig: {
        DefaultRootObject: 'index.html',
      },
    });
  });

  test('can be disabled', () => {
    const origin = defaultOrigin();
    new MTDistribution(stack, 'MyDist', {
      defaultBehavior: { origin },
      enabled: false,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::CloudFront::Distribution', {
      DistributionConfig: {
        Enabled: false,
      },
    });
  });
});

test('a second behavior can be added to a secondary origin', () => {
  const origin = defaultOrigin();
  const origin2 = defaultOrigin('origin2.example.com');
  new MTDistribution(stack, 'MyDist', {
    defaultBehavior: { origin },
    additionalBehaviors: {
      'api/*': { origin: origin2 },
    },
  });

  Template.fromStack(stack).hasResourceProperties('AWS::CloudFront::Distribution', {
    DistributionConfig: {
      CacheBehaviors: [{
        PathPattern: 'api/*',
        TargetOriginId: 'StackMyDistOrigin20B96F3AD',
      }],
    },
  });
});

test('behavior creation order is preserved', () => {
  const origin = defaultOrigin();
  const origin2 = defaultOrigin('origin2.example.com');
  const dist = new MTDistribution(stack, 'MyDist', {
    defaultBehavior: { origin },
  });
  dist.addBehavior('images/*', origin2);

  Template.fromStack(stack).hasResourceProperties('AWS::CloudFront::Distribution', {
    DistributionConfig: {
      CacheBehaviors: [{
        PathPattern: 'images/*',
        TargetOriginId: 'StackMyDistOrigin20B96F3AD',
      }],
    },
  });
});

test('a second behavior can\'t be specified with the catch-all path pattern', () => {
  const origin = defaultOrigin();
  const dist = new MTDistribution(stack, 'MyDist', {
    defaultBehavior: { origin },
  });

  expect(() => {
    dist.addBehavior('*', origin);
  }).toThrow(/Only the default behavior can have a path pattern of '\*'/);
});

test('price class is included if provided', () => {
  const origin = defaultOrigin();
  new MTDistribution(stack, 'Dist', {
    defaultBehavior: { origin },
  });

  Template.fromStack(stack).hasResourceProperties('AWS::CloudFront::Distribution', {
    DistributionConfig: {
      PriceClass: Match.absent(),
    },
  });
});

test('escape hatches are supported', () => {
  const dist = new MTDistribution(stack, 'Dist', {
    defaultBehavior: { origin: defaultOrigin() },
  });
  const cfnDist = dist.node.defaultChild as CfnDistribution;
  cfnDist.addPropertyOverride('DistributionConfig.DefaultCacheBehavior.ForwardedValues.Headers', ['*']);

  Template.fromStack(stack).hasResourceProperties('AWS::CloudFront::Distribution', {
    DistributionConfig: {
      DefaultCacheBehavior: {
        ForwardedValues: {
          Headers: ['*'],
        },
      },
    },
  });
});

describe('origin IDs', () => {
  test('origin ID is limited to 128 characters', () => {
    const nestedStack = new Stack(stack, 'LongNameThatWillEndUpGeneratingAUniqueNodeIdThatIsLongerThanTheOneHundredAndTwentyEightCharacterLimit');

    new MTDistribution(nestedStack, 'AReallyAwesomeDistributionWithAMemorableNameThatIWillNeverForget', {
      defaultBehavior: { origin: defaultOrigin() },
    });

    Template.fromStack(nestedStack).hasResourceProperties('AWS::CloudFront::Distribution', {
      DistributionConfig: {
        Origins: [Match.objectLike({
          Id: 'ngerThanTheOneHundredAndTwentyEightCharacterLimitAReallyAwesomeDistributionWithAMemorableNameThatIWillNeverForgetOrigin1D38031F9',
        })],
      },
    });
  });

  test('origin group ID is limited to 128 characters', () => {
    const nestedStack = new Stack(stack, 'LongNameThatWillEndUpGeneratingAUniqueNodeIdThatIsLongerThanTheOneHundredAndTwentyEightCharacterLimit');

    new MTDistribution(nestedStack, 'AReallyAwesomeDistributionWithAMemorableNameThatIWillNeverForget', {
      defaultBehavior: { origin: defaultOriginGroup() },
    });

    Template.fromStack(nestedStack).hasResourceProperties('AWS::CloudFront::Distribution', {
      DistributionConfig: {
        OriginGroups: {
          Items: [Match.objectLike({
            Id: 'hanTheOneHundredAndTwentyEightCharacterLimitAReallyAwesomeDistributionWithAMemorableNameThatIWillNeverForgetOriginGroup1B5CE3FE6',
          })],
        },
      },
    });
  });
});

describe('custom origin ids', () => {
  test('test that originId param is respected', () => {
    const origin = defaultOrigin(undefined, 'custom-origin-id');

    const distribution = new MTDistribution(stack, 'Http1Distribution', {
      defaultBehavior: { origin },
      additionalBehaviors: {
        secondUsage: {
          origin,
        },
      },
    });
    distribution.addBehavior(
      'thirdUsage',
      origin,
    );

    Template.fromStack(stack).hasResourceProperties('AWS::CloudFront::Distribution', {
      DistributionConfig: {
        DefaultCacheBehavior: {
          CachePolicyId: '658327ea-f89d-4fab-a63d-7e88639e58f6',
          Compress: true,
          TargetOriginId: 'custom-origin-id',
          ViewerProtocolPolicy: 'allow-all',
        },
        CacheBehaviors: [{
          CachePolicyId: '658327ea-f89d-4fab-a63d-7e88639e58f6',
          Compress: true,
          PathPattern: 'secondUsage',
          TargetOriginId: 'custom-origin-id',
          ViewerProtocolPolicy: 'allow-all',
        },
        {
          CachePolicyId: '658327ea-f89d-4fab-a63d-7e88639e58f6',
          Compress: true,
          PathPattern: 'thirdUsage',
          TargetOriginId: 'custom-origin-id',
          ViewerProtocolPolicy: 'allow-all',
        }],
        ConnectionMode: 'tenant-only',
        Origins: [{
          DomainName: 'www.example.com',
          Id: 'custom-origin-id',
          CustomOriginConfig: {
            OriginProtocolPolicy: 'https-only',
          },
        }],
      },
    });
  });
});

test('uses existing bucket if provided', () => {
  const origin = defaultOrigin();
  const loggingBucket = new s3.Bucket(stack, 'MyLoggingBucket');
  new MTDistribution(stack, 'MyDist', {
    defaultBehavior: { origin },
    logBucket: loggingBucket,
  });

  Template.fromStack(stack).hasResourceProperties('AWS::CloudFront::Distribution', {
    DistributionConfig: {
      Logging: {
        Bucket: { 'Fn::GetAtt': ['MyLoggingBucket4382CD04', 'RegionalDomainName'] },
      },
    },
  });
});

test('grants custom actions', () => {
  const imported = MTDistribution.fromMTDistributionAttributes(stack, 'ImportedDist2', {
    domainName: 'd111111abcdef8.cloudfront.net',
    distributionId: '012345ABCDEF',
  });
  const role = new iam.Role(stack, 'Role2', {
    assumedBy: new iam.AccountRootPrincipal(),
  });

  imported.grant(role, 'cloudfront:ListInvalidations');
  imported.grantCreateInvalidation(role);

  Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
    PolicyDocument: {
      Statement: Match.arrayWith([
        {
          Action: 'cloudfront:ListInvalidations',
          Effect: 'Allow',
          Resource: {
            'Fn::Join': [
              '', [
                'arn:', { Ref: 'AWS::Partition' }, ':cloudfront::1234:distribution/012345ABCDEF',
              ],
            ],
          },
        },
        {
          Action: 'cloudfront:CreateInvalidation',
          Effect: 'Allow',
          Resource: {
            'Fn::Join': [
              '', [
                'arn:', { Ref: 'AWS::Partition' }, ':cloudfront::1234:distribution/012345ABCDEF',
              ],
            ],
          },
        },
      ]),
    },
  });
});
test('validates unresolved token webAclId', () => {
  const origin = defaultOrigin();
  new MTDistribution(stack, 'MyDist', {
    defaultBehavior: { origin },
    webAclId: Token.asString({ Ref: 'SomeWebAcl' }),
  });

  Template.fromStack(stack).hasResourceProperties('AWS::CloudFront::Distribution', {
    DistributionConfig: {
      WebACLId: { Ref: 'SomeWebAcl' },
    },
  });
});

test('handles origin with custom originId', () => {
  const origin = defaultOrigin(undefined, 'custom-origin-id');
  new MTDistribution(stack, 'MyDist', {
    defaultBehavior: { origin },
  });

  Template.fromStack(stack).hasResourceProperties('AWS::CloudFront::Distribution', {
    DistributionConfig: {
      Origins: [{
        Id: 'custom-origin-id',
        DomainName: 'www.example.com',
      }],
    },
  });
});

test('use the TLSv1.2_2021 security policy by default', () => {
  const certificate = acm.Certificate.fromCertificateArn(stack, 'Cert', 'arn:aws:acm:us-east-1:123456789012:certificate/12345678-1234-1234-1234-123456789012');

  new MTDistribution(stack, 'Dist', {
    defaultBehavior: { origin: defaultOrigin() },
    certificate,
  });

  Template.fromStack(stack).hasResourceProperties('AWS::CloudFront::Distribution', {
    DistributionConfig: {
      ViewerCertificate: {
        AcmCertificateArn: 'arn:aws:acm:us-east-1:123456789012:certificate/12345678-1234-1234-1234-123456789012',
        SslSupportMethod: 'sni-only',
        MinimumProtocolVersion: 'TLSv1.2_2021',
      },
    },
  });
});

test('renders origin groups when present', () => {
  const origin = defaultOriginGroup();
  new MTDistribution(stack, 'MyDist', {
    defaultBehavior: { origin },
  });

  Template.fromStack(stack).hasResourceProperties('AWS::CloudFront::Distribution', {
    DistributionConfig: {
      OriginGroups: {
        Items: Match.arrayWith([Match.objectLike({
          Id: Match.stringLikeRegexp('.*OriginGroup.*'),
        })]),
      },
    },
  });
});
test('renders origin groups when they exist', () => {
  const origin = defaultOriginGroup();
  new MTDistribution(stack, 'MyDist', {
    defaultBehavior: { origin },
  });

  Template.fromStack(stack).hasResourceProperties('AWS::CloudFront::Distribution', {
    DistributionConfig: {
      OriginGroups: {
        Items: Match.arrayWith([Match.objectLike({
          Id: Match.stringLikeRegexp('.*OriginGroup.*'),
        })]),
        Quantity: 1,
      },
    },
  });
});

test('handles error responses with responsePagePath', () => {
  const origin = defaultOrigin();
  new MTDistribution(stack, 'MyDist', {
    defaultBehavior: { origin },
    errorResponses: [{
      httpStatus: 404,
      responseHttpStatus: 200,
      responsePagePath: '/error.html',
    }],
  });

  Template.fromStack(stack).hasResourceProperties('AWS::CloudFront::Distribution', {
    DistributionConfig: {
      CustomErrorResponses: [{
        ErrorCode: 404,
        ResponseCode: 200,
        ResponsePagePath: '/error.html',
      }],
    },
  });
});
