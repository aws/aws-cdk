import { Template } from '@aws-cdk/assertions';
import * as iam from '@aws-cdk/aws-iam';
import * as cdk from '@aws-cdk/core';
import { HostedZone, PublicHostedZone } from '../lib';

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

  test('with crossAccountZoneDelegationPrincipal', () => {
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

  test('with crossAccountZoneDelegationPrincipal, throws if name provided without principal', () => {
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
});
