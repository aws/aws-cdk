import { expect, haveResourceLike } from '@aws-cdk/assert';
import cdk = require('@aws-cdk/core');
import { Test } from 'nodeunit';
import ecs = require('../lib');

let stack: cdk.Stack;
let td: ecs.TaskDefinition;
const image = ecs.ContainerImage.fromRegistry('test-image');

export = {
  'setUp'(cb: () => void) {
    stack = new cdk.Stack();
    td = new ecs.Ec2TaskDefinition(stack, 'TaskDefinition');

    cb();
  },

  'create a firelens log driver without options'(test: Test) {
    // WHEN
    td.addContainer('Container', {
      image,
      logging: new ecs.FireLensLogDriver({}),
      memoryLimitMiB: 128
    });

    // THEN
    expect(stack).to(haveResourceLike('AWS::ECS::TaskDefinition', {
      ContainerDefinitions: [
        {
          LogConfiguration: {
            LogDriver: 'awsfirelens'
          }
        }
      ]
    }));

    test.done();
  },

  'create a firelens log driver to route logs to CloudWatch Logs with Fluent Bit'(test: Test) {
    // WHEN
    td.addContainer('Container', {
      image,
      logging: new ecs.FireLensLogDriver({
        options: {
            Name: 'cloudwatch',
            region: 'us-west-2',
            log_group_name: 'firelens-fluent-bit',
            auto_create_group: 'true',
            log_stream_prefix: 'from-fluent-bit'
        }
      }),
      memoryLimitMiB: 128
    });

    // THEN
    expect(stack).to(haveResourceLike('AWS::ECS::TaskDefinition', {
      ContainerDefinitions: [
        {
          LogConfiguration: {
            LogDriver: 'awsfirelens',
            Options: {
                Name: 'cloudwatch',
                region: 'us-west-2',
                log_group_name: 'firelens-fluent-bit',
                auto_create_group: 'true',
                log_stream_prefix: 'from-fluent-bit'
            }
          }
        }
      ]
    }));

    test.done();
  },

  'create a firelens log driver to route logs to kinesis firehose Logs with Fluent Bit'(test: Test) {
    // WHEN
    td.addContainer('Container', {
      image,
      logging: new ecs.FireLensLogDriver({
        options: {
            Name: 'firehose',
            region: 'us-west-2',
            delivery_stream: 'my-stream',
        }
      }),
      memoryLimitMiB: 128
    });

    // THEN
    expect(stack).to(haveResourceLike('AWS::ECS::TaskDefinition', {
      ContainerDefinitions: [
        {
          LogConfiguration: {
            LogDriver: 'awsfirelens',
            Options: {
                Name: 'firehose',
                region: 'us-west-2',
                delivery_stream: 'my-stream',
            }
          }
        }
      ]
    }));

    test.done();
  },
};
