import * as ec2 from '@aws-cdk/aws-ec2';
import * as cdk from '@aws-cdk/core';
import { Test } from 'nodeunit';
import * as elbv2 from '../../lib';
import { FakeSelfRegisteringTarget } from '../helpers';

export = {
  'Empty target Group without type still requires a VPC'(test: Test) {
    // GIVEN
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'Stack');

    // WHEN
    new elbv2.ApplicationTargetGroup(stack, 'LB', {});

    // THEN
    test.throws(() => {
      app.synth();
    }, /'vpc' is required for a non-Lambda TargetGroup/);

    test.done();
  },

  'Can add self-registering target to imported TargetGroup'(test: Test) {
    // GIVEN
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'Stack');
    const vpc = new ec2.Vpc(stack, 'Vpc');

    // WHEN
    const tg = elbv2.ApplicationTargetGroup.fromTargetGroupAttributes(stack, 'TG', {
      targetGroupArn: 'arn'
    });
    tg.addTarget(new FakeSelfRegisteringTarget(stack, 'Target', vpc));

    // THEN
    test.done();
  },

  'Cannot add direct target to imported TargetGroup'(test: Test) {
    // GIVEN
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'Stack');
    const tg = elbv2.ApplicationTargetGroup.fromTargetGroupAttributes(stack, 'TG', {
      targetGroupArn: 'arn'
    });

    // WHEN
    test.throws(() => {
      tg.addTarget(new elbv2.InstanceTarget('i-1234'));
    }, /Cannot add a non-self registering target to an imported TargetGroup/);

    test.done();
  }
};
