import {
  expect as expectCDK,
  haveResourceLike,
} from '@aws-cdk/assert-internal';
import '@aws-cdk/assert-internal/jest';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as cdk from '@aws-cdk/core';
import * as sinon from 'sinon';
import {
  AutoScalingGroup,
  AutoScalingGroupImdsAspect,
  CfnLaunchConfiguration,
} from '../../lib';

describe('ImdsAspect', () => {
  let app: cdk.App;
  let stack: cdk.Stack;
  let vpc: ec2.Vpc;

  beforeEach(() => {
    app = new cdk.App();
    stack = new cdk.Stack(app, 'Stack');
    vpc = new ec2.Vpc(stack, 'Vpc');
  });

  test('suppresses warnings', () => {
    // GIVEN
    const aspect = new AutoScalingGroupImdsAspect({
      enableImdsV1: true,
      suppressWarnings: true,
    });
    const errmsg = 'ERROR';
    const stub = sinon.stub(aspect, 'visit').callsFake((node) => {
      // @ts-ignore
      aspect.warn(node, errmsg);
    });
    const construct = new cdk.Construct(stack, 'Construct');

    // WHEN
    aspect.visit(construct);

    // THEN
    expect(stub.calledOnce).toBeTruthy();
    expect(construct.node.metadataEntry).not.toContainEqual({
      data: expect.stringContaining(errmsg),
      type: 'aws:cdk:warning',
      trace: undefined,
    });
  });

  describe('AutoScalingGroupImdsAspect', () => {
    test('warns when metadataOptions is a token', () => {
      // GIVEN
      const asg = new AutoScalingGroup(stack, 'AutoScalingGroup', {
        vpc,
        instanceType: new ec2.InstanceType('t2.micro'),
        machineImage: ec2.MachineImage.latestAmazonLinux(),
      });
      const launchConfig = asg.node.tryFindChild('LaunchConfig') as CfnLaunchConfiguration;
      launchConfig.metadataOptions = fakeToken();
      const aspect = new AutoScalingGroupImdsAspect({ enableImdsV1: false });

      // WHEN
      aspect.visit(asg);

      // THEN
      expect(asg.node.metadataEntry).toContainEqual({
        data: expect.stringContaining('CfnLaunchConfiguration.MetadataOptions field is a CDK token.'),
        type: 'aws:cdk:warning',
        trace: undefined,
      });
      expectCDK(stack).notTo(haveResourceLike('AWS::AutoScaling::LaunchConfiguration', {
        MetadataOptions: {
          HttpTokens: 'required',
        },
      }));
    });

    test.each([
      [true],
      [false],
    ])('toggles IMDSv1 (enabled=%s)', (enableImdsV1: boolean) => {
      // GIVEN
      const asg = new AutoScalingGroup(stack, 'AutoScalingGroup', {
        vpc,
        instanceType: new ec2.InstanceType('t2.micro'),
        machineImage: ec2.MachineImage.latestAmazonLinux(),
      });
      const aspect = new AutoScalingGroupImdsAspect({ enableImdsV1 });

      // WHEN
      aspect.visit(asg);

      // THEN
      expectCDK(stack).to(haveResourceLike('AWS::AutoScaling::LaunchConfiguration', {
        MetadataOptions: {
          HttpTokens: enableImdsV1 ? 'optional' : 'required',
        },
      }));
    });
  });
});

function fakeToken(): cdk.IResolvable {
  return {
    creationStack: [],
    resolve: (_c) => {},
    toString: () => '',
  };
}
