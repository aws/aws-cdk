import { expect, haveResource } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import { Test } from 'nodeunit';
import * as ecs from '../lib';

export = {
  "A task definition with both compatibilities defaults to networkmode AwsVpc"(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new ecs.TaskDefinition(stack, 'TD', {
      cpu: '512',
      memoryMiB: '512',
      compatibility: ecs.Compatibility.EC2_AND_FARGATE,
    });

    // THEN
    expect(stack).to(haveResource('AWS::ECS::TaskDefinition', {
      NetworkMode: "awsvpc",
    }));

    test.done();
  }
};
