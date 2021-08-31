import * as path from 'path';
import * as cdk from '@aws-cdk/core';
import * as glue from '../lib';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-glue-job');

const script = glue.Code.fromAsset(path.join(__dirname, 'job-script/hello_world.py'));

new glue.Job(stack, 'MinimalGlueEtlJob', {
  executable: glue.JobExecutable.pythonEtl({
    glueVersion: glue.GlueVersion.V2_0,
    pythonVersion: glue.PythonVersion.THREE,
    script,
  }),
});

new glue.Job(stack, 'MinimalGlueStreamingJob', {
  executable: glue.JobExecutable.pythonStreaming({
    glueVersion: glue.GlueVersion.V2_0,
    pythonVersion: glue.PythonVersion.THREE,
    script,
  }),
});

new glue.Job(stack, 'MinimalPythonShellJob', {
  executable: glue.JobExecutable.pythonShell({
    glueVersion: glue.GlueVersion.V2_0,
    pythonVersion: glue.PythonVersion.THREE,
    script,
  }),
});

const etlJob = new glue.Job(stack, 'Job', {
  executable: glue.JobExecutable.pythonEtl({
    glueVersion: glue.GlueVersion.V2_0,
    pythonVersion: glue.PythonVersion.THREE,
    script,
  }),
  workerType: glue.WorkerType.G_2X,
  numberOfWorkers: 10,
  maxConcurrentRuns: 2,
  maxRetries: 2,
  timeout: cdk.Duration.minutes(5),
  notifyDelayAfter: cdk.Duration.minutes(1),
  defaultArguments: {
    arg1: 'value1',
    arg2: 'value2',
  },
  tags: {
    key: 'value',
  },
});

etlJob.metricSuccess();

app.synth();
