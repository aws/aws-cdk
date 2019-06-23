import { expect, haveResourceLike } from '@aws-cdk/assert';
import cdk = require('@aws-cdk/cdk');
import { Test } from 'nodeunit';
import ecs = require('../../lib');

export = {
  "When creating an Fargate TaskDefinition": {
    "with only required properties set, it correctly sets default properties"(test: Test) {
      // GIVEN
      const stack = new cdk.Stack();
      new ecs.FargateTaskDefinition(stack, 'FargateTaskDef');

      // THEN
      expect(stack).to(haveResourceLike("AWS::ECS::TaskDefinition", {
        Family: "FargateTaskDef",
        ContainerDefinitions: [],
        Volumes: [],
        NetworkMode: ecs.NetworkMode.AWS_VPC,
        RequiresCompatibilities: ["FARGATE"],
        Cpu: "256",
        Memory: "512",
      }));

      // test error if no container defs?
      test.done();
    },
  }
};
