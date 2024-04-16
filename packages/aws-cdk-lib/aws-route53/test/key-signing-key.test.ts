import { testDeprecated } from '@aws-cdk/cdk-build-tools';
import { Match, Template } from '../../assertions';
import * as kms from '../../aws-kms';
import * as cdk from '../../core';
import { HostedZone, KeySigningKey, KeySigningKeyStatus } from '../lib';

describe('key signing key', () => {
  test('basic creation', () => {
    const stack = new cdk.Stack();
    const zone = new HostedZone(stack, 'TestZone', {
      zoneName: 'testZone',
    });
    const key = new kms.Key(stack, 'TestKey', {
      keySpec: kms.KeySpec.ECC_NIST_P256,
      keyUsage: kms.KeyUsage.SIGN_VERIFY,
    });

    new KeySigningKey(stack, 'TestKSK', {
      hostedZone: zone,
      kmsKey: key,
      keySigningKeyName: 'testkey',
      status: KeySigningKeyStatus.ACTIVE,
    });

    Template.fromStack(stack).hasResource('AWS::Route53::KeySigningKey', {
      Properties: {
        HostedZoneId: stack.resolve(zone.hostedZoneId),
        KeyManagementServiceArn: stack.resolve(key.keyArn),
        Name: 'testkey',
        Status: 'ACTIVE',
      },
    });
  });

  test('name is auto-generated when omitted', () => {
    const stack = new cdk.Stack();
    const zone = new HostedZone(stack, 'TestZone', {
      zoneName: 'testZone',
    });
    const key = new kms.Key(stack, 'TestKey', {
      keySpec: kms.KeySpec.ECC_NIST_P256,
      keyUsage: kms.KeyUsage.SIGN_VERIFY,
    });

    new KeySigningKey(stack, 'TestKSK', {
      hostedZone: zone,
      kmsKey: key,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Route53::KeySigningKey', {
      Name: Match.stringLikeRegexp('^[a-zA-Z0-9_]{3,128}$'),
    });
  });

  test('status defaults to active', () => {
    const stack = new cdk.Stack();
    const zone = new HostedZone(stack, 'TestZone', {
      zoneName: 'testZone',
    });
    const key = new kms.Key(stack, 'TestKey', {
      keySpec: kms.KeySpec.ECC_NIST_P256,
      keyUsage: kms.KeyUsage.SIGN_VERIFY,
    });

    new KeySigningKey(stack, 'TestKSK', {
      hostedZone: zone,
      kmsKey: key,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Route53::KeySigningKey', {
      Status: 'ACTIVE',
    });
  });

  test('importing works correctly with imported zone', () => {
    const stack = new cdk.Stack();
    const zone = HostedZone.fromHostedZoneId(stack, 'TestZone', 'Z123456789012EXAMPLE');

    const ksk = KeySigningKey.fromKeySigningKeyAttributes(stack, 'TestKSK', {
      hostedZone: zone,
      keySigningKeyName: 'testksk',
    });

    expect(ksk.keySigningKeyId).toBe(`${zone.hostedZoneId}|testksk`);
  });

  test('importing works correctly with created zone', () => {
    const stack = new cdk.Stack();
    const zone = new HostedZone(stack, 'TestZone', {
      zoneName: 'testZone',
    });

    const ksk = KeySigningKey.fromKeySigningKeyAttributes(stack, 'TestKSK', {
      hostedZone: zone,
      keySigningKeyName: 'testksk',
    });

    expect(ksk.keySigningKeyId).toBe(`${zone.hostedZoneId}|testksk`);
  });

  test('grants the required permissions on the KMS key', () => {
    const stack = new cdk.Stack();
    const zone = new HostedZone(stack, 'TestZone', {
      zoneName: 'testzone',
    });
    const key = new kms.Key(stack, 'TestKey', {
      keySpec: kms.KeySpec.ECC_NIST_P256,
      keyUsage: kms.KeyUsage.SIGN_VERIFY,
    });

    new KeySigningKey(stack, 'TestKSK', {
      hostedZone: zone,
      kmsKey: key,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::KMS::Key', {
      KeyPolicy: {
        Statement: Match.arrayWith([
          {
            Effect: 'Allow',
            Principal: {
              Service: 'dnssec-route53.amazonaws.com',
            },
            Action: ['kms:DescribeKey', 'kms:GetPublicKey', 'kms:Sign'],
            Resource: '*',
            Condition: {
              ArnEquals: {
                'aws:SourceArn': stack.resolve(zone.hostedZoneArn),
              },
            },
          },
          {
            Effect: 'Allow',
            Principal: {
              Service: 'dnssec-route53.amazonaws.com',
            },
            Action: 'kms:CreateGrant',
            Resource: '*',
            Condition: {
              Bool: {
                'kms:GrantIsForAWSResource': true,
              },
            },
          },
        ]),
      },
    });
  });
});
