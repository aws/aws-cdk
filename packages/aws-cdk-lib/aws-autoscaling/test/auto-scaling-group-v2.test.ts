import { Template } from '../../assertions';
import * as ec2 from '../../aws-ec2';
import * as cdk from '../../core';
import * as autoscaling from '../lib';

function mockVpc(stack: cdk.Stack) {
  return ec2.Vpc.fromVpcAttributes(stack, 'MyVpc', {
    vpcId: 'my-vpc',
    availabilityZones: ['az1'],
    publicSubnetIds: ['pub1'],
    privateSubnetIds: ['pri1'],
    isolatedSubnetIds: [],
  });
}

describe('auto scaling group', () => {
  test('can use imported Lanuch Template with ID', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new autoscaling.AutoScalingGroup(stack, 'imported-template-asg', {
      launchTemplate: ec2.LaunchTemplate.fromLaunchTemplateAttributes(stack, 'imported-tamplate', {
        launchTemplateId: 'test-template-id',
        versionNumber: '0',
      }),
      vpc: mockVpc(stack),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AutoScaling::AutoScalingGroup', {
      LaunchTemplate: {
        LaunchTemplateId: 'test-template-id',
        Version: '0',
      },
    });
  });

  test('can use imported Launch Template with name', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new autoscaling.AutoScalingGroup(stack, 'imported-template-asg', {
      launchTemplate: ec2.LaunchTemplate.fromLaunchTemplateAttributes(stack, 'imported-template', {
        launchTemplateName: 'test-template',
        versionNumber: '0',
      }),
      vpc: mockVpc(stack),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AutoScaling::AutoScalingGroup', {
      LaunchTemplate: {
        LaunchTemplateName: 'test-template',
        Version: '0',
      },
    });
  });

  test('can use in-stack Launch Template reference', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const launchTemplate = new ec2.LaunchTemplate(stack, 'template', {
      instanceType: new ec2.InstanceType('t3.micro'),
      machineImage: new ec2.AmazonLinuxImage({
        generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2,
        cpuType: ec2.AmazonLinuxCpuType.X86_64,
      }),
    });

    new autoscaling.AutoScalingGroup(stack, 'imported-template-asg', {
      launchTemplate,
      vpc: mockVpc(stack),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AutoScaling::AutoScalingGroup', {
      LaunchTemplate: {
        LaunchTemplateId: {
          Ref: 'template75933436',
        },
        Version: {
          'Fn::GetAtt': [
            'template75933436',
            'LatestVersionNumber',
          ],
        },
      },
    });
  });
});