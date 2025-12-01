import * as iam from '../../aws-iam';
import * as cdk from '../../core';
import { GrantDelegationOptions, HostedZone } from '../lib';
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

  test('grantDelegation without delegatedZoneNames returns ChangeResourceRecordSets statement without normalized record names condition', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const grantee = new iam.User(stack, 'Grantee');
    const hostedZone = new HostedZone(stack, 'zone', {
      zoneName: 'example.com',
    });

    // WHEN
    const actual = util.makeGrantDelegation(grantee, hostedZone);

    // THEN
    const statement = actual.principalStatements.find(x => x.actions.includes('route53:ChangeResourceRecordSets'));
    expect(statement).not.toBeUndefined();
    expect(statement?.conditions).toEqual({
      'ForAllValues:StringEquals': {
        'route53:ChangeResourceRecordSetsRecordTypes': ['NS'],
        'route53:ChangeResourceRecordSetsActions': ['UPSERT', 'DELETE'],
      },
    });
  });

  test('grantDelegation with delegatedZoneNames returns ChangeResourceRecordSets statement with normalized record names condition', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const grantee = new iam.User(stack, 'Grantee');
    const hostedZone = new HostedZone(stack, 'zone', {
      zoneName: 'example.com.',
    });

    // WHEN
    const actual = util.makeGrantDelegation(grantee, hostedZone, {
      delegatedZoneNames: ['gamma.example.com', 'beta.example.com'],
    });

    // THEN
    const statement = actual.principalStatements.find(x => x.actions.includes('route53:ChangeResourceRecordSets'));
    expect(statement).not.toBeUndefined();
    expect(statement?.conditions).toEqual({
      'ForAllValues:StringEquals': {
        'route53:ChangeResourceRecordSetsRecordTypes': ['NS'],
        'route53:ChangeResourceRecordSetsActions': ['UPSERT', 'DELETE'],
        'route53:ChangeResourceRecordSetsNormalizedRecordNames': ['gamma.example.com', 'beta.example.com'],
      },
    });
  });

  test('grantDelegation with delegatedZoneNames returns ChangeResourceRecordSets statement with octal encoded zone name', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const grantee = new iam.User(stack, 'Grantee');
    const hostedZone = new HostedZone(stack, 'zone', {
      zoneName: 'example.com',
    });

    // WHEN
    const actual = util.makeGrantDelegation(grantee, hostedZone, {
      delegatedZoneNames: ['!"#$%&\'()*+,-/:;<=>?@[\]^_`{|}~.example.com'],
    });

    // THEN
    const statement = actual.principalStatements.find(x => x.actions.includes('route53:ChangeResourceRecordSets'));
    expect(statement).not.toBeUndefined();
    expect(statement?.conditions).toEqual({
      'ForAllValues:StringEquals': {
        'route53:ChangeResourceRecordSetsRecordTypes': ['NS'],
        'route53:ChangeResourceRecordSetsActions': ['UPSERT', 'DELETE'],
        'route53:ChangeResourceRecordSetsNormalizedRecordNames': ['\\041\\042\\043\\044\\045\\046\\047\\050\\051\\052\\053\\054-\\057\\072\\073\\074\\075\\076\\077\\100\\133\\135\\136_\\140\\173\\174\\175\\176.example.com'],
      },
    });
  },
  );

  test('grantDelegation with token in delegatedZoneNames bypasses validation', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const grantee = new iam.User(stack, 'Grantee');
    const hostedZone = new HostedZone(stack, 'zone', {
      zoneName: 'example.com.',
    });

    // WHEN
    const delegatedZoneName = cdk.Token.asAny('my-zone-name').toString();
    const actual = util.makeGrantDelegation(grantee, hostedZone, {
      delegatedZoneNames: [delegatedZoneName],
    });

    // THEN
    const statement = actual.principalStatements.find(x => x.actions.includes('route53:ChangeResourceRecordSets'));
    expect(statement).not.toBeUndefined();
    expect(statement?.conditions).toEqual({
      'ForAllValues:StringEquals': {
        'route53:ChangeResourceRecordSetsRecordTypes': ['NS'],
        'route53:ChangeResourceRecordSetsActions': ['UPSERT', 'DELETE'],
        'route53:ChangeResourceRecordSetsNormalizedRecordNames': [delegatedZoneName],
      },
    });
  });

  test('grantDelegation with token in delegatedZoneNames but suffixed with period fails validation', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const grantee = new iam.User(stack, 'Grantee');
    const hostedZone = new HostedZone(stack, 'zone', {
      zoneName: 'example.com.',
    });

    // WHEN
    const opts: GrantDelegationOptions = {
      delegatedZoneNames: [`${cdk.Token.asAny('my-zone-name').toString()}.`],
    };

    // THEN
    expect(() =>
      util.makeGrantDelegation(grantee, hostedZone, opts),
    ).toThrow(cdk.UnscopedValidationError);
  });

  test('grantDelegation with token in hosted zone partially bypasses validation', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const grantee = new iam.User(stack, 'Grantee');
    const hostedZone = new HostedZone(stack, 'zone', {
      zoneName: cdk.Token.asAny('my-zone-name').toString(),
    });

    // WHEN
    const delegatedZoneName = 'bob.example.com';
    const actual = util.makeGrantDelegation(grantee, hostedZone, {
      delegatedZoneNames: [delegatedZoneName],
    });

    // THEN
    const statement = actual.principalStatements.find(x => x.actions.includes('route53:ChangeResourceRecordSets'));
    expect(statement).not.toBeUndefined();
    expect(statement?.conditions).toEqual({
      'ForAllValues:StringEquals': {
        'route53:ChangeResourceRecordSetsRecordTypes': ['NS'],
        'route53:ChangeResourceRecordSetsActions': ['UPSERT', 'DELETE'],
        'route53:ChangeResourceRecordSetsNormalizedRecordNames': [delegatedZoneName],
      },
    });
  });

  test.each([[' '], ['com'], ['example.com'], ['a.example.com.'], ['A.example.com']])(
    'grantDelegation with invalid delegated zone name \'%s\' throws UnscopedValidationError',
    (invalidZoneName) => {
      // GIVEN
      const stack = new cdk.Stack();
      const grantee = new iam.User(stack, 'Grantee');
      const hostedZone = new HostedZone(stack, 'zone', {
        zoneName: 'example.com',
      });

      // WHEN
      const opts: GrantDelegationOptions = { delegatedZoneNames: [invalidZoneName] };

      // THEN
      expect(() =>
        util.makeGrantDelegation(grantee, hostedZone, opts),
      ).toThrow(cdk.UnscopedValidationError);
    },
  );
});
