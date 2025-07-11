import * as cloudfront from '../../aws-cloudfront';
import * as origins from '../../aws-cloudfront-origins';
import * as s3 from '../../aws-s3';
import { Duration, Stack } from '../../core';

describe('S3StaticWebsiteOrigin', () => {
  let stack: Stack;

  describe('test setup using new bucket', () => {
    let bucket: s3.Bucket;

    beforeEach(() => {
      stack = new Stack();
      bucket = new s3.Bucket(stack, 'myStaticWebsiteBucket', {
        websiteIndexDocument: 'index.html',
      });
    });

    test('creates a S3 static website origin with default properties set', () => {
      const origin = new origins.S3StaticWebsiteOrigin(bucket);
      const originBindConfig = origin.bind(stack, { originId: 'StackOrigin12AB34569' });

      expect(originBindConfig.originProperty).toEqual({
        id: 'StackOrigin12AB34569',
        domainName: bucket.bucketWebsiteDomainName,
        customOriginConfig: {
          originSslProtocols: ['TLSv1.2'],
          originProtocolPolicy: 'http-only',
        },
      });
    });

    test('creates a S3 static website origin with custom properties', () => {
      const origin = new origins.S3StaticWebsiteOrigin(bucket, {
        originPath: '/assets',
        protocolPolicy: cloudfront.OriginProtocolPolicy.HTTP_ONLY,
        originSslProtocols: [cloudfront.OriginSslPolicy.TLS_V1_1, cloudfront.OriginSslPolicy.TLS_V1_2],
        httpPort: 8080,
        httpsPort: 8081,
        readTimeout: Duration.seconds(60),
        keepaliveTimeout: Duration.seconds(60),
        connectionAttempts: 2,
        connectionTimeout: Duration.seconds(5),
        customHeaders: {
          'X-Custom-Header': 'custom-value',
        },
      });
      const originBindConfig = origin.bind(stack, { originId: 'StackOrigin12AB34569' });

      expect(originBindConfig.originProperty).toEqual({
        id: 'StackOrigin12AB34569',
        domainName: bucket.bucketWebsiteDomainName,
        originPath: '/assets',
        customOriginConfig: {
          originSslProtocols: ['TLSv1.1', 'TLSv1.2'],
          originProtocolPolicy: 'http-only',
          httpPort: 8080,
          httpsPort: 8081,
          originReadTimeout: 60,
          originKeepaliveTimeout: 60,
        },
        connectionAttempts: 2,
        connectionTimeout: 5,
        originCustomHeaders: [
          {
            headerName: 'X-Custom-Header',
            headerValue: 'custom-value',
          },
        ],
      });
    });
  });

  describe('using imported bucket', () => {
    test('can setup S3 static website origin with imported bucket', () => {
      const bucket = s3.Bucket.fromBucketName(stack, 'myImportedStaticWebsiteBucket', 'my-bucket');
      const origin = new origins.S3StaticWebsiteOrigin(bucket, {
        originPath: '/assets',
      });
      const originBindConfig = origin.bind(stack, { originId: 'StackOrigin12AB34569' });

      expect(originBindConfig.originProperty).toEqual({
        id: 'StackOrigin12AB34569',
        originPath: '/assets',
        domainName: bucket.bucketWebsiteDomainName,
        customOriginConfig: {
          originSslProtocols: ['TLSv1.2'],
          originProtocolPolicy: 'http-only',
        },
      });
    });
  });
});
