import { Match, Template } from '@aws-cdk/assertions';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as iam from '@aws-cdk/aws-iam';
import { testDeprecated } from '@aws-cdk/cdk-build-tools';
import * as cdk from '@aws-cdk/core';
import { HostedZone, PrivateHostedZone, PublicHostedZone } from '../lib';

describe('hosted zone', () => {
  describe('Hosted Zone', () => {
    test('Hosted Zone constructs the ARN', () => {
      // GIVEN
      const stack = new cdk.Stack(undefined, 'TestStack', {
        env: { account: '123456789012', region: 'us-east-1' },
      });

      const testZone = new HostedZone(stack, 'HostedZone', {
        zoneName: 'testZone',
      });

      expect(stack.resolve(testZone.hostedZoneArn)).toEqual({
        'Fn::Join': [
          '',
          [
            'arn:',
            { Ref: 'AWS::Partition' },
            ':route53:::hostedzone/',
            { Ref: 'HostedZoneDB99F866' },
          ],
        ],
      });
    });
  });

  test('Supports tags', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const hostedZone = new HostedZone(stack, 'HostedZone', {
      zoneName: 'test.zone',
    });
    cdk.Tags.of(hostedZone).add('zoneTag', 'inMyZone');

    // THEN
    Template.fromStack(stack).templateMatches({
      Resources: {
        HostedZoneDB99F866: {
          Type: 'AWS::Route53::HostedZone',
          Properties: {
            Name: 'test.zone.',
            HostedZoneTags: [
              {
                Key: 'zoneTag',
                Value: 'inMyZone',
              },
            ],
          },
        },
      },
    });
  });

  testDeprecated('with crossAccountZoneDelegationPrincipal', () => {
    // GIVEN
    const stack = new cdk.Stack(undefined, 'TestStack', {
      env: { account: '123456789012', region: 'us-east-1' },
    });

    // WHEN
    new PublicHostedZone(stack, 'HostedZone', {
      zoneName: 'testZone',
      crossAccountZoneDelegationPrincipal: new iam.AccountPrincipal('223456789012'),
      crossAccountZoneDelegationRoleName: 'myrole',
    });

    // THEN
    Template.fromStack(stack).templateMatches({
      Resources: {
        HostedZoneDB99F866: {
          Type: 'AWS::Route53::HostedZone',
          Properties: {
            Name: 'testZone.',
          },
        },
        HostedZoneCrossAccountZoneDelegationRole685DF755: {
          Type: 'AWS::IAM::Role',
          Properties: {
            RoleName: 'myrole',
            AssumeRolePolicyDocument: {
              Statement: [
                {
                  Action: 'sts:AssumeRole',
                  Effect: 'Allow',
                  Principal: {
                    AWS: {
                      'Fn::Join': [
                        '',
                        [
                          'arn:',
                          {
                            Ref: 'AWS::Partition',
                          },
                          ':iam::223456789012:root',
                        ],
                      ],
                    },
                  },
                },
              ],
              Version: '2012-10-17',
            },
            Policies: [
              {
                PolicyDocument: {
                  Statement: [
                    {
                      Action: 'route53:ChangeResourceRecordSets',
                      Effect: 'Allow',
                      Resource: {
                        'Fn::Join': [
                          '',
                          [
                            'arn:',
                            {
                              Ref: 'AWS::Partition',
                            },
                            ':route53:::hostedzone/',
                            {
                              Ref: 'HostedZoneDB99F866',
                            },
                          ],
                        ],
                      },
                      Condition: {
                        'ForAllValues:StringEquals': {
                          'route53:ChangeResourceRecordSetsRecordTypes': ['NS'],
                          'route53:ChangeResourceRecordSetsActions': ['UPSERT', 'DELETE'],
                        },
                      },
                    },
                    {
                      Action: 'route53:ListHostedZonesByName',
                      Effect: 'Allow',
                      Resource: '*',
                    },
                  ],
                  Version: '2012-10-17',
                },
                PolicyName: 'delegation',
              },
            ],
          },
        },
      },
    });
  });

  testDeprecated('with crossAccountZoneDelegationPrincipal, throws if name provided without principal', () => {
    // GIVEN
    const stack = new cdk.Stack(undefined, 'TestStack', {
      env: { account: '123456789012', region: 'us-east-1' },
    });

    // THEN
    expect(() => {
      new PublicHostedZone(stack, 'HostedZone', {
        zoneName: 'testZone',
        crossAccountZoneDelegationRoleName: 'myrole',
      });
    }).toThrow(/crossAccountZoneDelegationRoleName property is not supported without crossAccountZoneDelegationPrincipal/);
  });

  test('fromHostedZoneId throws error when zoneName is referenced', () => {
    // GIVEN
    const stack = new cdk.Stack(undefined, 'TestStack', {
      env: { account: '123456789012', region: 'us-east-1' },
    });

    // WHEN
    const hz = HostedZone.fromHostedZoneId(stack, 'HostedZone', 'abcdefgh');

    // THEN
    expect(() => {
      hz.zoneName;
    }).toThrow('Cannot reference `zoneName` when using `HostedZone.fromHostedZoneId()`. A construct consuming this hosted zone may be trying to reference its `zoneName`. If this is the case, use `fromHostedZoneAttributes()` or `fromLookup()` instead.');
  });

  test('fromLookup throws error when domainName is undefined', () => {
    // GIVEN
    let domainName!: string;
    const stack = new cdk.Stack(undefined, 'TestStack', {
      env: { account: '123456789012', region: 'us-east-1' },
    });

    // THEN
    expect(() => {
      HostedZone.fromLookup(stack, 'HostedZone', {
        domainName,
      });
    }).toThrow(/Cannot use undefined value for attribute `domainName`/);
  });
});

