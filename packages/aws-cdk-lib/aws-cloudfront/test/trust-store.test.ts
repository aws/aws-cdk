import { Match, Template } from '../../assertions';
import * as s3 from '../../aws-s3';
import { App, Lazy, Stack } from '../../core';
import { TrustStore } from '../lib';

/**
 * Sample Trust Store ID for testing.
 * Trust Store IDs have the format: ts_<26 alphanumeric characters>
 */
const SAMPLE_TRUST_STORE_ID = 'ts_ExAmPlE1234567890AbCdEf';

describe('TrustStore', () => {
  let app: App;
  let stack: Stack;
  let bucket: s3.IBucket;

  beforeEach(() => {
    app = new App();
    stack = new Stack(app, 'Stack', {
      env: { account: '123456789012', region: 'us-east-1' },
    });
    bucket = new s3.Bucket(stack, 'Bucket');
  });

  test('minimal settings', () => {
    new TrustStore(stack, 'TrustStore', {
      caCertificatesBundleS3Location: {
        bucket,
        key: 'ca-bundle.pem',
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::CloudFront::TrustStore', {
      Name: Match.stringLikeRegexp('StackTrustStore'),
      CaCertificatesBundleSource: {
        CaCertificatesBundleS3Location: {
          Bucket: { Ref: 'Bucket83908E77' },
          Key: 'ca-bundle.pem',
          Region: 'us-east-1',
        },
      },
    });
  });

  test('with full settings', () => {
    new TrustStore(stack, 'TrustStore', {
      trustStoreName: 'my-custom-trust-store',
      caCertificatesBundleS3Location: {
        bucket,
        key: 'ca-bundle.pem',
        version: 'abc123',
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::CloudFront::TrustStore', {
      Name: 'my-custom-trust-store',
      CaCertificatesBundleSource: {
        CaCertificatesBundleS3Location: {
          Bucket: { Ref: 'Bucket83908E77' },
          Key: 'ca-bundle.pem',
          Region: 'us-east-1',
          Version: 'abc123',
        },
      },
    });
  });

  test('fromTrustStoreId', () => {
    const imported = TrustStore.fromTrustStoreId(stack, 'ImportedTrustStore', SAMPLE_TRUST_STORE_ID);

    expect(imported.trustStoreId).toEqual(SAMPLE_TRUST_STORE_ID);
    expect(imported.trustStoreArn).toEqual(
      `arn:${stack.partition}:cloudfront::${Stack.of(stack).account}:trust-store/${SAMPLE_TRUST_STORE_ID}`,
    );
  });

  test('fromTrustStoreAttributes with id only', () => {
    const imported = TrustStore.fromTrustStoreAttributes(stack, 'ImportedTrustStore', {
      trustStoreId: SAMPLE_TRUST_STORE_ID,
    });

    expect(imported.trustStoreId).toEqual(SAMPLE_TRUST_STORE_ID);
    expect(imported.trustStoreArn).toEqual(
      `arn:${stack.partition}:cloudfront::${Stack.of(stack).account}:trust-store/${SAMPLE_TRUST_STORE_ID}`,
    );
  });

  test('fromTrustStoreAttributes with id and arn', () => {
    const trustStoreArn = `arn:${stack.partition}:cloudfront::${Stack.of(stack).account}:trust-store/${SAMPLE_TRUST_STORE_ID}`;
    const imported = TrustStore.fromTrustStoreAttributes(stack, 'ImportedTrustStore', {
      trustStoreId: SAMPLE_TRUST_STORE_ID,
      trustStoreArn,
    });

    expect(imported.trustStoreId).toEqual(SAMPLE_TRUST_STORE_ID);
    expect(imported.trustStoreArn).toEqual(trustStoreArn);
  });

  test('trustStoreRef is correctly set for imported trust store', () => {
    const trustStoreArn = `arn:${stack.partition}:cloudfront::${Stack.of(stack).account}:trust-store/${SAMPLE_TRUST_STORE_ID}`;
    const imported = TrustStore.fromTrustStoreAttributes(stack, 'ImportedTrustStore', {
      trustStoreId: SAMPLE_TRUST_STORE_ID,
      trustStoreArn,
    });

    expect(imported.trustStoreRef).toEqual({
      trustStoreId: SAMPLE_TRUST_STORE_ID,
      trustStoreArn,
    });
  });

  test.each([
    '', 'a'.repeat(65),
  ])('throws if trustStoreName is %s', (trustStoreName) => {
    expect(() => {
      new TrustStore(stack, 'TrustStore', {
        trustStoreName,
        caCertificatesBundleS3Location: {
          bucket,
          key: 'ca-bundle.pem',
        },
      });
    }).toThrow(`'trustStoreName' must be between 1 and 64 characters, got ${trustStoreName.length} characters`);
  });

  test.each([
    'a', 'a'.repeat(64),
  ])('accepts trustStoreName with %s', (trustStoreName) => {
    new TrustStore(stack, 'TrustStore', {
      trustStoreName,
      caCertificatesBundleS3Location: {
        bucket,
        key: 'ca-bundle.pem',
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::CloudFront::TrustStore', {
      Name: trustStoreName,
    });
  });

  test('throws if S3 key is an empty string', () => {
    expect(() => {
      new TrustStore(stack, 'TrustStore', {
        caCertificatesBundleS3Location: {
          bucket,
          key: '',
        },
      });
    }).toThrow("'caCertificatesBundleS3Location.key' cannot be an empty string");
  });

  test('with OCSP and tags', () => {
    new TrustStore(stack, 'TrustStore', {
      caCertificatesBundleS3Location: {
        bucket,
        key: 'ca-bundle.pem',
      },
      useClientCertificateOcspEndpoint: true,
      tags: { team: 'platform' },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::CloudFront::TrustStore', {
      UseClientCertificateOCSPEndpoint: true,
      Tags: [{ Key: 'team', Value: 'platform' }],
    });
  });

  test('uses the region of an imported bucket from another region', () => {
    const importedBucket = s3.Bucket.fromBucketAttributes(stack, 'ImportedBucket', {
      bucketName: 'my-certs-bucket',
      region: 'eu-west-1',
    });

    new TrustStore(stack, 'TrustStore', {
      caCertificatesBundleS3Location: {
        bucket: importedBucket,
        key: 'ca-bundle.pem',
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::CloudFront::TrustStore', {
      CaCertificatesBundleSource: {
        CaCertificatesBundleS3Location: Match.objectLike({ Bucket: 'my-certs-bucket', Region: 'eu-west-1' }),
      },
    });
  });

  test('explicit region overrides the region of the bucket', () => {
    const importedBucket = s3.Bucket.fromBucketName(stack, 'ImportedBucket', 'my-certs-bucket');

    new TrustStore(stack, 'TrustStore', {
      caCertificatesBundleS3Location: {
        bucket: importedBucket,
        key: 'ca-bundle.pem',
        region: 'ap-northeast-1',
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::CloudFront::TrustStore', {
      CaCertificatesBundleSource: {
        CaCertificatesBundleS3Location: Match.objectLike({ Region: 'ap-northeast-1' }),
      },
    });
  });

  test('uses the stack region token in an environment-agnostic stack', () => {
    const agnosticStack = new Stack(app, 'AgnosticStack');
    const agnosticBucket = new s3.Bucket(agnosticStack, 'Bucket');

    new TrustStore(agnosticStack, 'TrustStore', {
      caCertificatesBundleS3Location: {
        bucket: agnosticBucket,
        key: 'ca-bundle.pem',
      },
    });

    Template.fromStack(agnosticStack).hasResourceProperties('AWS::CloudFront::TrustStore', {
      CaCertificatesBundleSource: {
        CaCertificatesBundleS3Location: Match.objectLike({ Region: { Ref: 'AWS::Region' } }),
      },
    });
  });

  test('does not validate token values for trustStoreName and key', () => {
    const trustStoreName = Lazy.string({ produce: () => 'resolved-name' });
    const key = Lazy.string({ produce: () => 'resolved-key.pem' });

    new TrustStore(stack, 'TrustStore', {
      trustStoreName,
      caCertificatesBundleS3Location: {
        bucket,
        key,
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::CloudFront::TrustStore', {
      Name: 'resolved-name',
      CaCertificatesBundleSource: {
        CaCertificatesBundleS3Location: Match.objectLike({ Key: 'resolved-key.pem' }),
      },
    });
  });

  test('exposes status and number of CA certificates attributes', () => {
    const trustStore = new TrustStore(stack, 'TrustStore', {
      caCertificatesBundleS3Location: {
        bucket,
        key: 'ca-bundle.pem',
      },
    });

    expect(stack.resolve(trustStore.trustStoreStatus)).toEqual({ 'Fn::GetAtt': ['TrustStore982C25D3', 'Status'] });
    expect(stack.resolve(trustStore.trustStoreNumberOfCaCertificates)).toEqual({ 'Fn::GetAtt': ['TrustStore982C25D3', 'NumberOfCaCertificates'] });
  });
});
