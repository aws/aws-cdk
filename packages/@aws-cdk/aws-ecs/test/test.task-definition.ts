import { expect, haveResource } from '@aws-cdk/assert';
import cdk = require('@aws-cdk/cdk');
import { Test } from 'nodeunit';
import ecs = require('../lib');

export = {
  "A task definition with both compatibilities defaults to networkmode AwsVpc"(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new ecs.TaskDefinition(stack, 'TD', {
      cpu: '512',
      memoryMiB: '512',
      compatibility: ecs.Compatibility.Ec2AndFargate,
    });

    // THEN
    expect(stack).to(haveResource('AWS::ECS::TaskDefinition', {
      NetworkMode: "awsvpc",
    }));

    test.done();
  }
};
