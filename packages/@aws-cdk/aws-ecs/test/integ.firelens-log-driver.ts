import { App, Stack } from '@aws-cdk/core';
import { IntegTest } from '@aws-cdk/integ-tests';

import { ContainerImage, Ec2TaskDefinition, LogDrivers } from '../lib';

const app = new App();

const stack = new Stack(app, 'Stack');

const taskDefinition = new Ec2TaskDefinition(stack, 'TaskDefinition');

const image = ContainerImage.fromRegistry('test-image');

// The container with the cloudwatch plugin
taskDefinition.addContainer('ContainerWithCloudWatchPlugin', {
  image,
  logging: LogDrivers.firelens({
    options: {
      Name: 'cloudwatch',
      region: 'us-west-2',
      log_group_name: 'cloudwatch_container_log_group',
      auto_create_group: 'true',
      log_stream_prefix: 'from-fluent-bit',
    },
  }),
  memoryLimitMiB: 128,
});

// The container with the cloudwatch_logs plugin
taskDefinition.addContainer('ContainerWithCloudWatchLogsPlugin', {
  image,
  logging: LogDrivers.firelens({
    options: {
      Name: 'cloudwatch_logs',
      region: 'us-west-2',
      log_group_name: 'cloudwatch_logs_container_log_group',
      auto_create_group: 'true',
      log_stream_prefix: 'from-fluent-bit',
    },
  }),
  memoryLimitMiB: 128,
});

new IntegTest(app, 'FireLensLogDriverTest', {
  testCases: [stack],
});

app.synth();