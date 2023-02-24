import { Template } from '@aws-cdk/assertions';
import * as ec2 from '@aws-cdk/aws-ec2';
import { testFixture } from './util';
import * as ga from '../lib';

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
  endpointGroup.connectionsPeer('GlobalAcceleratorSG', vpc);

  // THEN
  Template.fromStack(stack).hasResource('Custom::AWS', {
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
      InstallLatestAwsSdk: false,
    },
    DependsOn: [
      'GroupGlobalAcceleratorSGCustomResourceCustomResourcePolicy9C957AD2',
      'GroupC77FDACD',
    ],
  });
});

test('can create security group rule', () => {
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
  const gaSg = endpointGroup.connectionsPeer('GlobalAcceleratorSG', vpc);
  const instanceSg = new ec2.SecurityGroup(stack, 'SG', { vpc });
  const instanceConnections = new ec2.Connections({ securityGroups: [instanceSg] });
  instanceConnections.allowFrom(gaSg, ec2.Port.tcp(443));

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::EC2::SecurityGroupIngress', {
    IpProtocol: 'tcp',
    FromPort: 443,
    GroupId: {
      'Fn::GetAtt': [
        'SGADB53937',
        'GroupId',
      ],
    },
    SourceSecurityGroupId: {
      'Fn::GetAtt': [
        'GroupGlobalAcceleratorSGCustomResource0C8056E9',
        'SecurityGroups.0.GroupId',
      ],
    },
    ToPort: 443,
  });
});
