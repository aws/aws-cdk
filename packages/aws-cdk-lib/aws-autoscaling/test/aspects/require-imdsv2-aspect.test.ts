import { Annotations, Match, Template } from '../../../assertions';
import * as ec2 from '../../../aws-ec2';
import * as cdk from '../../../core';
import { AUTOSCALING_GENERATE_LAUNCH_TEMPLATE } from '../../../cx-api';
import {
  AutoScalingGroup,
  AutoScalingGroupRequireImdsv2Aspect,
  CfnLaunchConfiguration,
} from '../../lib';

describe('AutoScalingGroupRequireImdsv2Aspect', () => {
  let app: cdk.App;
  let stack: cdk.Stack;
  let vpc: ec2.Vpc;

  beforeEach(() => {
    app = new cdk.App();
    stack = new cdk.Stack(app, 'Stack');
    vpc = new ec2.Vpc(stack, 'Vpc');
  });

  test('warns when metadataOptions is a token', () => {
    // GIVEN
    const asg = new AutoScalingGroup(stack, 'AutoScalingGroup', {
      vpc,
      instanceType: new ec2.InstanceType('t2.micro'),
      machineImage: ec2.MachineImage.latestAmazonLinux(),
    });
    const launchConfig = asg.node.tryFindChild('LaunchConfig') as CfnLaunchConfiguration;
    launchConfig.metadataOptions = cdk.Token.asAny({
      httpEndpoint: 'https://bla.com',
    } as CfnLaunchConfiguration.MetadataOptionsProperty);
    const aspect = new AutoScalingGroupRequireImdsv2Aspect();

    // WHEN
    cdk.Aspects.of(stack).add(aspect);

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AutoScaling::LaunchConfiguration', Match.not({
      MetadataOptions: {
        HttpTokens: 'required',
      },
    }));

    Annotations.fromStack(stack).hasWarning('/Stack/AutoScalingGroup', Match.stringLikeRegexp('.*CfnLaunchConfiguration.MetadataOptions field is a CDK token.'));
  });

  test('requires IMDSv2', () => {
    // GIVEN
    new AutoScalingGroup(stack, 'AutoScalingGroup', {
      vpc,
      instanceType: new ec2.InstanceType('t2.micro'),
      machineImage: ec2.MachineImage.latestAmazonLinux(),
    });
    const aspect = new AutoScalingGroupRequireImdsv2Aspect();

    // WHEN
    cdk.Aspects.of(stack).add(aspect);

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AutoScaling::LaunchConfiguration', {
      MetadataOptions: {
        HttpTokens: 'required',
      },
    });
  });
});

describe('AutoScalingGroupRequireImdsv2Aspect with AUTOSCALING_GENERATE_LAUNCH_TEMPLATE feature flag', () => {
  let app: cdk.App;
  let stack: cdk.Stack;
  let vpc: ec2.Vpc;

  beforeEach(() => {
    app = new cdk.App();
    stack = new cdk.Stack(app, 'Stack');
    stack.node.setContext(AUTOSCALING_GENERATE_LAUNCH_TEMPLATE, true);
    vpc = new ec2.Vpc(stack, 'Vpc');
  });

  test('warns when launchTemplateData for LaunchTemplate is a token', () => {
    // GIVEN
    const asg = new AutoScalingGroup(stack, 'AutoScalingGroup', {
      vpc,
      instanceType: new ec2.InstanceType('t2.micro'),
      machineImage: ec2.MachineImage.latestAmazonLinux2(),
    });
    const launchTemplate = asg.node.tryFindChild('LaunchTemplate') as ec2.LaunchTemplate;
    const cfnLaunchTemplate = launchTemplate.node.tryFindChild('Resource') as ec2.CfnLaunchTemplate;
    cfnLaunchTemplate.launchTemplateData = cdk.Token.asAny({
      kernelId: 'asfd',
    } as ec2.CfnLaunchTemplate.LaunchTemplateDataProperty);
    const aspect = new AutoScalingGroupRequireImdsv2Aspect();

    // WHEN
    cdk.Aspects.of(stack).add(aspect);

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::EC2::LaunchTemplate', Match.not({
      LaunchTemplateData: {
        KernelId: 'asfd',
        MetadataOptions: {
          HttpTokens: 'required',
        },
      },
    }));

    Annotations.fromStack(stack).hasWarning('/Stack/AutoScalingGroup', Match.stringLikeRegexp('.*CfnLaunchTemplate.LaunchTemplateData field is a CDK token.'));
  });

  test('warns when metadataOptions for LaunchTemplate is a token', () => {
    // GIVEN
    const asg = new AutoScalingGroup(stack, 'AutoScalingGroup', {
      vpc,
      instanceType: new ec2.InstanceType('t2.micro'),
      machineImage: ec2.MachineImage.latestAmazonLinux2(),
    });
    const launchTemplate = asg.node.tryFindChild('LaunchTemplate') as ec2.LaunchTemplate;
    const cfnLaunchTemplate = launchTemplate.node.tryFindChild('Resource') as ec2.CfnLaunchTemplate;
    cfnLaunchTemplate.launchTemplateData = {
      metadataOptions: cdk.Token.asAny({
        httpEndpoint: 'https://bla.com',
      } as ec2.CfnLaunchTemplate.MetadataOptionsProperty),
    } as ec2.CfnLaunchTemplate.LaunchTemplateDataProperty;

    const aspect = new AutoScalingGroupRequireImdsv2Aspect();

    // WHEN
    cdk.Aspects.of(stack).add(aspect);

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::EC2::LaunchTemplate', Match.not({
      LaunchTemplateData: {
        MetadataOptions: {
          HttpTokens: 'required',
        },
      },
    }));

    Annotations.fromStack(stack).hasWarning('/Stack/AutoScalingGroup', Match.stringLikeRegexp('.*CfnLaunchTemplate.LaunchTemplateData.MetadataOptions field is a CDK token.'));
  });

  test('requires IMDSv2 for LaunchTemplate', () => {
    // GIVEN
    new AutoScalingGroup(stack, 'AutoScalingGroup', {
      vpc,
      instanceType: new ec2.InstanceType('t2.micro'),
      machineImage: ec2.MachineImage.latestAmazonLinux2(),
    });
    const aspect = new AutoScalingGroupRequireImdsv2Aspect();

    // WHEN
    cdk.Aspects.of(stack).add(aspect);

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::EC2::LaunchTemplate', {
      LaunchTemplateData: {
        MetadataOptions: {
          HttpTokens: 'required',
        },
      },
    });
  });
});
