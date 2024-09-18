import * as path from 'path';
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';
import * as core from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as flink from '../lib';

const app = new core.App();
const stack = new core.Stack(app, 'FlinkAppTest');

const flinkRuntimes = [
  flink.Runtime.FLINK_1_6,
  flink.Runtime.FLINK_1_8,
  flink.Runtime.FLINK_1_11,
  flink.Runtime.FLINK_1_13,
  flink.Runtime.FLINK_1_15,
  flink.Runtime.FLINK_1_18,
  flink.Runtime.FLINK_1_19,
  flink.Runtime.FLINK_1_20,
];

flinkRuntimes.forEach((runtime) => {
  const flinkApp = new flink.Application(stack, `App-${runtime.value}`, {
    code: flink.ApplicationCode.fromAsset(path.join(__dirname, 'code-asset')),
    runtime: runtime,
  });

  new cloudwatch.Alarm(stack, `Alarm-${runtime.value}`, {
    metric: flinkApp.metricFullRestarts(),
    evaluationPeriods: 1,
    threshold: 3,
  });
});

new integ.IntegTest(app, 'ApplicationTest', {
  testCases: [stack],
});
