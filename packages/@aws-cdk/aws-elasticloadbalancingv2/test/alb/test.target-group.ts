import ec2 = require('@aws-cdk/aws-ec2');
import cdk = require('@aws-cdk/core');
import { Test } from 'nodeunit';
import elbv2 = require('../../lib');
import { InstanceTarget } from '../../lib';
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
      tg.addTarget(new InstanceTarget('i-1234'));
    }, /Cannot add a non-self registering target to an imported TargetGroup/);

    test.done();
  }
};