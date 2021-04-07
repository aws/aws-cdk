import { expect } from '@aws-cdk/assert-internal';
import * as iam from '@aws-cdk/aws-iam';
import * as cdk from '@aws-cdk/core';
import { nodeunitShim, Test } from 'nodeunit-shim';
import { HostedZone, PublicHostedZone } from '../lib';

nodeunitShim({
  'Hosted Zone': {
    'Hosted Zone constructs the ARN'(test: Test) {
      // GIVEN
      const stack = new cdk.Stack(undefined, 'TestStack', {
        env: { account: '123456789012', region: 'us-east-1' },
      });

      const testZone = new HostedZone(stack, 'HostedZone', {
        zoneName: 'testZone',
      });

      test.deepEqual(stack.resolve(testZone.hostedZoneArn), {
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

      test.done();
    },
  },

  'Supports tags'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const hostedZone = new HostedZone(stack, 'HostedZone', {
      zoneName: 'test.zone',
    });
    cdk.Tags.of(hostedZone).add('zoneTag', 'inMyZone');

    // THEN
    expect(stack).toMatch({
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

    test.done();
  },

  'with crossAccountZoneDelegationPrincipal'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack(undefined, 'TestStack', {
      env: { account: '123456789012', region: 'us-east-1' },
    });

    // WHEN
    new PublicHostedZone(stack, 'HostedZone', {
      zoneName: 'testZone',
      crossAccountZoneDelegationPrincipal: new iam.AccountPrincipal('223456789012'),
    });

    // THEN
    expect(stack).toMatch({
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

    test.done();
  },
});
