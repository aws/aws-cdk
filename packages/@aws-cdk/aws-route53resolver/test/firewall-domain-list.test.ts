import '@aws-cdk/assert-internal/jest';
import { Stack } from '@aws-cdk/core';
import { FirewallDomainList, FirewallDomains } from '../lib';

let stack: Stack;
beforeEach(() => {
  stack = new Stack();
});

test('domain list from strings', () => {
  // WHEN
  new FirewallDomainList(stack, 'List', {
    domains: FirewallDomains.fromList(['first-domain.com', 'second-domain.net']),
  });

  // THEN
  expect(stack).toHaveResource('AWS::Route53Resolver::FirewallDomainList', {
    Domains: [
      'first-domain.com',
      'second-domain.net',
    ],
  });
});

test('domain list from S3 URI', () => {
  // WHEN
  new FirewallDomainList(stack, 'List', {
    domains: FirewallDomains.fromS3Uri('s3://bucket/prefix/object'),
  });

  // THEN
  expect(stack).toHaveResource('AWS::Route53Resolver::FirewallDomainList', {
    DomainFileUrl: 's3://bucket/prefix/object',
  });
});

test('throws with invalid S3 URI', () => {
  expect(() => new FirewallDomainList(stack, 'List', {
    domains: FirewallDomains.fromS3Uri('https://invalid/bucket/uri'),
  })).toThrow(/The S3 URI must start with s3:\/\//);
});