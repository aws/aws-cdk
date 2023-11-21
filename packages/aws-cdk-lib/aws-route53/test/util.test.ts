import * as iam from '../../aws-iam';
import * as cdk from '../../core';
import { HostedZone } from '../lib';
import { DelegationGrantNames } from '../lib/delegation-grant-names';
import * as util from '../lib/util';

describe('util', () => {
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

  test('grant delegation without names returns ChangeResourceRecordSets statement with only two condition keys', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const grantee = new iam.User(stack, 'Grantee');

    // WHEN
    const actual = util.makeGrantDelegation(grantee, 'hosted-zone');

    // WHEN
    const statement = actual.principalStatements.find(x => x.actions.includes('route53:ChangeResourceRecordSets'));
    expect(statement).not.toBeUndefined();
    expect(statement?.conditions).toEqual({
      'ForAllValues:StringEquals': {
        'route53:ChangeResourceRecordSetsRecordTypes': ['NS'],
        'route53:ChangeResourceRecordSetsActions': ['UPSERT', 'DELETE'],
      },
    });
  });

  test('grant delegation with equals names returns ChangeResourceRecordSets statement with normalized record names condition', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const grantee = new iam.User(stack, 'Grantee');

    // WHEN
    const actual = util.makeGrantDelegation(grantee, 'hosted-zone', DelegationGrantNames.ofEquals('name-1', 'name-2'));

    // WHEN
    const statement = actual.principalStatements.find(x => x.actions.includes('route53:ChangeResourceRecordSets'));
    expect(statement).not.toBeUndefined();
    expect(statement?.conditions).toEqual({
      'ForAllValues:StringEquals': {
        'route53:ChangeResourceRecordSetsRecordTypes': ['NS'],
        'route53:ChangeResourceRecordSetsActions': ['UPSERT', 'DELETE'],
        'route53:ChangeResourceRecordSetsNormalizedRecordNames': ['name-1', 'name-2'],
      },
    });
  });

  test('grant delegation with like names returns ChangeResourceRecordSets statement with normalized record names condition', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const grantee = new iam.User(stack, 'Grantee');

    // WHEN
    const actual = util.makeGrantDelegation(grantee, 'hosted-zone', DelegationGrantNames.ofLike('name-1', 'name-2'));

    // WHEN
    const statement = actual.principalStatements.find(x => x.actions.includes('route53:ChangeResourceRecordSets'));
    expect(statement).not.toBeUndefined();
    expect(statement?.conditions).toEqual({
      'ForAllValues:StringEquals': {
        'route53:ChangeResourceRecordSetsRecordTypes': ['NS'],
        'route53:ChangeResourceRecordSetsActions': ['UPSERT', 'DELETE'],
      },
      'ForAllValues:StringLike': {
        'route53:ChangeResourceRecordSetsNormalizedRecordNames': ['name-1', 'name-2'],
      },
    });
  });
});
