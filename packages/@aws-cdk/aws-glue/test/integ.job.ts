import * as path from 'path';
import * as s3_assets from '@aws-cdk/aws-s3-assets';
import * as cdk from '@aws-cdk/core';
import * as glue from '../lib';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-glue-job');

const script = new s3_assets.Asset(stack, 'script', {
  path: path.join(__dirname, 'job-script/hello_world.py'),
});

const minimalEtlJob = new glue.Job(stack, 'MinimalGlueEtlJob', {
  executable: glue.JobExecutable.pythonEtl({
    glueVersion: glue.GlueVersion.V2_0,
    pythonVersion: glue.PythonVersion.THREE,
    scriptLocation: script.s3ObjectUrl,
  }),
});
script.bucket.grantRead(minimalEtlJob.role);

const minimalStreamingJob = new glue.Job(stack, 'MinimalGlueStreamingJob', {
  executable: glue.JobExecutable.pythonStreaming({
    glueVersion: glue.GlueVersion.V2_0,
    pythonVersion: glue.PythonVersion.THREE,
    scriptLocation: script.s3ObjectUrl,
  }),
});
script.bucket.grantRead(minimalStreamingJob.role);

const minimalPythonShellJob = new glue.Job(stack, 'MinimalPythonShellJob', {
  executable: glue.JobExecutable.pythonShell({
    glueVersion: glue.GlueVersion.V2_0,
    pythonVersion: glue.PythonVersion.THREE,
    scriptLocation: script.s3ObjectUrl,
  }),
});
script.bucket.grantRead(minimalPythonShellJob.role);

const etlJob = new glue.Job(stack, 'Job', {
  executable: glue.JobExecutable.pythonEtl({
    glueVersion: glue.GlueVersion.V2_0,
    pythonVersion: glue.PythonVersion.THREE,
    scriptLocation: script.s3ObjectUrl,
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
script.bucket.grantRead(etlJob.role);

etlJob.metricSuccess();

app.synth();
