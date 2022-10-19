import * as path from 'path';
import * as cdk from '@aws-cdk/core';
import * as glue from '../lib';

/**
 * To verify the ability to run jobs created in this test
 *
 * Run the job using
 *   `aws glue start-job-run --region us-east-1 --job-name <job name>`
 * This will return a runId
 *
 * Get the status of the job run using
 *   `aws glue get-job-run --region us-east-1 --job-name <job name> --run-id <runId>`
 *
 * For example, to test the ShellJob
 * - Run: `aws glue start-job-run --region us-east-1 --job-name ShellJob`
 * - Get Status: `aws glue get-job-run --region us-east-1 --job-name ShellJob --run-id <runId output by the above command>`
 * - Check output: `aws logs get-log-events --region us-east-1 --log-group-name "/aws-glue/python-jobs/output" --log-stream-name "<runId>>` which should show "hello world"
 */
const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-glue-job');

const script = glue.Code.fromAsset(path.join(__dirname, 'job-script/hello_world.py'));

const etlJob = new glue.Job(stack, 'EtlJob', {
  jobName: 'EtlJob',
  executable: glue.JobExecutable.pythonEtl({
    glueVersion: glue.GlueVersion.V2_0,
    pythonVersion: glue.PythonVersion.THREE,
    script,
  }),
  workerType: glue.WorkerType.G_2X,
  workerCount: 10,
  maxConcurrentRuns: 2,
  maxRetries: 2,
  timeout: cdk.Duration.minutes(5),
  notifyDelayAfter: cdk.Duration.minutes(1),
  defaultArguments: {
    arg1: 'value1',
    arg2: 'value2',
  },
  sparkUI: {
    enabled: true,
  },
  continuousLogging: {
    enabled: true,
    quiet: true,
    logStreamPrefix: 'EtlJob',
  },
  tags: {
    key: 'value',
  },
});
etlJob.metricSuccess();

new glue.Job(stack, 'StreamingJob', {
  jobName: 'StreamingJob',
  executable: glue.JobExecutable.pythonStreaming({
    glueVersion: glue.GlueVersion.V2_0,
    pythonVersion: glue.PythonVersion.THREE,
    script,
  }),
  defaultArguments: {
    arg1: 'value1',
    arg2: 'value2',
  },
  tags: {
    key: 'value',
  },
});

new glue.Job(stack, 'ShellJob', {
  jobName: 'ShellJob',
  executable: glue.JobExecutable.pythonShell({
    glueVersion: glue.GlueVersion.V1_0,
    pythonVersion: glue.PythonVersion.THREE,
    script,
  }),
  defaultArguments: {
    arg1: 'value1',
    arg2: 'value2',
  },
  tags: {
    key: 'value',
  },
});

new glue.Job(stack, 'ShellJob39', {
  jobName: 'ShellJob39',
  executable: glue.JobExecutable.pythonShell({
    glueVersion: glue.GlueVersion.V1_0,
    pythonVersion: glue.PythonVersion.THREE_NINE,
    script,
  }),
  defaultArguments: {
    arg1: 'value1',
    arg2: 'value2',
  },
  tags: {
    key: 'value',
  },
});

app.synth();
