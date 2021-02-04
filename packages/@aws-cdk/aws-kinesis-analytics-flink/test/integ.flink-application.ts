import * as path from 'path';
import * as core from '@aws-cdk/core';
import * as ka from '../lib';

const app = new core.App();
const stack = new core.Stack(app, 'FlinkAppTest');

new ka.FlinkApplication(stack, 'App', {
  code: ka.ApplicationCode.fromAsset(path.join(__dirname, 'code-asset')),
  runtime: ka.FlinkRuntime.FLINK_1_11,
});

app.synth();
