import { expect, haveResource } from '@aws-cdk/assert';
import ec2 = require('@aws-cdk/aws-ec2');
import events = require('@aws-cdk/aws-events');
import cdk = require('@aws-cdk/cdk');
import { Test } from 'nodeunit';
import ecs = require('../../lib');

export = {
  "Can use EC2 taskdef as EventRule target"(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.VpcNetwork(stack, 'Vpc', { maxAZs: 1 });
    const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
    cluster.addCapacity('DefaultAutoScalingGroup', {
      instanceType: new ec2.InstanceType('t2.micro')
    });

    const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDef');
    taskDefinition.addContainer('TheContainer', {
      image: ecs.ContainerImage.fromRegistry('henk'),
      memoryLimitMiB: 256
    });

    const rule = new events.EventRule(stack, 'Rule', {
      scheduleExpression: 'rate(1 minute)',
    });

    // WHEN
    const target = new ecs.Ec2EventRuleTarget(stack, 'EventTarget', {
      cluster,
      taskDefinition,
      taskCount: 1
    });

    rule.addTarget(target, {
      jsonTemplate: {
        argument: 'hello'
      }
    });

    // THEN
    expect(stack).to(haveResource('AWS::Events::Rule', {
      Targets: [
        {
          Arn: { "Fn::GetAtt": ["EcsCluster97242B84", "Arn"] },
          EcsParameters: {
            TaskCount: 1,
            TaskDefinitionArn: { Ref: "TaskDef54694570" }
          },
          Id: "EventTarget",
          InputTransformer: {
            InputTemplate: "{\"argument\":\"hello\"}"
          },
          RoleArn: { "Fn::GetAtt": ["TaskDefEventsRole7BD19E45", "Arn"] }
        }
      ]
    }));

    test.done();
  }
};
