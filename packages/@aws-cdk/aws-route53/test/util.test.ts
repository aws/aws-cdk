import * as cdk from '@aws-cdk/core';
import { HostedZone } from '../lib';
import * as util from '../lib/util';

describe('util', () => {
  test('throws when zone name ending with a \'.\'', () => {
    expect(() => util.validateZoneName('zone.name.')).toThrow(/trailing dot/);
  });

  test('accepts a valid domain name', () => {
    const domainName = 'amazonaws.com';
    util.validateZoneName(domainName);
  });

  test('providedName ending with a dot returns the name', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const providedName = 'test.domain.com.';
    const qualified = util.determineFullyQualifiedDomainName(providedName, HostedZone.fromHostedZoneAttributes(stack, 'HostedZone', {
      hostedZoneId: 'fakeId',
      zoneName: 'ignored',
    }));

    // THEN
    expect(qualified).toEqual('test.domain.com.');
  });

  test('providedName that matches zoneName returns providedName with a trailing dot', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const providedName = 'test.domain.com';
    const qualified = util.determineFullyQualifiedDomainName(providedName, HostedZone.fromHostedZoneAttributes(stack, 'HostedZone', {
      hostedZoneId: 'fakeId',
      zoneName: 'test.domain.com.',
    }));

    // THEN
    expect(qualified).toEqual('test.domain.com.');
  });

  test('providedName that ends with zoneName returns providedName with a trailing dot', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const providedName = 'test.domain.com';
    const qualified = util.determineFullyQualifiedDomainName(providedName, HostedZone.fromHostedZoneAttributes(stack, 'HostedZone', {
      hostedZoneId: 'fakeId',
      zoneName: 'domain.com.',
    }));

    // THEN
    expect(qualified).toEqual('test.domain.com.');
  });

  test('providedName that does not match zoneName concatenates providedName and zoneName', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const providedName = 'test';
    const qualified = util.determineFullyQualifiedDomainName(providedName, HostedZone.fromHostedZoneAttributes(stack, 'HostedZone', {
      hostedZoneId: 'fakeId',
      zoneName: 'domain.com.',
    }));

    // THEN
    expect(qualified).toEqual('test.domain.com.');
  });
});
