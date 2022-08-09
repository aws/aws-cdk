import { Annotations, Match, Template } from '@aws-cdk/assertions';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as cdk from '@aws-cdk/core';
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