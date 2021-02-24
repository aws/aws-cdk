import { expect, haveResource, ResourcePart } from '@aws-cdk/assert';
import { Port } from '@aws-cdk/aws-ec2';
import * as ga from '../lib';
import { testFixture, testFixtureAlb } from './util';

test('custom resource exists', () => {
  // GIVEN
  const { stack, vpc } = testFixture();
  const accelerator = new ga.Accelerator(stack, 'Accelerator');
  const listener = new ga.Listener(stack, 'Listener', {
    accelerator,
    portRanges: [
      {
        fromPort: 443,
        toPort: 443,
      },
    ],
  });
  const endpointGroup = new ga.EndpointGroup(stack, 'Group', { listener });

  // WHEN
  ga.AcceleratorSecurityGroup.fromVpc(stack, 'GlobalAcceleratorSG', vpc, endpointGroup);

  // THEN
  expect(stack).to(haveResource('Custom::AWS', {
    Properties: {
      ServiceToken: {
        'Fn::GetAtt': [
          'AWS679f53fac002430cb0da5b7982bd22872D164C4C',
          'Arn',
        ],
      },
      Create: {
        'Fn::Join': [
          '',
          [
            '{"service":"EC2","action":"describeSecurityGroups","parameters":{"Filters":[{"Name":"group-name","Values":["GlobalAccelerator"]},{"Name":"vpc-id","Values":["',
            {
              Ref: 'VPCB9E5F0B4',
            },
            '"]}]},"physicalResourceId":{"responsePath":"SecurityGroups.0.GroupId"}}',
          ],
        ],
      },
      InstallLatestAwsSdk: true,
    },
    DependsOn: [
      'GlobalAcceleratorSGCustomResourceCustomResourcePolicyF3294553',
      'GroupC77FDACD',
    ],
  }, ResourcePart.CompleteDefinition));
});

test('can create security group rule', () => {
  // GIVEN
  const { stack, alb, vpc } = testFixtureAlb();
  const accelerator = new ga.Accelerator(stack, 'Accelerator');
  const listener = new ga.Listener(stack, 'Listener', {
    accelerator,
    portRanges: [
      {
        fromPort: 443,
        toPort: 443,
      },
    ],
  });
  const endpointGroup = new ga.EndpointGroup(stack, 'Group', { listener });
  endpointGroup.addLoadBalancer('endpoint', alb);

  // WHEN
  const sg = ga.AcceleratorSecurityGroup.fromVpc(stack, 'GlobalAcceleratorSG', vpc, endpointGroup);
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
