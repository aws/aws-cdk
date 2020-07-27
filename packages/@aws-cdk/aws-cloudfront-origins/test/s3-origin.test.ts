import '@aws-cdk/assert/jest';
import * as s3 from '@aws-cdk/aws-s3';
import { App, Stack } from '@aws-cdk/core';
import { S3Origin } from '../lib';

let app: App;
let stack: Stack;

beforeEach(() => {
  app = new App();
  stack = new Stack(app, 'Stack', {
    env: { account: '1234', region: 'testregion' },
  });
});

test('With non-website bucket, renders all required properties, including S3Origin config', () => {
  const bucket = new s3.Bucket(stack, 'Bucket');

  const origin = new S3Origin(bucket);
  origin.bind(stack, { originIndex: 0 });

  expect(origin.renderOrigin()).toEqual({
    id: 'StackOrigin029E19582',
    domainName: bucket.bucketRegionalDomainName,
    s3OriginConfig: {
      originAccessIdentity: 'origin-access-identity/cloudfront/${Token[TOKEN.69]}',
    },
  });
});

test('With website bucket, renders all required properties, including custom origin config', () => {
  const bucket = new s3.Bucket(stack, 'Bucket', {
    websiteIndexDocument: 'index.html',
  });

  const origin = new S3Origin(bucket);
  origin.bind(stack, { originIndex: 0 });

  expect(origin.renderOrigin()).toEqual({
    id: 'StackOrigin029E19582',
    domainName: bucket.bucketWebsiteDomainName,
    customOriginConfig: {
      originProtocolPolicy: 'http-only',
    },
  });
});

test('Respects props passed down to underlying origin', () => {
  const bucket = new s3.Bucket(stack, 'Bucket', {
    websiteIndexDocument: 'index.html',
  });

  const origin = new S3Origin(bucket, { originPath: '/website' });
  origin.bind(stack, { originIndex: 0 });

  expect(origin.renderOrigin()).toEqual({
    id: 'StackOrigin029E19582',
    domainName: bucket.bucketWebsiteDomainName,
    originPath: '/website',
    customOriginConfig: {
      originProtocolPolicy: 'http-only',
    },
  });
});