import { expect, haveResource } from '@aws-cdk/assert';
import { Port } from '@aws-cdk/aws-ec2';
import * as ga from '../lib';
import { testFixture, testFixtureAlb } from './util';

test('custom resource exists', () => {
  // GIVEN
  const { stack, vpc } = testFixture();

  // WHEN
  ga.AcceleratorSecurityGroup.fromVpc(stack, 'GlobalAcceleratorSG', vpc);

  // THEN
  expect(stack).to(haveResource('Custom::AWS', {
    Create: {
      action: 'describeSecurityGroups',
      service: 'EC2',
      parameters: {
        Filters: [
          {
            Name: 'group-name',
            Values: [
              'GlobalAccelerator',
            ],
          },
          {
            Name: 'vpc-id',
            Values: [
              {
                Ref: 'VPCB9E5F0B4',
              },
            ],
          },
        ],
      },
      physicalResourceId: {
        responsePath: 'SecurityGroups.0.GroupId',
      },
    },
  }));
});

test('can create security group rule', () => {
  // GIVEN
  const { stack, alb, vpc } = testFixtureAlb();

  // WHEN
  const sg = ga.AcceleratorSecurityGroup.fromVpc(stack, 'GlobalAcceleratorSG', vpc);
  alb.connections.allowFrom(sg, Port.tcp(443));

  // THEN
  expect(stack).to(haveResource('AWS::EC2::SecurityGroupIngress', {
    IpProtocol: 'tcp',
    FromPort: 443,
    GroupId: {
      'Fn::GetAtt': [
        'ALBSecurityGroup8B8624F8',
        'GroupId',
      ],
    },
    SourceSecurityGroupId: {
      'Fn::GetAtt': [
        'GlobalAcceleratorSGCustomResourceC1DB5287',
        'SecurityGroups.0.GroupId',
      ],
    },
    ToPort: 443,
  }));
});