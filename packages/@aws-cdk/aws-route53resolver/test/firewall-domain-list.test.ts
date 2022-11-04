import * as path from 'path';
import { Template } from '@aws-cdk/assertions';
import { Bucket } from '@aws-cdk/aws-s3';
import { Stack } from '@aws-cdk/core';
import { FirewallDomainList, FirewallDomains } from '../lib';

let stack: Stack;
beforeEach(() => {
  stack = new Stack();
});

test('domain list from strings', () => {
  // WHEN
  new FirewallDomainList(stack, 'List', {
    domains: FirewallDomains.fromList([
      'first-domain.com',
      'second-domain.net',
      '*.wildcard.com',
    ]),
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::Route53Resolver::FirewallDomainList', {
    Domains: [
      'first-domain.com',
      'second-domain.net',
      '*.wildcard.com',
    ],
  });
});

test('domain list from S3 URL', () => {
  // WHEN
  new FirewallDomainList(stack, 'List', {
    domains: FirewallDomains.fromS3Url('s3://bucket/prefix/object'),
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::Route53Resolver::FirewallDomainList', {
    DomainFileUrl: 's3://bucket/prefix/object',
  });
});

test('domain list from S3', () => {
  // WHEN
  new FirewallDomainList(stack, 'List', {
    domains: FirewallDomains.fromS3(Bucket.fromBucketName(stack, 'Bucket', 'bucket'), 'prefix/object'),
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::Route53Resolver::FirewallDomainList', {
    DomainFileUrl: 's3://bucket/prefix/object',
  });
});

test('domain list from asset', () => {
  // WHEN
  new FirewallDomainList(stack, 'List', {
    domains: FirewallDomains.fromAsset(path.join(__dirname, 'domains.txt')),
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::Route53Resolver::FirewallDomainList', {
    DomainFileUrl: {
      'Fn::Sub': 's3://cdk-hnb659fds-assets-${AWS::AccountId}-${AWS::Region}/e820b3f07bf66854be0dfd6f3ec357a10d644f2011069e5ad07d42f4f89ed35a.txt',
    },
  });
});

test('throws with invalid name', () => {
  expect(() => new FirewallDomainList(stack, 'List', {
    name: 'Inv@lid',
    domains: FirewallDomains.fromList(['domain.com']),
  })).toThrow(/Invalid domain list name/);
});

test('throws with invalid domain', () => {
  expect(() => new FirewallDomainList(stack, 'List', {
    domains: FirewallDomains.fromList(['valid.fr', 'inv@lid.com']),
  })).toThrow(/Invalid domain/);
});

test('throws with fromAsset and not .txt', () => {
  expect(() => new FirewallDomainList(stack, 'List', {
    domains: FirewallDomains.fromAsset('image.jpg'),
  })).toThrow(/expects a file with the .txt extension/);
});

test('throws with invalid S3 URL', () => {
  expect(() => new FirewallDomainList(stack, 'List', {
    domains: FirewallDomains.fromS3Url('https://invalid/bucket/url'),
  })).toThrow(/The S3 URL must start with s3:\/\//);
});