describe('Vpc', () => {
  test('different region in vpc and hosted zone', () => {
    // GIVEN
    const stack = new cdk.Stack(undefined, 'TestStack', {
      env: { account: '123456789012', region: 'us-east-1' },
    });

    // WHEN
    new PrivateHostedZone(stack, 'HostedZone', {
      vpc: ec2.Vpc.fromVpcAttributes(stack, 'Vpc', {
        vpcId: '1234',
        availabilityZones: ['region-12345a', 'region-12345b', 'region-12345c'],
        region: 'region-12345',
      }),
      zoneName: 'SomeZone',
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Route53::HostedZone', {
      VPCs: [
        {
          VPCId: '1234',
          VPCRegion: 'region-12345',
        },
      ],
      Name: Match.anyValue(),
    });
  });
});

test('grantDelegation', () => {
  // GIVEN
  const stack = new cdk.Stack(undefined, 'TestStack', {
    env: { account: '123456789012', region: 'us-east-1' },
  });

  const role = new iam.Role(stack, 'Role', {
    assumedBy: new iam.AccountPrincipal('22222222222222'),
  });

  const zone = new PublicHostedZone(stack, 'Zone', {
    zoneName: 'banana.com',
  });

  // WHEN
  zone.grantDelegation(role);

  // THEN
  const template = Template.fromStack(stack);
  template.hasResourceProperties('AWS::IAM::Policy', {
    PolicyDocument: {
      Statement: [
        {
          Action: 'route53:ChangeResourceRecordSets',
          Effect: 'Allow',
          Resource: {
            'Fn::Join': [
              '',
              [
                'arn:',
                {
                  Ref: 'AWS::Partition',
                },
                ':route53:::hostedzone/',
                {
                  Ref: 'ZoneA5DE4B68',
                },
              ],
            ],
          },
          Condition: {
            'ForAllValues:StringEquals': {
              'route53:ChangeResourceRecordSetsRecordTypes': ['NS'],
              'route53:ChangeResourceRecordSetsActions': ['UPSERT', 'DELETE'],
            },
          },
        },
        {
          Action: 'route53:ListHostedZonesByName',
          Effect: 'Allow',
          Resource: '*',
        },
      ],
    },
  });
});