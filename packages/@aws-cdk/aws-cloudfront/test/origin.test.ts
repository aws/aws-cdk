import '@aws-cdk/assert/jest';
import * as s3 from '@aws-cdk/aws-s3';
import { App, Stack, Duration } from '@aws-cdk/core';
import { CfnDistribution, Distribution, Origin, OriginProps, HttpOrigin, OriginProtocolPolicy, S3Origin } from '../lib';

let app: App;
let stack: Stack;

beforeEach(() => {
  app = new App();
  stack = new Stack(app, 'Stack', {
    env: { account: '1234', region: 'testregion' },
  });
});

describe('S3Origin', () => {
  test('as bucket, renders all required properties, including S3Origin config', () => {
    const bucket = new s3.Bucket(stack, 'Bucket');

    const origin = new S3Origin({ bucket });
    origin.bind(stack, { originIndex: 0 });

    expect(origin.renderOrigin()).toEqual({
      id: 'StackOrigin029E19582',
      domainName: bucket.bucketRegionalDomainName,
      s3OriginConfig: {
        originAccessIdentity: 'origin-access-identity/cloudfront/${Token[TOKEN.69]}',
      },
    });
  });

  test('as bucket, creates an OriginAccessIdentity and grants read permissions on the bucket', () => {
    const bucket = new s3.Bucket(stack, 'Bucket');

    const origin = new S3Origin({ bucket });
    new Distribution(stack, 'Dist', { defaultBehavior: { origin } });

    expect(stack).toHaveResourceLike('AWS::CloudFront::CloudFrontOriginAccessIdentity', {
      CloudFrontOriginAccessIdentityConfig: {
        Comment: 'Allows CloudFront to reach the bucket',
      },
    });
    expect(stack).toHaveResourceLike('AWS::S3::BucketPolicy', {
      PolicyDocument: {
        Statement: [{
          Principal: {
            CanonicalUser: { 'Fn::GetAtt': [ 'DistS3Origin1C4519663', 'S3CanonicalUserId' ] },
          },
        }],
      },
    });
  });
});

describe('HttpOrigin', () => {
  test('renders a minimal example with required props', () => {
    const origin = new HttpOrigin('www.example.com');
    origin.bind(stack, { originIndex: 0 });

    expect(origin.renderOrigin()).toEqual({
      id: 'StackOrigin029E19582',
      domainName: 'www.example.com',
      customOriginConfig: {
        originProtocolPolicy: 'https-only',
      },
    });
  });

  test('renders an example with all available props', () => {
    const origin = new HttpOrigin('www.example.com', {
      originPath: '/app',
      connectionTimeout: Duration.seconds(5),
      connectionAttempts: 2,
      customHeaders: { AUTH: 'NONE' },
      protocolPolicy: OriginProtocolPolicy.MATCH_VIEWER,
      httpPort: 8080,
      httpsPort: 8443,
      readTimeout: Duration.seconds(45),
      keepaliveTimeout: Duration.seconds(3),
    });
    origin.bind(stack, { originIndex: 0 });

    expect(origin.renderOrigin()).toEqual({
      id: 'StackOrigin029E19582',
      domainName: 'www.example.com',
      originPath: '/app',
      connectionTimeout: 5,
      connectionAttempts: 2,
      originCustomHeaders: [{
        headerName: 'AUTH',
        headerValue: 'NONE',
      }],
      customOriginConfig: {
        originProtocolPolicy: 'match-viewer',
        httpPort: 8080,
        httpsPort: 8443,
        originReadTimeout: 45,
        originKeepaliveTimeout: 3,
      },
    });
  });

  test.each([
    Duration.seconds(0),
    Duration.seconds(0.5),
    Duration.seconds(60.5),
    Duration.seconds(61),
    Duration.minutes(5),
  ])('validates readTimeout is an integer between 1 and 60 seconds', (readTimeout) => {
    expect(() => {
      new HttpOrigin('www.example.com', {
        readTimeout,
      });
    }).toThrow(`readTimeout: Must be an int between 1 and 60 seconds (inclusive); received ${readTimeout.toSeconds()}.`);
  });

  test.each([
    Duration.seconds(0),
    Duration.seconds(0.5),
    Duration.seconds(60.5),
    Duration.seconds(61),
    Duration.minutes(5),
  ])('validates keepaliveTimeout is an integer between 1 and 60 seconds', (keepaliveTimeout) => {
    expect(() => {
      new HttpOrigin('www.example.com', {
        keepaliveTimeout,
      });
    }).toThrow(`keepaliveTimeout: Must be an int between 1 and 60 seconds (inclusive); received ${keepaliveTimeout.toSeconds()}.`);
  });
});;

describe('Origin', () => {
  test.each([
    Duration.seconds(0),
    Duration.seconds(0.5),
    Duration.seconds(10.5),
    Duration.seconds(11),
    Duration.minutes(5),
  ])('validates connectionTimeout is an int between 1 and 10 seconds', (connectionTimeout) => {
    expect(() => {
      new TestOrigin('www.example.com', {
        connectionTimeout,
      });
    }).toThrow(`connectionTimeout: Must be an int between 1 and 10 seconds (inclusive); received ${connectionTimeout.toSeconds()}.`);
  });

  test.each([-0.5, 0.5, 1.5, 4])
  ('validates connectionAttempts is an int between 1 and 3', (connectionAttempts) => {
    expect(() => {
      new TestOrigin('www.example.com', {
        connectionAttempts,
      });
    }).toThrow(`connectionAttempts: Must be an int between 1 and 3 (inclusive); received ${connectionAttempts}.`);
  });

  test.each(['api', '/api', '/api/', 'api/'])
  ('enforces that originPath starts but does not end, with a /', (originPath) => {
    const origin = new TestOrigin('www.example.com', {
      originPath,
    });
    origin.bind(stack, { originIndex: 0 });

    expect(origin.renderOrigin().originPath).toEqual('/api');
  });
});

/** Used for testing common Origin functionality */
class TestOrigin extends Origin {
  constructor(domainName: string, props: OriginProps = {}) { super(domainName, props); }
  protected renderS3OriginConfig(): CfnDistribution.S3OriginConfigProperty | undefined {
    return { originAccessIdentity: 'origin-access-identity/cloudfront/MyOAIName' };
  }
}