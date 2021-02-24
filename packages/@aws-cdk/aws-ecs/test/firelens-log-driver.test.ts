import { expect, haveResourceLike } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import { nodeunitShim, Test } from 'nodeunit-shim';
import * as ecs from '../lib';

let stack: cdk.Stack;
let td: ecs.TaskDefinition;
const image = ecs.ContainerImage.fromRegistry('test-image');

nodeunitShim({
  'setUp'(cb: () => void) {
    stack = new cdk.Stack();
    td = new ecs.Ec2TaskDefinition(stack, 'TaskDefinition');

    cb();
  },
  'create a firelens log driver with default options'(test: Test) {
    // WHEN
    td.addContainer('Container', {
      image,
      logging: ecs.LogDrivers.firelens({}),
      memoryLimitMiB: 128,
    });

    // THEN
    expect(stack).to(haveResourceLike('AWS::ECS::TaskDefinition', {
      ContainerDefinitions: [
        {
          LogConfiguration: {
            LogDriver: 'awsfirelens',
          },
        },
        {
          Essential: true,
          FirelensConfiguration: {
            Type: 'fluentbit',
          },
        },
      ],
    }));

    test.done();
  },

  'create a firelens log driver to route logs to CloudWatch Logs with Fluent Bit'(test: Test) {
    // WHEN
    td.addContainer('Container', {
      image,
      logging: ecs.LogDrivers.firelens({
        options: {
          Name: 'cloudwatch',
          region: 'us-west-2',
          log_group_name: 'firelens-fluent-bit',
          auto_create_group: 'true',
          log_stream_prefix: 'from-fluent-bit',
        },
      }),
      memoryLimitMiB: 128,
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
              log_stream_prefix: 'from-fluent-bit',
            },
          },
        },
        {
          Essential: true,
          FirelensConfiguration: {
            Type: 'fluentbit',
          },
        },
      ],
    }));

    test.done();
  },

  'create a firelens log driver to route logs to kinesis firehose Logs with Fluent Bit'(test: Test) {
    // WHEN
    td.addContainer('Container', {
      image,
      logging: ecs.LogDrivers.firelens({
        options: {
          Name: 'firehose',
          region: 'us-west-2',
          delivery_stream: 'my-stream',
        },
      }),
      memoryLimitMiB: 128,
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
            },
          },
        },
        {
          Essential: true,
          FirelensConfiguration: {
            Type: 'fluentbit',
          },
        },
      ],
    }));

    test.done();
  },

  'Firelens Configuration': {
    'fluentd log router container'(test: Test) {
      // GIVEN
      td.addFirelensLogRouter('log_router', {
        image: ecs.ContainerImage.fromRegistry('fluent/fluentd'),
        firelensConfig: {
          type: ecs.FirelensLogRouterType.FLUENTD,
        },
        memoryReservationMiB: 50,
      });

      // THEN
      expect(stack).to(haveResourceLike('AWS::ECS::TaskDefinition', {
        ContainerDefinitions: [
          {
            Essential: true,
            Image: 'fluent/fluentd',
            MemoryReservation: 50,
            Name: 'log_router',
            FirelensConfiguration: {
              Type: 'fluentd',
            },
          },
        ],
      }));
      test.done();
    },

    'fluent-bit log router container with options'(test: Test) {
      // GIVEN
      const stack2 = new cdk.Stack(undefined, 'Stack2', { env: { region: 'us-east-1' } });
      const td2 = new ecs.Ec2TaskDefinition(stack2, 'TaskDefinition');
      td2.addFirelensLogRouter('log_router', {
        image: ecs.obtainDefaultFluentBitECRImage(td2, undefined, '2.1.0'),
        firelensConfig: {
          type: ecs.FirelensLogRouterType.FLUENTBIT,
          options: {
            enableECSLogMetadata: false,
            configFileValue: 'arn:aws:s3:::mybucket/fluent.conf',
          },
        },
        logging: new ecs.AwsLogDriver({ streamPrefix: 'firelens' }),
        memoryReservationMiB: 50,
      });

      // THEN
      expect(stack2).to(haveResourceLike('AWS::ECS::TaskDefinition', {
        ContainerDefinitions: [
          {
            Essential: true,
            MemoryReservation: 50,
            Name: 'log_router',
            FirelensConfiguration: {
              Type: 'fluentbit',
              Options: {
                'enable-ecs-log-metadata': 'false',
                'config-file-type': 's3',
                'config-file-value': 'arn:aws:s3:::mybucket/fluent.conf',
              },
            },
          },
        ],
      }));

      test.done();
    },

    'fluent-bit log router with file config type'(test: Test) {
      // GIVEN
      td.addFirelensLogRouter('log_router', {
        image: ecs.obtainDefaultFluentBitECRImage(td, undefined, '2.1.0'),
        firelensConfig: {
          type: ecs.FirelensLogRouterType.FLUENTBIT,
          options: {
            enableECSLogMetadata: false,
            configFileType: ecs.FirelensConfigFileType.FILE,
            configFileValue: '/my/working/dir/firelens/config',
          },
        },
        logging: new ecs.AwsLogDriver({ streamPrefix: 'firelens' }),
        memoryReservationMiB: 50,
      });

      // THEN
      expect(stack).to(haveResourceLike('AWS::ECS::TaskDefinition', {
        ContainerDefinitions: [
          {
            Essential: true,
            MemoryReservation: 50,
            Name: 'log_router',
            FirelensConfiguration: {
              Type: 'fluentbit',
              Options: {
                'enable-ecs-log-metadata': 'false',
                'config-file-type': 'file',
                'config-file-value': '/my/working/dir/firelens/config',
              },
            },
          },
        ],
      }));

      test.done();
    },
  },
});
